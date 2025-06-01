exports.formatDate = (oldDate) => {
    const date = new Date(oldDate.substring(0, 10));

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
        'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
        'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
    ];

    return `${day} ${monthNames[monthIndex]} ${year}`;
}