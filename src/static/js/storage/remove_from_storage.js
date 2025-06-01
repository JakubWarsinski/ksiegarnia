window.addEventListener('renderComplete', () => {
    document.querySelectorAll('.list-element').forEach(element => {
        const { index, book, storage } = element.dataset;
        const idx = parseInt(index);
        const bookId = parseInt(book);
        const storageId = parseInt(storage);

        const removeBtn = document.getElementById(`remove-button-${idx}`);

        removeBtn.addEventListener('click', () => handleRemove(storageId, bookId, element));
    });
});

function handleRemove(storageId, bookId, element) {
    const header = document.getElementById('user-fav-count');

    header.innerHTML = parseInt(header.innerHTML) - 1;
    userData.favAmount -= 1;
    userData.fav = userData.fav.filter(id => id !== bookId);

    removeFromStorage(storageId, element);

    if (userData.favAmount <= 0) setContentAsEmpty();
}

async function removeFromStorage(storageId, element) {
    try {
        await fetch('/storage', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storageId,
                type: 'fav',
                ids: userData.fav,
                idsAmount: userData.favAmount
            })
        });

        element.remove();
    } catch (error) {
        console.error(error);
    }
}