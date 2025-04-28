async function dodajDoUlubionych(idKsiazki, path) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_ksiazki: idKsiazki,
      })
    });

    const data = await res.json();
    alert(data || 'Błąd podczas dodawania książki');
}