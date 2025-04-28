const supabase = require('../server/supaBase.js');

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