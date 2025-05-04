document.addEventListener('click', async (e) => {
    const button = e.target.closest('.specialButton');
    if (!button) return;
  
    const id_ksiazki = button.dataset.id;
    const counterId = button.dataset.counter;
    const userItem = button.dataset.item;
    const path = button.dataset.path;
    const ids = button.dataset.table;

    try {
        const res = await fetch('/user/add_item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_ksiazki, userItem, path, ids })
        });
  
        const result = await res.json();
  
        const counter = document.getElementById(result.id || counterId);
        
        if (counter) counter.innerText = result.count;
  
        button.classList.add('pop-animation');
        button.addEventListener('animationend', () => {
            button.classList.remove('pop-animation');
        }, { once: true });
  
        const elements = document.querySelectorAll(`[data-id="${id_ksiazki}"][data-path="${path}"]`);

        if (result.status) {
            elements.forEach(function(element) {
                element.classList.add('specialButtonActive');
            });
        } else {
            elements.forEach(function(element) {
                element.classList.remove('specialButtonActive');
            });
        }
  
    } catch (err) {
        alert(err);
    }
});