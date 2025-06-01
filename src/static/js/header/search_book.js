document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('search-input');

    const sendTitleRequest = () => {
        const encodedTitle = encodeURIComponent(title.value);
        window.location.href = `/home/search?title=${encodedTitle}`;
    };

    document.getElementById('search-button').addEventListener('click', sendTitleRequest);

    title.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') sendTitleRequest();
    });
});