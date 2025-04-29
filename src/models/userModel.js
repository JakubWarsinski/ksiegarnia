const supabase = require('../server/supaBase.js');

exports.GetUser = async (select, eq, or) => {
    let query = supabase.from('klienci').select(select);
    
    if (eq && typeof eq === 'object' && !Array.isArray(eq)) {
        if (or) {
            const orQuery = Object.entries(eq)
                .map(([key, value]) => `${key}.eq.${value}`)
                .join(',');
    
            query = query.or(orQuery);
        } else {
            query = query.match(eq);
        }
    }

    query.maybeSingle();

    const { data, error } = await query;

    if (error) throw error.message;

    return data;
}

exports.SetUser = async (insert) => {
    const { data, error } = await supabase
        .from('klienci')
        .insert(insert)
        .select('id_klienta, login')
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.GetCount = async (from, userId) => {
    const { data, count, error } = await supabase
        .from(from)
        .select('id_ksiazki', { count: 'exact' })
        .match({ 'id_klienta': userId, 'posiadane': true })

    if (error) throw error.message;

    return { data, count };
}

exports.UpdateUserData = async (update, eq) => {    
    const { data, error } = await supabase
        .from('klienci')
        .update(update)
        .eq('id_klienta', eq)
        .select('id_klienta, login')
        .select()
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