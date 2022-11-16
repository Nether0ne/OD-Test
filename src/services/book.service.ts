import HttpException from "@models/misc/http-exception.model";
import IBookAddInput from "@/models/book/add.model";
import IBookEditInput from "@models/book/edit.model";
import prisma from "@/prisma/prisma-instance";
import { Book, Prisma } from "@prisma/client";
import IBookOptions from "@models/book/options.model";
import IUserPayload from "@models/auth/user-payload.model";
import IBookQuery from "@models/book/query.model";

export const getBook = async (id: number): Promise<Book> => {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    throw new HttpException(404, "BOOK_NOT_FOUND");
  }

  return book;
};

export const getBooks = async (
  query: IBookQuery,
  options: IBookOptions,
): Promise<Book[]> => {
  const { sort, limit: take, page, skip } = options;
  let currentSkip = skip;

  if (!currentSkip && page && take) {
    currentSkip = (page - 1) * take;
  }

  const where: Prisma.BookWhereInput = {
    title: query?.title ?? undefined,
    author: query?.author ?? undefined,
    year: query?.year ?? undefined,
  };
  const orderBy = sort
    ? Object.entries(sort).map(([key, val]) => ({
        [key]: val === -1 ? "desc" : "asc",
      }))
    : undefined;

  return await prisma.book.findMany({
    where,
    take,
    skip: currentSkip,
    orderBy,
  });
};

export const createBook = async (input: IBookAddInput): Promise<Book> => {
  const { title, author, year } = input;
  if (!title) {
    throw new HttpException(422, "TITLE_REQUIRED");
  }

  if (!author) {
    throw new HttpException(422, "AUTHOR_REQUIRED");
  }

  if (!year) {
    throw new HttpException(422, "YEAR_REQUIRED");
  }

  return await prisma.book.create({
    data: { title, author, year },
  });
};

export const updateBook = async (
  id: number,
  editInput: IBookEditInput,
): Promise<Partial<Book>> => {
  const select: Prisma.BookSelect = Object.entries(editInput).reduce(
    (o, [key, val]) => ({ ...o, [key]: val }),
    {},
  );

  return await prisma.book.update({
    where: { id },
    data: editInput,
    select,
  });
};

export const deleteBook = async (id: number): Promise<void> => {
  if (id < 0) {
    throw new HttpException(422, "ID_IS_INVALID");
  }

  const foundBook = await prisma.book.findUnique({ where: { id } });
  if (!foundBook) {
    throw new HttpException(404, "BOOK_NOT_FOUND");
  }

  await prisma.book.delete({ where: { id } });
};

export const addBookToFavorite = async (
  bookId: number,
  userPayload: IUserPayload,
): Promise<void> => {
  const { id: userId } = userPayload;

  if (bookId < 0) {
    throw new HttpException(422, "BOOK_ID_IS_INVALID");
  }

  if (userId < 0) {
    throw new HttpException(422, "USER_ID_IS_INVALID");
  }

  const foundBook = await prisma.book.findUnique({ where: { id: bookId } });
  if (!foundBook) {
    throw new HttpException(404, "BOOK_NOT_FOUND");
  }

  await prisma.book.update({
    where: { id: bookId },
    data: { favoritedByUsers: { connect: { id: userId } } },
  });
};
