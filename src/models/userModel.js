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
    const { count, error } = await supabase
        .from(from)
        .select('id_klienta', { count: 'exact' })
        .eq('id_klienta', userId)
        .eq('posiadane', true);

    if (error) throw error.message;

    return count;
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