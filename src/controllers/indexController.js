const { getSearchedBooks, getUserBookById } = require('../services/indexService');
const { getTopBooks, getLowStockBooks, getPromotionBooks, getBookDetails, getSimilarBooks, getAuthors, getGenres } = require("../models/bookModel");
const { indexPaths } = require('../utils/indexPaths');

exports.showHomePage = async (req, res) => {
    try {
        const searchBooks = await getSearchedBooks(req.query);

        if (searchBooks) {
            return res.render(indexPaths.home, { searchBooks });
        }

        const topBooks = await getTopBooks(10);
        const lastBooks = await getLowStockBooks();
        const promotionBooks = await getPromotionBooks();

        return res.render(indexPaths.home, { topBooks, lastBooks, promotionBooks });
    } catch (error) {
        return res.render(indexPaths.home, { error });
    }
};

exports.showGenres = async (req, res) => {
    try {
        const genres = await getGenres();

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

        const book = await getBookDetails(id);

        let similarBooks = await getSimilarBooks(book.gatunki_id);
        
        similarBooks = similarBooks.filter(b => b.id_ksiazki !== book.id_ksiazki);

        return res.render(indexPaths.book, { book, similarBooks });
    } catch (error) {
        return res.render(indexPaths.book, { error });
    }
};