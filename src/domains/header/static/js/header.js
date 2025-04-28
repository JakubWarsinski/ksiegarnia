window.addEventListener('resize', buttonDisplay);

let isToggling = false;

document.getElementById('menu-button').addEventListener('click', function () {
    if (isToggling) return;
    isToggling = true;

    const buttonList = document.querySelectorAll('.hide-button');

    buttonList.forEach(button => {
        button.classList.toggle('hidden');
    });

    setTimeout(() => {
        isToggling = false;
    }, 100);
});

document.getElementById('search-button').addEventListener('click', function () {
    const title = document.getElementById('search-input').value;
    const encodedTitle = encodeURIComponent(title);

    window.location.href = `/home?title=${encodedTitle}`;
});

document.getElementById('search-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const title = event.target.value;
        const encodedTitle = encodeURIComponent(title);
        
        window.location.href = `/home?title=${encodedTitle}`;
    }
});

function buttonDisplay() {
    const header = document.getElementById('nav-header');
    const buttonList = document.querySelectorAll('.hide-button');
    
    if (header.offsetWidth > 900) {
      buttonList.forEach(button => {
        button.classList.remove('hidden');
      });
    }
    else {
      buttonList.forEach(button => {
        button.classList.add('hidden');
      });
    }
}