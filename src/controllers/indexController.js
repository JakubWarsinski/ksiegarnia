const indexService = require('../services/indexService');

const paths = {
    home: 'home/home',
    book: 'books/book_detail',
    genres: 'home/genres',
    authors: 'home/authors'
};

///////////////////////////////////
//          GET METHOD           //
///////////////////////////////////

exports.homePage = async (req, res) => {
    const param = req.query;
    
    try {
        if (param) {
            const searchedBooks = await indexService.getSearchedBooks(param);

            if (searchedBooks) return res.render(paths.home, { searchedBooks });
        }

        const topBooks = await indexService.getTopBooks();
        const lastBooks = await indexService.getLastBooks();
        const promotionBooks = await indexService.getPromotionBooks();

        return res.render(paths.home, { topBooks, lastBooks, promotionBooks });
    } catch(error) {
        return res.render(paths.home, { error });
    }
};

exports.genresPage = async (req, res) => {
    try {
        const genres = await indexService.getGenres();

        return res.render(paths.genres, { genres });
    } catch (error) {
        return res.render(paths.genres, { error });
    }
};

exports.authorsPage = async (req, res) => {
    try {
        const authors = await indexService.getAuthors();

        return res.render(paths.authors, { authors });
    } catch (error) {
        return res.render(paths.authors, { error });
    }
};

exports.bookPage = async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await indexService.getDetailedBook(id);

        return res.render(paths.book, { book });
    } catch (error) {
        return res.render(paths.book, { error });
    }
};