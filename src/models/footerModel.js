const supabase = require('../config/supaBase.js');

exports.getEmail = async (email) => {
    const { data, error } = await supabase
        .from('newsletter')
        .select('email')
        .eq('email', email)
        .maybeSingle();

    if (error) throw error.message;

    return data;
}

exports.setEmail = async (email) => {
    const { data, error } = await supabase
        .from('newsletter')
        .insert([{ email }])
        .select()
        .maybeSingle();

    if (error) throw error.message;

    return data;
}