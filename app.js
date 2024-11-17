import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { registerUser } from "./routes/register.js"; // Import register logic

const app = new Hono();

app.use('/static/*', serveStatic({ root: './static' })); 

// CSP Middleware
app.use('*', (c, next) => {
    c.res.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'self'; form-action 'self';"
    );
    c.res.headers.set('X-Content-Type-Options', 'nosniff');
    return next();
});

// Serve the registration form 
app.get('/register', async (c) => {
    return c.html(await Deno.readTextFile('./views/register.html'));
});


Deno.serve(app.fetch);
console.log('Server running on http://localhost:3000');

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read app.js 