const supabase = require('../config/supaBase.js');

const bookSelect = 'id_ksiazki, tytul, okladka, cena, promocja, autorzy (imie, nazwisko), gatunki_ksiazki (gatunki (gatunek))';

///////////////////////////////////
//            SELECT             //
///////////////////////////////////

exports.selectBooks = async (select = '', { filter = null }) => {
    let query = supabase
        .from('ksiazki')
        .select(bookSelect + select);

    if (filter && Array.isArray(filter)) {
        filter.forEach(([method, ...args]) => {
            query = query[method](...args);
        });
    }

    query = query.order('id_ksiazki', { ascending: true });
    query = query.limit(10);

    const { data, error } = await query;

    if (error) throw error.message;

    const result = data.map(ksiazka => {
        return {
            id_ksiazki: ksiazka.id_ksiazki,
            tytul: ksiazka.tytul,
            okladka: ksiazka.okladka,
            cena: ksiazka.cena,
            promocja: parseFloat((ksiazka.cena * (ksiazka.promocja / 100)).toFixed(2)),
            autor: ksiazka.autorzy,
            gatunki: ksiazka.gatunki_ksiazki.map(gk => gk.gatunki.gatunek),
        };
    });

    return result;
};

exports.selectDetailedBook = async (bookId) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(`${bookSelect}, ilosc_stron, ilosc_na_stanie, opis`)
        .eq('id_ksiazki', bookId)
        .maybeSingle();

    if (error) throw error.message;

    const result = {
            id_ksiazki: data.id_ksiazki,
            tytul: data.tytul,
            okladka: data.okladka,
            cena: data.cena,
            ilosc_stron : data.ilosc_stron,
            ilosc_na_stanie : data.ilosc_na_stanie,
            opis : data.opis,
            promocja: parseFloat((data.cena * (data.promocja / 100)).toFixed(2)),
            autor: data.autorzy,
            gatunki: data.gatunki_ksiazki.map(gk => gk.gatunki.gatunek),
        };

    return result;
} 

exports.selectItem = async (from, select) => {
    const { data, error } = await supabase
        .from(from)
        .select(select)

    if (error) throw error.message;

    return data;
};

exports.selectItemWithEq = async (from, select, input) => {
    const { data, error } = await supabase
        .from(from)
        .select(select)
        .match(input)
        .maybeSingle();

    if (error) throw error.message;

    return data;
};

exports.selectBookToAdd = async (from, id_ksiazki, id_klienta) => {
    const { data, error } = await supabase
        .from(from)
        .select('id_ksiazki, posiadane')
        .match({ 'id_ksiazki' : id_ksiazki, 'id_klienta' : id_klienta })
        .maybeSingle();

    if (error) throw error.message;

    return data;
};

///////////////////////////////////
//            INSERT             //
///////////////////////////////////

exports.insertBook = async (from, input) => {
    const { error } = await supabase
        .from(from)
        .insert(input);

    if (error) throw error.message;

    return null;
};


///////////////////////////////////
//            UPDATE             //
///////////////////////////////////

exports.updateBook = async (from, input, id_ksiazki, id_klienta) => {
    const { error } = await supabase
        .from(from)
        .update(input)
        .match({ 'id_ksiazki' : id_ksiazki, 'id_klienta' : id_klienta })

    if (error) throw error.message;

    return null;
};