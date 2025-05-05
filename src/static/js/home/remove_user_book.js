async function removeFavoriteBook(id_ksiazki, index) {
    const res = await fetch('/home/remove_favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_ksiazki })
    });

    const result = await res.json();

    document.getElementById('user-fav-count').innerHTML = result.amount;
    
    document.getElementById(`item-${index}`).remove();

    const bookList = document.getElementById('book-list').children;

    if (bookList.length <= 0) location.reload();
};

async function removeCartBook(id_ksiazki, index) {
    const res = await fetch('/home/remove_cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_ksiazki })
    });

    const result = await res.json();

    document.getElementById('user-cart-count').innerHTML = result.amount;
    
    document.getElementById(`item-${index}`).remove();

    const bookList = document.getElementById('book-list').children;

    if (bookList.length <= 0) location.reload();
};