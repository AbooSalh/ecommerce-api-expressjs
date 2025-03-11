import type mongoose from "mongoose";

export class BaseService {
  private model;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  async findAll(page = 1, limit = 10) {
    {
      const skip = (page - 1) * limit;
      const results = await this.model.find({}).limit(limit).skip(skip);
      const data = {
        categories: results,
        currentPage: page,
        hasPrevPage: page > 1,
        hasNextPage: results.length === limit,
        lastPage: Math.ceil((await this.model.countDocuments()) / limit),
      };
      return data;
    }
  }
  //   async findById(title: string) {
  //     return this.model.findById();
  //   }

  //   async create(data: Partial<T>) {
  //     return this.model.create(data);
  //   }

  //   async update(id: string, data: Partial<T>) {
  //     return this.model.findByIdAndUpdate(id, data, { new: true });
  //   }

  //   async delete(id: string) {
  //     return this.model.findByIdAndDelete(id);
  //   }
}
