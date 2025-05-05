async function updateCartBook(button, id_ksiazki, amount, index) {
    const input = document.getElementById(`value-${index}`);
    const inputValue = parseInt(input.value)

    if ((inputValue + amount) >= 1) {
        const price = parseFloat(button.dataset.price) * amount;

        await fetch('/user/cart_amount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_ksiazki, amount })
        });

        input.value = inputValue + amount;

        const priceLabel = document.getElementById('total_price');

        const totalPrice = parseFloat(priceLabel.innerHTML);

        priceLabel.innerHTML = (totalPrice + price).toFixed(2);
    }
};