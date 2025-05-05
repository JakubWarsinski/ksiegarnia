const supabase = require('../config/supaBase.js');

///////////////////////////////////
//            SELECT             //
///////////////////////////////////

exports.selectUser = async (select, input, useOr = false) => {
    let query = supabase.from('klienci').select(select);

    if (useOr) query = query.or(input);
    else query = query.match(input);

    query = query.maybeSingle();

    const { data, error } = await query;

    if (error) throw error.message;

    return data;
}

///////////////////////////////////
//            INSERT             //
///////////////////////////////////

exports.insertUser = async (input) => {
    const { error } = await supabase
        .from('klienci')
        .insert(input);

    if (error) throw error.message;

    return null;
}

///////////////////////////////////
//            UPDATE             //
///////////////////////////////////

exports.updateUser = async (input, userId) => {
    const { error } = await supabase
        .from('klienci')
        .update(input)
        .eq('id_klienta', userId);

    if (error) throw error.message;

    return null;
}

///////////////////////////////////
//            OTHERS             //
///////////////////////////////////

exports.selectItemWithCount = async (from, userId) => {
    const { data, count, error } = await supabase
        .from(from)
        .select('id_ksiazki, posiadane', { count: 'exact' })
        .eq('id_klienta', userId)
        .not('posiadane', 'is', false);

    if (error) throw error.message;

    return { data, count };
}