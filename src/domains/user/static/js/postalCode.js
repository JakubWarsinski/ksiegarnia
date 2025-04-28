const postalInput = document.getElementById('postalCode');

postalInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  
  if (value.length > 2) value = value.slice(0, 2) + '-' + value.slice(2);
  
  e.target.value = value.slice(0, 6);
});