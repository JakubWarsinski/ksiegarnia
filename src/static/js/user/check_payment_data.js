document.addEventListener('DOMContentLoaded', function () {
    let failed = false;
    
    const dataMap = document.getElementById('data').children;
    const length = dataMap.length - 1;

    for (let i = 0; i <= length; i++) {
        const p = dataMap[i].children;
        const spam = p[1];
        const text = spam.innerHTML;

        if (spam.dataset.field != 'ulica' && (!text || text == '')) {
            failed = true;

            spam.innerHTML = 'Uzupełnij pole*';
            spam.classList.add('error-msg');
        }
    }

    const form = document.getElementById('form-contact');

    form.addEventListener('submit', function (e) {
        if (failed) e.preventDefault();
    });

    document.getElementById('change-data').addEventListener('click', function() {
        sessionStorage.setItem('data-state', 1);
        window.location.href = "/user/contact";
    });
});