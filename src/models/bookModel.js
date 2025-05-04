const supabase = require('../config/supaBase.js');

const SELECT_BOOK_FIELDS = `
  id_ksiazki, 
  tytul, 
  okladka, 
  cena, 
  promocja, 
  autorzy (imie, nazwisko), 
  gatunki_ksiazki (gatunki (gatunek, id_gatunku)), 
  ulubione_ksiazki (posiadane), 
  koszyk (posiadane, ilosc)
`;

const SELECT_DETAILED_FIELDS = `
  ${SELECT_BOOK_FIELDS},
  ilosc_stron, 
  ilosc_na_stanie, 
  opis
`;

function RemapData(data, detailed = false) {
    return data.map(ksiazka => {
        const result = {
            id_ksiazki: ksiazka.id_ksiazki,
            tytul: ksiazka.tytul,
            okladka: ksiazka.okladka,
            cena: ksiazka.cena,
            promocja: ksiazka.promocja,
            autor: ksiazka.autorzy,
            gatunki: ksiazka.gatunki_ksiazki.map(gk => gk.gatunki.gatunek),
            koszyk: ksiazka.koszyk.map(gk => gk.posiadane),
            ulubione_ksiazki: ksiazka.ulubione_ksiazki.map(gk => gk.posiadane),
            ilosc: ksiazka.koszyk.map(gk => gk.ilosc),
        };

        if (detailed) {
            result.ilosc_stron = ksiazka.ilosc_stron;
            result.ilosc_na_stanie = ksiazka.ilosc_na_stanie;
            result.opis = ksiazka.opis;
        }

        return result;
    });
}

exports.selectBooksByTitle = async (value) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_BOOK_FIELDS)
        .ilike('tytul', `%${value}%`)
        .limit(10);
        
    if (error) throw error.message;

    if (data.length <= 0) return [];

    return RemapData(data);
}

exports.selectBooksByGenre = async (value) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_BOOK_FIELDS)
        .eq('gatunki_ksiazki.id_gatunku', value)
        .not('gatunki_ksiazki', 'is', null);

    if (error) throw error.message;

    if (data.length <= 0) return [];

    return RemapData(data);
}

exports.selectBooksByAuthor = async (value) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_BOOK_FIELDS)
        .eq('id_autora', value);

    if (error) throw error.message;

    if (data.length <= 0) return [];

    return RemapData(data);
}

exports.selectTopBooks = async () => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_BOOK_FIELDS)
        .limit(10);

    if (error) throw error.message;

    if (data.length <= 0) return [];

    return RemapData(data);
}

exports.selectLastBooks = async () => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_BOOK_FIELDS)
        .lt('ilosc_na_stanie', 10);

    if (error) throw error.message;

    if (data.length <= 0) return [];

    return RemapData(data);
}

exports.selectPromotionBooks = async () => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_BOOK_FIELDS)
        .not('promocja', 'is', null);

    if (error) throw error.message;

    if (data.length <= 0) return [];

    return RemapData(data);
}

exports.selectDetailedBook = async (bookId) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_DETAILED_FIELDS)
        .eq('id_ksiazki', bookId)

    if (error) throw error.message;

    if (data.length <= 0) return null;

    return RemapData(data, true)[0];
}

exports.selectAllAuthors = async () => {
    const { data, error } = await supabase
        .from('autorzy')
        .select('id_autora, imie, nazwisko');

    if (error) throw error.message;

    return data
}

exports.selectAllGenres = async () => {
    const { data, error } = await supabase
        .from('gatunki')
        .select('id_gatunku, gatunek');

    if (error) throw error.message;

    return data;
}

exports.selectCartBooks = async (userId) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_BOOK_FIELDS)
        .match({ 'koszyk.id_klienta' : userId, 'koszyk.posiadane' : true })
        .not('koszyk', 'is', null);

    if (error) throw error.message;

    return RemapData(data);
}

exports.selectFavoriteBooks = async (userId) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(SELECT_BOOK_FIELDS)
        .match({ 'ulubione_ksiazki.id_klienta' : userId, 'ulubione_ksiazki.posiadane' : true })
        .not('ulubione_ksiazki', 'is', null);

    if (error) throw error.message;

    return RemapData(data);
}

exports.selectUserBookById = async (from, id_ksiazki, id_klienta) => {
    const { data, error } = await supabase
        .from(from)
        .select('id_ksiazki, posiadane')
        .match({ 'id_ksiazki': id_ksiazki, 'id_klienta': id_klienta })
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.setUserBookById = async (from, input) => {
    const { error } = await supabase
        .from(from)
        .insert(input);

    if (error) throw error.message;

    return null;
}

exports.updateUserBookById = async (from, input, eq) => {
    const { error } = await supabase
        .from(from)
        .update(input)
        .match(eq);

    if (error) throw error.message;

    return null;
}