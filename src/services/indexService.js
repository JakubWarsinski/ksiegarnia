const bookModel = require("../models/bookModel");

exports.getSearchedBooks = async (searchParams) => {
    const { title, genre, author } = searchParams;
    
    try {
        if (title) return await bookModel.selectBooksByTitle(title);
        if (genre) return await bookModel.selectBooksByGenre(genre);
        if (author) return await bookModel.selectBooksByAuthor(author); 
        
        return null;
    } catch (error) {
        throw error;
    }
};

exports.getTopBooks = async () => {
    try {
        const data = await bookModel.selectTopBooks();

        if (!data) throw 'Nie odnaleziono popularnych książek';

        return data;
    } catch(error) {
        return error;
    }
}

exports.getPromotionBooks = async () => {
    try {
        const data = await bookModel.selectPromotionBooks();

        if (!data) throw 'Nie odnaleziono książek na promocji';

        return data;
    } catch(error) {
        return error;
    }
}

exports.getLastBooks = async () => {
    try {
        const data = await bookModel.selectLastBooks();

        if (!data) throw 'Nie odnaleziono ostatnich książek na składzie';

        return data;
    } catch(error) {
        return error;
    }
}

exports.getDetailedBook = async (id) => {
    try {
        const data = await bookModel.selectDetailedBook(id);

        if (!data) throw 'Nie odnaleziono ksiazki';

        return data;
    } catch(error) {
        return error;
    }
}

exports.getGenres = async () => {
    try {
        const data = await bookModel.selectAllGenres();

        if (!data) throw 'Nie odnaleziono anijednego gatunku';

        return data;
    } catch(error) {
        throw error;
    }
}

exports.getAuthors = async () => {
    try {
        const data = await bookModel.selectAllAuthors();

        if (!data) throw 'Nie odnaleziono anijednego autora';

        return data;
    } catch(error) {
        throw error;
    }
}