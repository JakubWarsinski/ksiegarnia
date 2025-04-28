const phoneNumber = document.getElementById('phoneNumber');

phoneNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    e.target.value = value.slice(0, 9);
});