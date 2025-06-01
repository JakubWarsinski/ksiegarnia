document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('newsletter-email').value;
        const message = document.getElementById('newsletter-message');

        try {
            const res = await fetch('/footer/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await res.json();

            message.innerHTML = result;
            message.removeAttribute('style');
            
        } catch (err) {
            message.innerHTML = 'Wystąpił problem z połączeniem.';
            message.removeAttribute('style');
        }
    });
});