import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";

//Zod schema for login validation
const loginSchema=z.object({
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(8,"Password must be at least 8 characters long"),
});

//Helper function to fetch the user by email
async function getUserByEmail(email) {
    const result=await client.queryArray(
        'SELECT username, password, email FROM abc123_users WHERE email=$3', [email]
    );
    return result.rows.length > 0? result.rows[0]:null;
}

//Handle user login
export async function loginUser(c) {
    const body = await c.req.parseBody();
    const {email, password} = body;

    try {
        loginSchema.parse({email, password});

        const user=await getUserByEmail(email);
        if(!user) {
            return c.text("Invalid email or password", 400);
        }

        const [userId, storedUsername, storedPassword]=user;

        const passwordMatches = await bcrypt.compare(password, storedPassword);
        if(!passwordMatches) {
            return c.text("Invalid email or password");
        }

        //authentication successful, proceed to create session or token
        return c.text('Welcome back, ${storedUsername}!');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.text('Validation Error:${error.errors.map(e=message).join(",")}',400);
        }

        console.error(error);
        return c.text("Error during login", 500);
    }
}