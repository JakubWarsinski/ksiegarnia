document.addEventListener('DOMContentLoaded', function () {
    let toggle = sessionStorage.getItem('data-state');
    const data = document.getElementById('data');
    const input = document.getElementById('data-inputs');
    
    if (toggle) {
        data.classList.add('hidden');
        input.classList.remove('hidden');
    }
    else {
        data.classList.remove('hidden');
        input.classList.add('hidden');
    }

    document.getElementById('show-data').addEventListener('click', function() {
        sessionStorage.removeItem('data-state');
        data.classList.toggle('hidden');
        input.classList.toggle('hidden');
    });

    document.getElementById('show-inputs').addEventListener('click', function() {
        
        sessionStorage.setItem('data-state', 1);
        data.classList.toggle('hidden');
        input.classList.toggle('hidden');
    });
    
    function addEvent(input) {
        const amount = input.dataset.amount;

        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');

            if (this.value.length > amount) this.value = this.value.slice(0, amount);
        });
    }
    
    addEvent(document.getElementById('code-left'));
    addEvent(document.getElementById('code-right'));

    document.getElementById("phone").addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');

        if (this.value.length > 9) this.value = this.value.slice(0, 9);
    });

    document.getElementById("form-contact").addEventListener('submit', function (e) {
        const left = document.getElementById('code-left').value;
        const right = document.getElementById('code-right').value;

        sessionStorage.removeItem('data-state');

        if (left !== '' || right !== '') document.getElementById('code').value = `${left}-${right}`;
    });
});