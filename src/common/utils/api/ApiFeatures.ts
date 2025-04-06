/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IRequestBody {
  filters?: string;
  sort?: string;
  fields?: string;
  keywords?: string;
  page?: string;
  limit?: string;
  populate?: string;
}

export class ApiFeatures {
  mongooseQuery;
  reqBody: IRequestBody;

  constructor(mongooseQuery: any, reqBody: IRequestBody) {
    this.mongooseQuery = mongooseQuery;
    this.reqBody = reqBody;
  }

  filter() {
    const filters = this.reqBody.filters || {};
    const queryFilters: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === "object" && value !== null) {
        queryFilters[key] = { ...queryFilters[key], ...value };
      } else {
        queryFilters[key] = value;
      }
    }

    this.mongooseQuery = this.mongooseQuery.find(queryFilters);
    return this;
  }

  sort() {
    if (this.reqBody.sort) {
      const sortBy = this.reqBody.sort.split(" ").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.reqBody.fields) {
      const fields = this.reqBody.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-createdAt -__v");
    }
    return this;
  }

  search() {
    if (this.reqBody.keywords) {
      const keywords = this.reqBody.keywords;
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { title: { $regex: keywords, $options: "i" } },
          { description: { $regex: keywords, $options: "i" } },
        ],
      });
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.reqBody.page || "1") * 1 || 1;
    const limit = parseInt(this.reqBody.limit || "20") || 20;
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  populate() {
    this.mongooseQuery = this.mongooseQuery.populate(this.reqBody.populate);
    return this;
  }
}
