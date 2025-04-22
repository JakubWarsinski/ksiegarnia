const supabase = require('../supabaseClient');

async function getEmail(email) {
    const { data, error } = await supabase
        .from('newsletter')
        .select('email')
        .eq('email', email)
        .maybeSingle();

    if (error) throw error;
    return data;
}

async function setNewEmail(email) {
    const { error: insertError } = await supabase
        .from('newsletter')
        .insert([{email}]);

    return insertError;
}

module.exports = {
    getEmail,
    setNewEmail
};