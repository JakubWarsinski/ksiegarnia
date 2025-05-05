const supabase = require('../config/supaBase.js');

const bookSelect = 'id_ksiazki, tytul, okladka, cena, promocja, autorzy (imie, nazwisko), gatunki_ksiazki (gatunki (gatunek))';

///////////////////////////////////
//            SELECT             //
///////////////////////////////////

exports.selectOrdersWithFacture = async (userId) => {
    const { data, error } = await supabase
        .from('zamowienia')
        .select('id_zamowienia, data_zamowienia, faktury(kwota)')
        .eq('id_klienta', userId);

    if (error) throw error.message;

    result = data.map(order => {
        return {
            id_zamowienia : order.id_zamowienia,
            data_zamowienia : order.data_zamowienia,
            kwota: order.faktury.kwota
        }
    });

    return result;
}

exports.selectOrderDetails = async (input) => {    
    const { data, error } = await supabase
        .from('zamowienia')
        .select('id_zamowienia, data_zamowienia, dostawy(nazwa_dostawy), faktury(kwota), zamowienia_ksiazki(ilosc, ksiazki(id_ksiazki, tytul))')
        .match(input)
        .maybeSingle();

    if (error) throw error.message;

    const result = {
        id_zamowienia : data.id_zamowienia,
        data_zamowienia : data.data_zamowienia,
        dostawa : data.dostawy.nazwa_dostawy,
        kwota : data.faktury.kwota,
        ksiazki: data.zamowienia_ksiazki.map(zk => ({
            id_ksiazki: zk.ksiazki.id_ksiazki,
            tytul: zk.ksiazki.tytul,
            ilosc: zk.ilosc
        }))
    };

    return result;
}

exports.selectFavoritesBooks = async (id_klienta) => {    
    const { data, error } = await supabase
        .from('ksiazki')
        .select(`${bookSelect}, opis, ulubione_ksiazki()`)
        .match({'ulubione_ksiazki.id_klienta' : id_klienta, 'ulubione_ksiazki.posiadane' : true})
        .not('ulubione_ksiazki', 'is', null)
        .order('id_ksiazki', { ascending: true });

    if (error) throw error.message;

    const result = data.map(ksiazka => {
        return {
            id_ksiazki: ksiazka.id_ksiazki,
            tytul: ksiazka.tytul,
            okladka: ksiazka.okladka,
            cena: ksiazka.cena,
            opis: ksiazka.opis.length > 100 ? ksiazka.opis.slice(0, 97) + '...' : ksiazka.opis,
            promocja: parseFloat((ksiazka.cena * (ksiazka.promocja / 100)).toFixed(2)),
            autor: ksiazka.autorzy,
            gatunki: ksiazka.gatunki_ksiazki.map(gk => gk.gatunki.gatunek),
        };
    });

    return result;
}

exports.selectCartBooks = async (id_klienta) => {    
    const { data, error } = await supabase
        .from('ksiazki')
        .select(`${bookSelect}, koszyk(ilosc))`)
        .match({'koszyk.id_klienta' : id_klienta, 'koszyk.posiadane' : true})
        .not('koszyk', 'is', null)
        .order('id_ksiazki', { ascending: true });

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
            ilosc: ksiazka.koszyk?.[0]?.ilosc ?? 0
        };
    });

    return result;
}

exports.selectUserDetails = async (userId) => {
    const { data, error } = await supabase
        .from('klienci')
        .select('id_klienta, login, imie, nazwisko, email, numer_telefonu, ulica, numer_domu, numer_lokalu, kod_pocztowy, miejscowosc')
        .eq('id_klienta', userId)
        .maybeSingle();

    if (error) throw error.message;

    return data;
}