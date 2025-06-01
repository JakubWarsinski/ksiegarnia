document.addEventListener('DOMContentLoaded', function () { 
    const inputs = document.getElementById('inputList').children;
    const length = inputs.length - 1;
    const password = document.getElementById('password');
    
    let i = 0;

    for(i = 0; i <= length; i++) {
        const input = inputs[i];
        const index = parseInt(input.dataset.id);
        
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < 5) {
                const nextInput = inputs[(index + 1)];

                nextInput.value = '';
                nextInput.focus();
            }
            else password.focus();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                const nextInput = inputs[(index - 1)];

                nextInput.value = '';
                nextInput.focus();
            }
        });

        input.addEventListener('paste', (e) => {
            const paste = (e.clipboardData || window.Clipboard).getData('text');
    
            if (/^\d{6}$/.test(paste)) {
                e.preventDefault();
    
                paste.split('').forEach((char, i) => {
                    if (inputs[i]) {
                        inputs[i].value = char;
                    }
                });
    
                password.focus();
            }
        });
    }

    document.getElementById('form-reset').addEventListener('submit', (e) => {
        const code = Array.from(inputs).map(input => input.value.trim()).join('');

        document.getElementById("code").value = code;
    });
});