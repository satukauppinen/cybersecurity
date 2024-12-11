// reservation.js
import client from "../db/db.js";

export async function registerReservation(c) {
    const { pseudonym, resourceId, startTime, endTime } = await c.req.json();
    try {
        const query = `INSERT INTO abc123_reservations (pseudonym, resource_id, start_time, end_time) VALUES ($1, $2, $3, $4)`;
        const result = await client.queryArray(query, [pseudonym, resourceId, startTime, endTime]);
        console.log('Reservation added:', result); // Add this line for debugging
        return c.text('Reservation added successfully');
    } catch (error) {
        console.error('Error adding reservation:', error);
        return c.text('Error during adding reservation', 500);
    }
}


export async function getReservations(c) {
    const query = `SELECT resource_id, resource_name, start_time, end_time FROM abc123_public_reservations`;
    try {
        const result = await client.queryObject(query);
        console.log('Reservations fetched from DB:', result.rows);
        return c.json(result.rows);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
}
