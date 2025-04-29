const supabase = require('../server/supaBase.js');

const baseSelect = `
    id_ksiazki, tytul, okladka, cena, promocja, 
    autorzy (imie, nazwisko), 
    gatunki_ksiazki (gatunki (gatunek, id_gatunku)), 
    ulubione_ksiazki (posiadane), 
    koszyk (posiadane)
`;

function handleSupabaseError(error) {
    if (error) throw error.message || error;
}

function remapBooks(data, detailed = false) {
    return data.map(ksiazka => ({
        id_ksiazki: ksiazka.id_ksiazki,
        tytul: ksiazka.tytul,
        okladka: ksiazka.okladka,
        cena: ksiazka.cena,
        promocja: ksiazka.promocja,
        autor: ksiazka.autorzy,
        gatunki: ksiazka.gatunki_ksiazki?.map(gk => gk.gatunki.gatunek) || [],
        gatunki_id: detailed ? ksiazka.gatunki_ksiazki?.map(gk => gk.gatunki.id_gatunku) : undefined,
        ilosc_stron: detailed ? ksiazka.ilosc_stron : undefined,
        ilosc_na_stanie: detailed ? ksiazka.ilosc_na_stanie : undefined,
        opis: detailed ? ksiazka.opis : undefined,
        koszyk: ksiazka.koszyk?.map(gk => gk.posiadane) || [],
        ulubione_ksiazki: ksiazka.ulubione_ksiazki?.map(gk => gk.posiadane) || [],
    }));
}

exports.searchBooks = async (field, query, type = 'ilike') => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(baseSelect)
        [type](field, type === 'ilike' ? `%${query}%` : query)
        .not(field.includes('.') ? field.split('.')[0] : field, 'is', null);

    handleSupabaseError(error);

    return remapBooks(data);
}

exports.getTopBooks = async (limit = 10) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(baseSelect)
        .limit(limit);

    handleSupabaseError(error);

    return remapBooks(data);
}

exports.getLowStockBooks = async () => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(baseSelect)
        .lt('ilosc_na_stanie', 10);

    handleSupabaseError(error);

    return remapBooks(data);
}

exports.getPromotionBooks = async () => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(baseSelect)
        .not('promocja', 'is', null);

    handleSupabaseError(error);

    return remapBooks(data);
}

exports.getBookDetails = async (id_ksiazki) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(`${baseSelect}, ilosc_stron, ilosc_na_stanie, opis`)
        .eq('id_ksiazki', id_ksiazki)
        .maybeSingle();

    handleSupabaseError(error);

    return remapBooks([data], true)[0];
}

exports.getSimilarBooks = async (genres) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select('id_ksiazki, tytul, okladka, gatunki_ksiazki (id_gatunku)');

    handleSupabaseError(error);

    return data.filter(book => 
        book.gatunki_ksiazki.some(gk => genres.includes(gk.id_gatunku))
    );
}

exports.getAuthors = async () => {
    const { data, error } = await supabase
        .from('autorzy')
        .select('id_autora, imie, nazwisko');

    handleSupabaseError(error);

    return data;
}

exports.getGenres = async () => {
    const { data, error } = await supabase
        .from('gatunki')
        .select('id_gatunku, gatunek');

    handleSupabaseError(error);

    return data;
}

// Operacje na książkach użytkownika (ulubione, koszyk itd.)
exports.userBookAction = {
    get: async (table, userId) => {
        const { data, error } = await supabase
            .from('ksiazki')
            .select(`id_ksiazki, okladka, tytul, ${table}()`)
            .eq(`${table}.id_klienta`, userId)
            .eq(`${table}.posiadane`, true)
            .not(table, 'is', null);

        handleSupabaseError(error);
        return data;
    },
    getById: async (table, id_ksiazki) => {
        const { data, error } = await supabase
            .from(table)
            .select('id_ksiazki, posiadane')
            .eq('id_ksiazki', id_ksiazki)
            .maybeSingle();

        handleSupabaseError(error);
        return data;
    },
    insert: async (table, input) => {
        const { data, error } = await supabase
            .from(table)
            .insert(input);

        handleSupabaseError(error);
        return data;
    },
    update: async (table, id_ksiazki, posiadane) => {
        const { data, error } = await supabase
            .from(table)
            .update({ posiadane })
            .eq('id_ksiazki', id_ksiazki);

        handleSupabaseError(error);
        return data;
    }
}





































































const select = 'id_ksiazki, tytul, okladka, cena, promocja, autorzy (imie, nazwisko), gatunki_ksiazki (gatunki (gatunek, id_gatunku)), ulubione_ksiazki (posiadane), koszyk (posiadane)';

function RemapData(data) {
    const result = data.map(ksiazka => ({
        id_ksiazki: ksiazka.id_ksiazki,
        tytul: ksiazka.tytul,
        okladka: ksiazka.okladka,
        cena: ksiazka.cena,
        promocja: ksiazka.promocja,
        autor: ksiazka.autorzy,
        gatunki: ksiazka.gatunki_ksiazki.map(gk => gk.gatunki.gatunek),
        koszyk : ksiazka.koszyk.map(gk => gk.posiadane),
        ulubione_ksiazki: ksiazka.ulubione_ksiazki.map(gk => gk.posiadane)
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
        gatunki_id:  ksiazka.gatunki_ksiazki.map(gk => gk.gatunki.id_gatunku),
        koszyk : ksiazka.koszyk.map(gk => gk.posiadane),
        ulubione_ksiazki: ksiazka.ulubione_ksiazki.map(gk => gk.posiadane)
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

exports.GetUserBookById = async (from, id_ksiazki) => {
    const { data, error } = await supabase
        .from(from)
        .select('id_ksiazki, posiadane')
        .eq('id_ksiazki', id_ksiazki)
        .maybeSingle()

    if (error) throw error.message;

    return data;
}

exports.SetUserBookById = async (from, input) => {
    const { data, error } = await supabase
        .from(from)
        .insert(input);

    if (error) throw error.message;

    return data;
}

exports.UpdateUserBookById = async (from, input, eq) => {
    const { data, error } = await supabase
        .from(from)
        .update({ 'posiadane' : input })
        .eq('id_ksiazki', eq);

    if (error) throw error.message;

    return data;
}

exports.GetBooksById = async (userId) => {
    const { data, error } = await supabase
        .from('ksiazki')
        .select(`id_ksiazki, okladka, tytul, koszyk()`)
        .eq('id_klienta', userId)
        .not('koszyk', 'is', null);

    if (error) throw error.message;

    return data;
}