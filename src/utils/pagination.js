function getPagination(query) {
  const page = parseInt(query.page) || 1;
  const allowedLimits = [10, 20, 50];
  const requestedLimit = parseInt(query.limit);
  const limit = allowedLimits.includes(requestedLimit) ? requestedLimit : 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

function formatPaginationResult(rows, count, page, limit) {
  return {
    data: rows,
    pagination: {
      total: count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit),
    },
  };
}

module.exports = { getPagination, formatPaginationResult };
