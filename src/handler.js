/* eslint-disable no-console */
const { nanoid } = require('nanoid');
const bookCollection = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookCollection.push(newBook);

  const isSuccess = bookCollection.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { reading, finished } = request.query;
  const queryName = request.query.name;
  if (queryName === undefined && reading === undefined && finished === undefined) {
    return {
      status: 'success',
      data: {
        books: bookCollection.map((book) => {
          const { id, name, publisher } = book;
          return {
            id, name, publisher,
          };
        }),
      },
    };
  }

  if (queryName !== undefined) {
    return {
      status: 'success',
      data: {
        books: bookCollection.filter((n) => n.name.toLowerCase().includes(queryName.toLowerCase()))
          .map((book) => {
            const { id, name, publisher } = book;
            return {
              id, name, publisher,
            };
          }),
      },
    };
  }

  if (reading !== undefined) {
    return {
      status: 'success',
      data: {
        books: bookCollection.filter((n) => +n.reading === +reading).map((book) => {
          const { id, name, publisher } = book;
          return {
            id, name, publisher,
          };
        }),
      },
    };
  }

  if (finished !== undefined) {
    return {
      status: 'success',
      data: {
        books: bookCollection.filter((n) => +n.finished === +finished).map((book) => {
          const { id, name, publisher } = book;
          return {
            id, name, publisher,
          };
        }),
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = bookCollection.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = bookCollection.findIndex((n) => n.id === bookId);
  if (index !== -1) {
    bookCollection[index] = {
      ...bookCollection[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = bookCollection.findIndex((n) => n.id === bookId);

  if (index !== -1) {
    bookCollection.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
