import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"; // For password hashing 
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts"; // Import Zod 

// Zod schema for validating the registration form 
const registerSchema = z.object({ 
    email: z.string().email({ message: "Invalid email address" }).max(50, "Email must not exceed 50 characters"), 
    password: z.string().min(8, "Password must be at least 8 characters long"), 
   
    role: z.enum(["reserver", "administrator"], { message: "Invalid role" }), 
    });

// Helper function to validate if a string is a valid email 
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Helper function to check if email already exists 
async function isUniqueEmail(email) {
    const result = await client.queryArray(`SELECT email FROM abc123_users WHERE email = $1`, [email]);
    return result.rows.length === 0;
}

// Handle user registration (form submission) 
export async function registerUser(c) {
    const body = await c.req.parseBody();
    const username = body.username;
    const password = body.password;
    const email = body.email;
    const pseudonym = body.pseudonym;
    const age = body.age;
    const role = body.role;
    const consent = body.consent;

    try {
        //THIS PART NOT IN USE! Validate if username is an email 
        //if (!isValidEmail(username)) {
          //  return c.text('Invalid email address', 400);
        //}

        // Validate username length (max 50 characters) 
        if (email.length > 50) {
            return c.text('Email must not exceed 50 characters', 400);
        }

        // Check if the email is unique 
        if (!(await isUniqueEmail(email))) {
            return c.text('Email already in use', 400);
        }

        if (age === "" || isNaN(age)) {
            return c.json({ error: "Age must be a valid number and cannot be empty" }, 400);
          }

        // Hash the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const result = await client.queryArray(
            'INSERT INTO abc123_users (username, password, email, pseudonym, role, age, consent) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [username, hashedPassword, email, pseudonym, role, age, consent]
        );

        // Success response
        return c.redirect('/successresponse.html');
        

    } catch (error) {
        console.error(error);
        return c.text('Error during registration', 500);
        
    }
};