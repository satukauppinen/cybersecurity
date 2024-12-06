import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";
import { sessionStore } from "../auth.js";

// Zod schema for login validation
const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Helper function to fetch the user by email
async function getUserByEmail(email) {
    const result = await client.queryObject(
        'SELECT user_id, username, password, email, role FROM abc123_users WHERE email=$1', 
        [email]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}

// Handle user login
export async function loginUser(c) {
    const body = await c.req.parseBody();
    const { email, password } = body;

    try {
        // Validate input
        loginSchema.parse({ email, password });

        // Fetch user
        const user = await getUserByEmail(email);
        if (!user) {
            return c.text("Invalid email or password", 400);
        }

        const { user_id, username, password: storedPassword, role } = user;

        // Compare passwords
        const passwordMatches = await bcrypt.compare(password, storedPassword);
        if (!passwordMatches) {
            return c.text("Invalid email or password", 400);
        }

        // Store user info in session
        const sessionId = Math.random().toString(36).substring(2);
        sessionStore.set(sessionId, { userId: user_id, username, role });
        c.res.headers.set('Set-Cookie', `session_id=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict`);

        // Authentication successful
        return c.redirect('/');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.text(`Validation Error: ${error.errors.map(e => e.message).join(",")}`, 400);
        }
        console.error(error);
        return c.text("Error during login", 500);
    }
}
