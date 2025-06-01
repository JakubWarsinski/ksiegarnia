window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.storage-button').forEach(button => {
        const type = button.dataset.type;
        const book = parseInt(button.dataset.book);

        if (userData[type].includes(book)) {
            button.classList.add('active');
            button.dataset.value = -1;
        }

        button.addEventListener('click', function() {
            const value = parseInt(button.dataset.value);
            
            changeAmount(book, type, value);

            button.dataset.value *= -1;

            button.classList.toggle('active');
        });
    });
});

function changeAmount(bookId, type, amount) {
    const header = document.getElementById(`user-${type}-count`);
    header.innerHTML = parseInt(header.innerHTML) + amount;

    userData[`${type}Amount`] = parseInt(userData[`${type}Amount`]) + amount;

    if (amount == 1) {
        userData[type].push(bookId);
    }
    else {
        userData[type] = userData.car.filter(id => id !== bookId);
    }

    updateStorage(bookId, amount, type);
}

async function updateStorage(bookId, amount, type) {
    try {
        await fetch('/storage/toggle', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookId,
                amount,
                type,
                ids: userData[type],
                idsAmount: userData[`${type}Amount`]
            })
        });
    } catch (error) {
        console.error(error);
    }
}