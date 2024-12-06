import { Hono } from "https://deno.land/x/hono/mod.ts";
import { loginUser } from "./routes/login.js";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { registerUser } from "./routes/register.js"; 
import { registerResource, getResources } from "./routes/resource.js"; 
import { registerReservation, getReservations } from "./routes/reservation.js"; 
import { authenticateUser, verifyAge } from "./auth.js";
import { sessionStore } from "./auth.js";  // Import sessionStore

const app = new Hono();

app.use('/static/*', serveStatic({ root: '.'}));

app.use('*', (c, next) => {
    c.header('Content-Type', 'text/html');
    c.header('Content-Security-Policy',
        "default-src 'self';"+
        "script-src 'self';"+
        "style-src 'self';"+
        "img-src 'self';"+
        "frame-ancestors 'none';"+
        "form-action 'self';"
    );
    c.header('X-Content-Type-Options', 'nosniff');
    return next();
});

// Serve forms and pages
app.get('/register', async (c) => c.html(await Deno.readTextFile('./views/register.html')));
app.post('/register', registerUser);

app.get('/login', async (c) => c.html(await Deno.readTextFile('./views/login.html')));
app.post('/login', loginUser);

// Resource routes
app.get('/resources', async (c) => {
    return c.html(await Deno.readTextFile('./views/resources.html'));
});

// Reservation routes
app.get('/reservations', async (c) => {
    return c.html(await Deno.readTextFile('./views/reservations.html'));
});

app.get('/api/reservations', async (c) => {
    const query = `SELECT resource_id, resource_name, start_time, end_time FROM abc123_public_reservations`;
    try {
        const result = await client.queryObject(query);
        console.log('Reservations fetched from DB:', result.rows); // Add this line for debugging
        return c.json(result.rows);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});



app.get('/', async (c) => c.html(await Deno.readTextFile('./views/index.html')));

app.get('/successresponse', async (c) => {
    try {
        const content = await Deno.readTextFile('./views/successresponse.html');
        return c.html(content);
    } catch (error) {
        console.error('Error loading success page:', error);
        return c.text('Error: Page not found', 404);
    }
});

// Resource routes

app.get('/resource', authenticateUser, async (c) => {
    return c.html(await Deno.readTextFile('./views/resource.html'));
    app.post('/resource', authenticateUser, registerResource);
});

// Reservation routes

app.get('/reservation', authenticateUser, async (c) => {
    return c.html(await Deno.readTextFile('./views/reservation.html'));
    app.post('/reservation', authenticateUser, verifyAge, registerReservation);
});


// API to get logged-in user's role
app.get('/api/user', authenticateUser, async (c) => {
    const { role } = c.req.user;
    return c.json({ role });
});

//Handle user logout
app.get('/logout', authenticateUser, async (c) => { 
    const sessionId = c.req.header('Cookie')?.split('=')[1]; 
    if (sessionId) { 
        sessionStore.delete(sessionId); 
        c.res.headers.set('Set-Cookie', 'session_id=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'); 
    } 
    return c.redirect('/'); 
});

Deno.serve(app.fetch);
console.log('Server running on http://localhost:3000');

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read app.js 
