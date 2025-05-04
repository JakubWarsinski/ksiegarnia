const supabase = require('../config/supaBase.js');

exports.selectUserDetails = async (userId) => {
    const { data, error } = await supabase
        .from('klienci')
        .select('id_klienta, login, imie, nazwisko, email, numer_telefonu, ulica, numer_domu, numer_lokalu, kod_pocztowy, miejscowosc')
        .eq('id_klienta', userId)
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.selectUserAND = async (select, match) => {
    const { data, error } = await supabase
        .from('klienci')
        .select(select)
        .match(match)
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.selectUserOR = async (select, login, email) => {
    const { data, error } = await supabase
        .from('klienci')
        .select(select)
        .or(`email.eq.${email},login.eq.${login}`)
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.count = async (from, userId) => {
    const { data, count, error } = await supabase
        .from(from)
        .select('id_ksiazki', { count: 'exact' })
        .match({ 'id_klienta': userId, 'posiadane': true })

    if (error) throw error.message;

    return { data, count };
}

exports.setUser = async (insert) => {
    const { data, error } = await supabase
        .from('klienci')
        .insert(insert)
        .select('id_klienta, login')
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.updateUserData = async (update, eq) => {    
    const { data, error } = await supabase
        .from('klienci')
        .update(update)
        .eq('id_klienta', eq)
        .select('id_klienta')
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.createFacture = async (kwota, data_wystawienia) => {
    const { data, error } = await supabase
        .from('faktury')
        .insert([{ kwota, data_wystawienia }])
        .select()
        .single();

    if (error) throw error;

    return data;
}

exports.createOrder = async (id_klienta, id_faktury, id_dostawy) => {
    const { data, error } = await supabase
        .from('zamowienia')
        .insert([{
            id_klienta,
            id_faktury,
            id_dostawy,
            data_zamowienia: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

    if (error) throw error;

    return data;
}

exports.createOrderRelation = async (orderBooksData) => {
    const { error: insertError } = await supabase
        .from('zamowienia_ksiazki')
        .insert(orderBooksData);

    return insertError;
}

exports.getDelivers = async () => {
    const { data, error } = await supabase
        .from('dostawy')
        .select('*');

    if (error) throw error;

    return data;
}

exports.GetUserDetails = async (userId) => {
    const { data, error } = await supabase
        .from('klienci')
        .select('*')
        .eq('id_klienta', userId)
        .maybeSingle();

    if (error) throw error;

    return data;
}

exports.GetAllDelivers = async () => {    
    const { data, error } = await supabase
        .from('dostawy')
        .select('id_dostawy, nazwa_dostawy')

    if (error) throw error.message;

    return data;
}