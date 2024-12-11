document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/reservations')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched reservations:', data);
            const reservationsList = document.getElementById('reservationsList');
            reservationsList.innerHTML = data.map(reservation => `
                <tr>
                    <td>${reservation.resource_id}</td>
                    <td>${new Date(reservation.start_time).toLocaleString()}</td>
                    <td>${new Date(reservation.end_time).toLocaleString()}</td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error fetching reservations:', error));
});

