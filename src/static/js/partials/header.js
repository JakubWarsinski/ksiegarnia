document.addEventListener('DOMContentLoaded', () => {
    let isToggling = false;

    const title = document.getElementById('search-input');
    const buttonList = document.querySelectorAll('.hide-button');
    const header = document.getElementById('nav-header');

    const sendTitleRequest = () => {
        const encodedTitle = encodeURIComponent(title.value);
        window.location.href = `/home?title=${encodedTitle}`;
    };

    document.getElementById('menu-button').addEventListener('click', () => {
        if (isToggling) return;

        isToggling = true;
        buttonList.forEach(button => button.classList.toggle('hidden'));

        setTimeout(() => { isToggling = false; }, 100);
    });

    document.getElementById('search-button').addEventListener('click', sendTitleRequest);

    title.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') sendTitleRequest();
    });

    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateButtonVisibility, 100);
    });

    const updateButtonVisibility = () => {
        const shouldShow = header.offsetWidth > 1200;
        buttonList.forEach(button => button.classList.toggle('hidden', !shouldShow));
    };
    
    updateButtonVisibility();
});
