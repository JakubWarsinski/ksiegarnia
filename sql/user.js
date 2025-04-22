const supabase = require('../supabaseClient');

async function getUserByLogin(login, select) {
    const { data, error } = await supabase
        .from('klienci')
        .select(select)
        .eq('login', login)
        .maybeSingle();

    if (error) throw error;
    return data;
}

async function setNewUser(login, haslo, imie, nazwisko, email, numer_telefonu) {
    const { error: insertError } = await supabase
        .from('klienci')
        .insert([{
            login,
            haslo,
            imie,
            nazwisko,
            email,
            numer_telefonu
        }]);

    return insertError;
}

async function AddBookToFavorites(id_klienta, id_ksiazki) {
    const { error: insertError } = await supabase
        .from('ulubione_ksiazki')
        .insert([{
            id_klienta, 
            id_ksiazki
        }]);

    return insertError;
}

module.exports = {
    getUserByLogin,
    setNewUser,
    AddBookToFavorites
};