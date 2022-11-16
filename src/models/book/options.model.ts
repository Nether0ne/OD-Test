export default interface IBookOptions {
  sort?: { [key: string]: number };
  limit?: number;
  page?: number;
  skip?: number;
}
