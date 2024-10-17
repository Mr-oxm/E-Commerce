// utils/pagination.js
const paginate = async (model, query, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(query);
  
    const results = await model.find(query).limit(limit).skip(startIndex);
  
    const pagination = {};
  
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit
      };
    }
  
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit: limit
      };
    }
  
    return {
      results,
      pagination,
      total
    };
  };
  
  module.exports = paginate;