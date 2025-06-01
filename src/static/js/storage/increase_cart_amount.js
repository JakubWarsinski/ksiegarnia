window.addEventListener('renderComplete', () => {
    document.querySelectorAll('.list-element').forEach(element => {
        const { index, price, book, storage } = element.dataset;
        const idx = parseInt(index);
        const unitPrice = parseFloat(price);
        const bookId = parseInt(book);
        const storageId = parseInt(storage);

        const amountButton = document.getElementById(`amount-button-${idx}`);
        const increaseBtn = document.getElementById(`increase-button-${idx}`);
        const decreaseBtn = document.getElementById(`decrease-button-${idx}`);
        const removeBtn   = document.getElementById(`remove-button-${idx}`);

        increaseBtn.addEventListener('click', () => handleAmountChange(1, unitPrice, amountButton, storageId));
        decreaseBtn.addEventListener('click', () => handleAmountChange(-1, unitPrice, amountButton, storageId));
        removeBtn.addEventListener('click', () => handleRemove(unitPrice, amountButton, storageId, bookId, element));
    });
});

function handleAmountChange(direction, price, inputEl, storageId) {
    let amount = parseInt(inputEl.value);
    if (direction < 0 && amount <= 1) return;

    amount += direction;
    inputEl.value = amount;

    changeFinalePrice(price, direction);
    updateStorage(storageId, amount);
}

function handleRemove(price, inputEl, storageId, bookId, element) {
    const amount = parseInt(inputEl.value);
    const header = document.getElementById('user-car-count');

    header.innerHTML = parseInt(header.innerHTML) - 1;
    userData.carAmount -= 1;
    userData.car = userData.car.filter(id => id !== bookId);

    changeFinalePrice(price, -amount);
    removeFromStorage(storageId, element);

    if (userData.carAmount <= 0) setContentAsEmpty();
}

function changeFinalePrice(price, amount = 1) {
    const finalePriceEl = document.getElementById('finale-price');
    const currentValue = parseFloat(finalePriceEl.innerHTML);
    const newValue = currentValue + (price * amount);

    finalePriceEl.innerHTML = newValue.toFixed(2);
}

async function removeFromStorage(storageId, element) {
    try {
        await fetch('/storage', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storageId,
                type: 'car',
                ids: userData.car,
                idsAmount: userData.carAmount
            })
        });

        element.remove();
    } catch (error) {
        console.error(error);
    }
}

async function updateStorage(storageId, amount) {
    try {
        await fetch('/storage', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storageId,
                decision : 1,
                amount,
                type: 'car',
                ids: userData.car,
                idsAmount: userData.carAmount
            })
        });
    } catch (error) {
        console.error(error);
    }
}