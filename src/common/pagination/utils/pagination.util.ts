import { PaginationQueryDto } from '../dto/pagination-query.dto';

export function PaginationSolver(paginationQueryDto: PaginationQueryDto) {
  let { page = 0, limit = 10 } = paginationQueryDto;
  if (!page || page <= 0) {
    page = 0;
  }
  if (!limit || limit <= 0) {
    limit = 10;
  }
  const skip = (page - 1) * limit;
  return {
    page,
    skip,
    limit,
  };
}
