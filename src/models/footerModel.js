const supabase = require('../server/supaBase.js');

exports.getEmail = async (email) => {
    const { data, error } = await supabase
        .from('newsletter')
        .select('email')
        .eq('email', email)
        .maybeSingle();

    if (error) throw error;

    return data;
}

exports.SetEmail = async (email) => {
    const { data, error } = await supabase
        .from('newsletter')
        .insert([{ email }])
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;
}