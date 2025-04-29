const { GetSearchedBooksByTitle, GetSearchedBooksByGenre, GetSearchedBooksByAuthor } = require("../models/bookModel");

exports.getSearchedBooks = async (searchParams) => {
    try {
        const { title, genre, author } = searchParams;

        if (title) {
            return await GetSearchedBooksByTitle(title);
        } else if (genre) {
            return await GetSearchedBooksByGenre(genre);
        } else if (author) {
            return await GetSearchedBooksByAuthor(author);
        } else { 
            return null; 
        }
    } catch (error) {
        throw error;
    }
};