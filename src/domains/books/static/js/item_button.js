document.addEventListener('click', async (e) => {
    const button = e.target.closest('.specialButton');
    if (!button) return;
  
    const id_ksiazki = button.dataset.id;
    const counterId = button.dataset.counter;
    const userItem = button.dataset.item;
    const path = button.dataset.path;
    const ids = button.dataset.table;

    try {
        const res = await fetch('/user/additem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_ksiazki, userItem, path, ids })
        });
  
        const result = await res.json();
  
        const counter = document.getElementById(result.id || counterId);
        if (counter) {
            counter.innerText = result.count;
        }
  
        button.classList.add('pop-animation');
        button.addEventListener('animationend', () => {
            button.classList.remove('pop-animation');
        }, { once: true });
  
        if (result.status) {
            button.classList.add('specialButtonActive');
        } else {
            button.classList.remove('specialButtonActive');
        }
  
    } catch (err) {
        alert(err);
    }
  });
  