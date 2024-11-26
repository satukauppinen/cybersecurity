import { Hono } from "https://deno.land/x/hono/mod.ts";
import { loginUser } from "./routes/login.js";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { registerUser } from "./routes/register.js"; // Import register logic

const app = new Hono();

app.use('/static/*', serveStatic({ root: '.'}));

// CSP Middleware
app.use('*', (c, next) => {
    c.header('Content-Type', 'text/html');

    c.header('Content-Security-Policy',
        "default-src 'self';"+
        "script-src 'self';"+
        "style-src 'self';"+
        "img-src 'self';"+
        "frame-ancestors 'none';"+
        "form-action 'self';");

    c.header('X-Content-Type-Options', 'nosniff');

    

    return next();
});

// Serve the registration form 
app.get('/register', async (c) => {
    return c.html(await Deno.readTextFile('./views/register.html'));
});

app.post('/register', registerUser);

//Serve login page
app.get('/login', async (c) => {
    return c.html(await Deno.readTextFile('./views/login.html'));
});

app.post('/login', loginUser);

//Serve index
app.get('/', async (c) => {
    return c.html(await Deno.readTextFile('./views/index.html'));
});


Deno.serve(app.fetch);
console.log('Server running on http://localhost:3000');

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read app.js 