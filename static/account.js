document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/account')
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('age').textContent = data.age;
            document.getElementById('pseudonym').textContent = data.pseudonym;
        })
        .catch(error => console.error('Error fetching account information:', error));
});
