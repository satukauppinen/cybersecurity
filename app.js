import { Hono } from "https://deno.land/x/hono/mod.ts"; 
import client from "./db/db.js"; 
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"; // For password hashing 

const app = new Hono(); 

// Serve the registration form 
app.get('/register', async (c) => { return c.html(await Deno.readTextFile('./views/register.html')); 
}); 
// Handle user registration (form submission) 
app.post('/register', async (c) => {
    const body = await c.req.parseBody();
    const username = body.username;
    const password = body.password;
    const email = body.email;
    const pseudonym = body.pseudonym;
    const age = body.age;
    const role = body.role;
    const consent = body.consent
    try {
        // Hash the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const result = await client.queryArray(
            'INSERT INTO abc123_users (username, password, email, pseudonym, role, age, consent) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [username, hashedPassword, email, pseudonym, role, age, consent]
        );

        // Success response
        return c.text('User registered successfully!');
    } catch (error) {
        console.error(error);
        return c.text('Error during registration', 500);
    }
});


Deno.serve(app.fetch);
console.log('Server running on http://localhost:3000');

