document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/resources')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched resources:', data);
            const resourcesList = document.getElementById('resourcesList');
            resourcesList.innerHTML = data.map(resource => `
                <tr>
                    <td>${resource.resource_name}</td>
                    <td>${resource.description}</td>
                    <td>${new Date(resource.created_at).toLocaleString()}</td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error fetching resources:', error));
});

