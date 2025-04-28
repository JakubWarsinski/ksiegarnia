const resetCode = document.getElementById('existing-code');

resetCode.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  
  e.target.value = value.slice(0, 6);
});