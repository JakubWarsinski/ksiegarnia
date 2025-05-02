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
        
    } catch (err) {
        messageElem.textContent = 'Wystąpił problem z połączeniem.';
    }
});
// aaaa
//ssss
//ttttt
