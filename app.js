import { Hono } from "https://deno.land/x/hono/mod.ts";
import { loginUser } from "./routes/login.js";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { registerUser } from "./routes/register.js"; 
import { registerResource, getResources } from "./routes/resource.js"; 
import { registerReservation, getReservations } from "./routes/reservation.js"; 
import { authenticateUser, authorizeRole, verifyAge } from "./auth.js"; 
import { sessionStore } from "./auth.js"; 
import client from "./db/db.js"; // Import the database client

const app = new Hono();

// Serve static files
app.use('/static/*', serveStatic({ root: '.' }));

// Add security headers middleware
app.use('*', (c, next) => {
    c.header('Content-Type', 'text/html');
    c.header('Content-Security-Policy',
        "default-src 'self';" +
        "script-src 'self' 'nonce-abc123';" +
        "style-src 'self';" +
        "img-src 'self';" +
        "frame-ancestors 'none';" +
        "form-action 'self';"
    );
    c.header('X-Content-Type-Options', 'nosniff');
    return next();
});

// Helper function for serving HTML files
const serveHtml = async (filePath, c) => {
    try {
        const content = await Deno.readTextFile(filePath);
        return c.html(content);
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        return c.text('Error: Page not found', 404);
    }
};

// Serve forms and pages
app.get('/register', (c) => serveHtml('./views/register.html', c));
app.post('/register', registerUser);

app.get('/login', (c) => serveHtml('./views/login.html', c));
app.post('/login', loginUser);

app.get('/', (c) => serveHtml('./views/index.html', c));
app.get('/successresponse', (c) => serveHtml('./views/successresponse.html', c));

app.get('/terms', (c) => serveHtml('./views/terms.html', c));
app.get('/privacy', (c) => serveHtml('./views/privacy.html', c));

app.get('/account', authenticateUser, (c) => serveHtml('./views/account.html', c));

// API endpoint to get user information
app.get('/api/account', authenticateUser, async (c) => {
    const userId = c.req.user.userId;
    const query = `SELECT username, email, age, pseudonym FROM abc123_users WHERE user_id = $1`;
    try {
        const result = await client.queryObject(query, [userId]);
        return result.rows.length > 0
            ? c.json(result.rows[0])
            : c.json({ error: 'User not found' }, 404);
    } catch (error) {
        console.error('Error fetching user information:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});

// Resource routes
app.post('/resource', authenticateUser, authorizeRole('administrator'), registerResource);
app.get('/resource', authenticateUser, authorizeRole('administrator'), (c) => serveHtml('./views/resource.html', c));

// View resources
app.get('/resources', (c) => serveHtml('./views/resources.html', c));
app.get('/api/resources', getResources);

// Reservation routes
app.post('/reservation', authenticateUser, verifyAge, registerReservation);
app.get('/reservation', authenticateUser, (c) => serveHtml('./views/reservation.html', c));

// View reservations
app.get('/reservations', (c) => serveHtml('./views/reservations.html', c));
app.get('/api/reservations', getReservations);

// API to get logged-in user's role
app.get('/api/user', authenticateUser, async (c) => { 
    const { role } = c.req.user; 
    return c.json({ role }); 
});


// Handle user logout
app.get('/logout', authenticateUser, (c) => {
    const sessionId = c.req.header('Cookie')?.split('=')[1];
    if (sessionId) {
        sessionStore.delete(sessionId);
        c.res.headers.set('Set-Cookie', 'session_id=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    }
    return c.redirect('/');
});

// Start the server
Deno.serve(app.fetch);
console.log('Server running on http://localhost:3000');

