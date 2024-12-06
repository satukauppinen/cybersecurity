import client from "../db/db.js";

export async function getResources(c) {
    const query = `SELECT resource_id, resource_name, description, created_at FROM abc123_resources`;
    try {
        const result = await client.queryObject(query);
        console.log('Resources fetched from DB:', result.rows);
        return c.json(result.rows);
    } catch (error) {
        console.error('Error fetching resources:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
}

export async function registerResource(c) {
    const { resourceName, resourceDescription } = await c.req.json();
    try {
        const query = `INSERT INTO abc123_resources (resource_name, description) VALUES ($1, $2)`;
        await client.queryArray(query, [resourceName, resourceDescription]);
        return c.text('Resource added successfully');
    } catch (error) {
        console.error('Error adding resource:', error);
        return c.text('Error during adding resource', 500);
    }
}
