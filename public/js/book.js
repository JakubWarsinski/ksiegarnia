function GoToBookPage(book) {
    const bookId = book.getAttribute('data-id');
    window.location.href = `/book/${bookId}`;
}

async function AddBookToFavorites(idKsiazki) {    
    fetch('/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_ksiazki: idKsiazki })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Dodano!');
      })
      .catch(error => {
        alert('Błąd podczas dodawania');
        console.error(error);
      });
}