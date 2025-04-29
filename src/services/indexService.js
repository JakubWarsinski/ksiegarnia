const { searchBooks } = require("../models/bookModel");

exports.getSearchedBooks = async (searchParams) => {
    try {
        const { title, genre, author } = searchParams;

        if (title) {
            return await searchBooks('tytul', title, 'ilike');
        } else if (genre) {
            return await searchBooks('gatunki_ksiazki.id_gatunku', genre, 'eq');
        } else if (author) {
            return await searchBooks('id_autora', author, 'eq');
        } else { 
            return null; 
        }
    } catch (error) {
        throw error;
    }
};