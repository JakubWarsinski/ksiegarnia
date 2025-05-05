async function addFavoriteBook(id_ksiazki) {
    const res = await fetch('/home/add_favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_ksiazki })
    });

    const result = await res.json();

    document.getElementById('user-fav-count').innerHTML = result.amount;

    const buttons = document.querySelectorAll(`.favoriteButton[data-id="${id_ksiazki}"]`);

    if (result.status) {
        buttons.forEach(function(button) {
            button.classList.add('specialButtonActive');
        });
    } else {
        buttons.forEach(function(button) {
            button.classList.remove('specialButtonActive');
        });
    }
};

async function addCartBook(id_ksiazki) {
    const res = await fetch('/home/add_cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_ksiazki })
    });

    const result = await res.json();

    document.getElementById('user-cart-count').innerHTML = result.amount;

    const buttons = document.querySelectorAll(`.cartButton[data-id="${id_ksiazki}"]`);

    if (result.status) {
        buttons.forEach(function(button) {
            button.classList.add('specialButtonActive');
        });
    } else {
        buttons.forEach(function(button) {
            button.classList.remove('specialButtonActive');
        });
    }
};