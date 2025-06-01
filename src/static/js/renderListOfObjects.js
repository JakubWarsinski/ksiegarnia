window.addEventListener('DOMContentLoaded', () => { 
    if (document.getElementById('add-items')) {
        const addItemButton = document.getElementById('add-items');
        const type = addItemButton.dataset.type;

        const limit = 8;
        
        addItemButton.addEventListener('click', async function() { RenderListOfObjects(type, limit, addItemButton) });

        RenderListOfObjects(type, limit, addItemButton);
    }
});

async function RenderListOfObjects(type, limit, button) {
    
    const container = document.getElementById('list');
    const itemAmount = container.childElementCount;
    let addition = '';

    if (type == 'order') {
        const orderId = button.dataset.id;

        addition = `&order_id=${orderId}`;
    }

    const url = `/get/${type}?pointer=${itemAmount}&limit=${limit}${addition}`;

    console.log(url)

    try {
        const htmlContent = await (await fetch(url)).text();

        console.log(htmlContent)

        container.insertAdjacentHTML('beforeend', htmlContent);

        window.dispatchEvent(new CustomEvent('renderComplete'));
    } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
    }
}