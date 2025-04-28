const { getSearchedBooks } = require('../services/indexService');
const { GetTopBooks, GetLastBooks, GetPromotionBooks, GetDetailedDadaBook, GetSimilarBooks } = require("../models/bookModel");
const { GetGenres } = require('../models/genreModel');
const { getAuthors } = require('../models/authorModel');
const { indexPaths } = require('../utils/indexPaths');

exports.showHomePage = async (req, res) => {
    try {
        const searchBooks = await getSearchedBooks(req.query);

        if (searchBooks) {
            return res.render(indexPaths.home, { searchBooks });
        }

        const topBooks = await GetTopBooks();
        const lastBooks = await GetLastBooks();
        const promotionBooks = await GetPromotionBooks();

        return res.render(indexPaths.home, { topBooks, lastBooks, promotionBooks });
    } catch (error) {
        return res.render(indexPaths.home, { error });
    }
};

exports.showGenres = async (req, res) => {
    try {
        const genres = await GetGenres();

        return res.render(indexPaths.genres, { genres });
    } catch (error) {
        return res.render(indexPaths.genres, { error });
    }
};

exports.showAuthors = async (req, res) => {
    try {
        const authors = await getAuthors();

        return res.render(indexPaths.authors, { authors });
    } catch (error) {
        return res.render(indexPaths.authors, { error });
    }
};

exports.showBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await GetDetailedDadaBook(id);

        let similarBooks = await GetSimilarBooks(book.gatunki_id);
        
        similarBooks = similarBooks.filter(b => b.id_ksiazki !== book.id_ksiazki);

        return res.render(indexPaths.book, { book, similarBooks });
    } catch (error) {
        return res.render(indexPaths.book, { error });
    }
};