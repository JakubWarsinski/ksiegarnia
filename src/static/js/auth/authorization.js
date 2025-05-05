document.addEventListener('DOMContentLoaded', function () { 
    const form = document.getElementById('post-form');
    const codeInputs = document.querySelectorAll('.code');
    const passwordInput = document.getElementById('password');
    const hiddenInput = document.getElementById('resetCode');

    codeInputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && idx < codeInputs.length - 1) {
                const nextInput = codeInputs[idx + 1];
                nextInput.value = '';
                nextInput.focus();
            }
            else if (idx === codeInputs.length - 1) passwordInput.focus();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && idx > 0) {
                const nextInput = codeInputs[idx - 1];
                nextInput.value = '';
                nextInput.focus();
            }
        });

        input.addEventListener('paste', (e) => {
            const paste = (e.clipboardData || window.Clipboard).getData('text');
    
            if (/^\d{6}$/.test(paste)) {
                e.preventDefault();
    
                paste.split('').forEach((char, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = char;
                    }
                });
    
                passwordInput.focus();
            }
        });
    });

    form.addEventListener('submit', (e) => {
        const code = Array.from(codeInputs).map(input => input.value.trim()).join('');
  
        hiddenInput.value = code;
    });
});