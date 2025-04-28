const supabase = require('../server/supaBase.js');

const select = 'id_ksiazki, tytul, okladka, cena, promocja, autorzy (imie, nazwisko), gatunki_ksiazki (gatunki (gatunek, id_gatunku))';

function RemapData(data) {
    const result = data.map(ksiazka => ({
        id_ksiazki: ksiazka.id_ksiazki,
        tytul: ksiazka.tytul,
        okladka: ksiazka.okladka,
        cena: ksiazka.cena,
        promocja: ksiazka.promocja,
        autor: ksiazka.autorzy,
        gatunki: ksiazka.gatunki_ksiazki.map(gk => gk.gatunki.gatunek)
    }));

    return result;
}

function RemapDetailedData(data) {
    const result = data.map(ksiazka => ({
        id_ksiazki: ksiazka.id_ksiazki,
        tytul: ksiazka.tytul,
        ilosc_stron: ksiazka.ilosc_stron,
        ilosc_na_stanie: ksiazka.ilosc_na_stanie,
        opis: ksiazka.opis,
        okladka: ksiazka.okladka,
        cena: ksiazka.cena,
        promocja: ksiazka.promocja,
        autor: ksiazka.autorzy,
        gatunki: ksiazka.gatunki_ksiazki.map(gk => gk.gatunki.gatunek),
        gatunki_id:  ksiazka.gatunki_ksiazki.map(gk => gk.gatunki.id_gatunku)
    }));

    return result;
}

exports.GetSearchedBooksByTitle = async (queryValue) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(select)
        .ilike('tytul', `%${queryValue}%`);

    if (error) throw error.message;

    return RemapData(data);
}

exports.GetSearchedBooksByGenre = async (queryValue) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(select)
        .eq('gatunki_ksiazki.id_gatunku', queryValue)
        .not('gatunki_ksiazki', 'is', null);

    if (error) throw error.message;

    return RemapData(data);
}

exports.GetSearchedBooksByAuthor = async (queryValue) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(select)
        .eq('id_autora', queryValue)

    if (error) throw error.message;

    return RemapData(data);
}

exports.GetTopBooks = async () => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(select)
        .limit(10);

    if (error) throw error.message;

    return RemapData(data);
}

exports.GetLastBooks = async () => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(select)
        .lt('ilosc_na_stanie', 10);

    if (error) throw error.message;

    return RemapData(data);
}

exports.GetPromotionBooks = async () => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(select)
        .not('promocja', 'is', null);

    if (error) throw error.message;

    return RemapData(data);
}

exports.GetUserBooks = async (table, userId) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(`id_ksiazki, okladka, tytul, ${table}()`)
        .eq(`${table}.id_klienta`, userId)
        .eq(`${table}.posiadane`, true)
        .not(table, 'is', null);

    if (error) throw error.message;

    return data;
}

exports.GetDetailedDadaBook = async (eq) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(select + ', ilosc_stron, ilosc_na_stanie, opis')
        .eq('id_ksiazki', eq)

    if (error) throw error.message;

    return RemapDetailedData(data)[0];
}

exports.GetSimilarBooks = async (genres) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select('id_ksiazki, tytul, okladka, gatunki_ksiazki(id_gatunku)');

    if (error) throw error.message;

    const filteredBooks = data.filter(book => 
        book.gatunki_ksiazki.some(gatunek => genres.includes(gatunek.id_gatunku))
    );

    return filteredBooks;
}

exports.getAuthors = async () => {
    const { data, error } = await supabase
        .from('autorzy')
        .select('id_autora, imie, nazwisko');

    if (error) throw error.message;

    return data;
}

exports.GetGenres = async () => {
    const { data, error } = await supabase
        .from('gatunki')
        .select('id_gatunku, gatunek');

    if (error) throw error.message;

    return data;
}

exports.GetUserBookById = async (from, select, bookId) => {
    const { data, error } = await supabase
        .from(from)
        .select(select + ', posiadane')
        .eq(select, bookId)
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.GetFavoriteBooks = async (from, select, userId) => {
    const { data, error } = await supabase
        .from('gatunki')
        .select('id_gatunku, gatunek');

    if (error) throw error.message;

    return data;
}