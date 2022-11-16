import {
  addBookToFavorite,
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from "@services/book.service";
import { auth } from "@middleware/auth.middleware";
import { user } from "@middleware/user.middleware";
import { NextFunction, Request, Response, Router } from "express";
import IBookOptions from "@models/book/options.model";
import IBookAddInput from "@models/book/add.model";
import IBookEditInput from "@models/book/edit.model";
import IHttpResponse from "@models/misc/http-response.model";
import { getUserFromRequest } from "@/services/auth.service";
import { book } from "@middleware/book.middleware";
import IBookQuery from "@models/book/query.model";

const router = Router();

/** Get a single book
 * @auth required
 * @user status is active
 * @book id is valid
 * @route {GET} /book
 * @param id number
 * @returns book Book
 */
router.get(
  "/book/:id",
  [auth.required, book.validId, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = Number(req.params.id);
      const book = await getBook(bookId);
      const resBody: IHttpResponse = { success: true, data: book };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Get books
 * @auth required
 * @user status is active
 * @route {GET} /books
 * @query query IBookQuery
 * @query options IBookOptions
 * @returns books Book[]
 */
router.get(
  "/books",
  [auth.required, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.query as IBookQuery;
      const options = req.query.options as IBookOptions;
      const books = await getBooks(query, options);
      const resBody: IHttpResponse = { success: true, data: books };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Create a new book
 * @auth required
 * @book id is valid
 * @user status is active
 * @route {POST} /book
 * @bodyParam book IBookInput
 * @returns book Book
 */
router.post(
  "/book",
  [auth.required, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookInput: IBookAddInput = req.body.book;
      const newBook = await createBook(bookInput);
      const resBody: IHttpResponse = { success: true, data: newBook };
      res.status(201).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Update an existing book
 * @auth required
 * @book id is valid
 * @user status is active
 * @route {PATCH} /book
 * @param id number
 * @bodyParam book IBookEditInput
 * @returns book Partial<Book>
 */
router.patch(
  "/book/:id",
  [auth.required, book.validId, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = Number(req.params.id);
      const editInput: IBookEditInput = req.body.book;
      const updatedBook = await updateBook(bookId, editInput);
      const resBody: IHttpResponse = { success: true, data: updatedBook };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Deletes an existing book
 * @auth required
 * @book id is valid
 * @user status is active
 * @route {DELETE} /book
 * @param id number
 */
router.delete(
  "/book/:id",
  [auth.required, book.validId, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = Number(req.params.id);
      await deleteBook(bookId);
      const resBody: IHttpResponse = { success: true };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Adds book to user favorites
 * @auth required
 * @book id is valid
 * @user status is active
 * @route {POST} /book/addToFavorite
 * @bodyParam book.id number
 */
router.post(
  "/book/addToFavorite",
  [auth.required, book.validId, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayload = getUserFromRequest(req);
      const bookId = req.body.book.id as unknown as number;
      await addBookToFavorite(bookId, userPayload);
      const resBody: IHttpResponse = { success: true };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

export default router;
