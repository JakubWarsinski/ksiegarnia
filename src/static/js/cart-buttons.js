document.addEventListener('DOMContentLoaded', function () {
    const updateQuantity = (bookId, newQuantity) => {
        fetch('/user/update_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: bookId, ilosc: newQuantity })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Zaktualizowano:', data);
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
    };

    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const bookId = this.dataset.id;
            const price = parseFloat(this.dataset.price);
            const input = document.querySelector(`.quantity-input[data-id='${bookId}']`);
            
            let quantity = parseInt(input.value);
            
            quantity++;
            
            input.value = quantity;

            const totalPrice = parseFloat(document.getElementById('total_price').innerHTML);

            document.getElementById('total_price').innerHTML = (totalPrice + price).toFixed(2);
            
            updateQuantity(bookId, quantity);
        });
    });

    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const bookId = this.dataset.id;
            
            const input = document.querySelector(`.quantity-input[data-id='${bookId}']`);
            const price = parseFloat(this.dataset.price);
            let quantity = parseInt(input.value);
            
            if (quantity > 1) {
                quantity--;
                
                input.value = quantity;
                
                updateQuantity(bookId, quantity);

                const totalPrice = parseFloat(document.getElementById('total_price').innerHTML);

                document.getElementById('total_price').innerHTML = (totalPrice - price).toFixed(2);
            }
        });
    });

    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', function () {
            const bookId = this.dataset.id;

            fetch('/user/remove_cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: bookId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Usunięto z koszyka');
                    location.reload();
                } else {
                    console.error('Nie udało się usunąć');
                }
            })
            .catch(err => {
                console.error('Błąd sieci', err);
            });
        });
    });
});