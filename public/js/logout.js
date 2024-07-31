document.addEventListener('DOMContentLoaded', () => {
  const logoutForm = document.getElementById('logout-form');

  if (logoutForm) {
    logoutForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/login');
      } else {
        alert('Failed to log out.');
      }
    });
  }
});
