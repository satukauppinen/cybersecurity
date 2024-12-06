export const sessionStore = new Map(); // In-memory session store, replace with a database in production

export function authenticateUser(c, next) {
    const sessionId = c.req.header('Cookie')?.split('=')[1];
    if (!sessionId || !sessionStore.has(sessionId)) {
        return c.redirect('/login');
    }
    c.req.user = sessionStore.get(sessionId);
    return next();
}

export function authorizeRole(role) {
    return (c, next) => {
        if (!c.req.user || c.req.user.role !== role) {
            return c.text('Access denied', 403);
        }
        return next();
    }
}

export function verifyAge(c, next) {
    const user = c.req.user;
    if (user.age < 15) {
        return c.text('You must be over 15 years old to book resources.', 403);
    }
    return next();
}

