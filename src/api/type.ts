
interface ApiSearchParams<T extends Record<string, any> = Record<string, any>> {
  pageSize: number;
  pageNum: number;
  con?: T;
}
