// import { ApiFeatures } from "@/common/utils/api/ApiFeatures";
// import Category from "../Category/model";
// import subCategory from "./model";
// const model = subCategory;
// import ApiError from "@/common/utils/api/ApiError";

// interface ICreate {
//   title: string;
//   slug?: string;
//   image?: string;
//   categorySlug: string;
// }
// interface IUpdate {
//   title?: string;
//   slug?: string;
//   image?: string;
//   categorySlug?: string;
// }
// export const subCategoryService = {
//   // Get all categories
//   getAll: async (reqQuery: { [key: string]: string }) => {
//     const apiFeatures = new ApiFeatures(model.find(), reqQuery)
//       .filter()
//       .search()
//       .sort()
//       .paginate(await model.countDocuments())
//       .limitFields();
//     const { mongooseQuery, pagination } = await apiFeatures;
//     const data = await mongooseQuery;
//     return { data, pagination };
//   },
//   // Get one category by slug
//   getOne: async (slug: string) => {
//     const data = await model.findOne({ slug });

//     if (!data) {
//       throw new ApiError("Sub Category not found", "NOT_FOUND");
//     }
//     return data;
//   },
//   // Create a new category
//   create: async (categoryData: ICreate) => {
//     const { title, image, categorySlug } = categoryData;
//     const categoryId = await Category.findOne({ slug: categorySlug });
//     const data = await model.create({
//       title,
//       image,
//       category: categoryId,
//     });
//     return data;
//   },
//   // Update a category by slug
//   update: async (slug: string, updatedData: IUpdate) => {
//     const categoryId = await Category.findOne({
//       slug: updatedData.categorySlug,
//     });
//     if (!categoryId) {
//       throw new ApiError("Category not found", "NOT_FOUND");
//     }
//     const data = await model.findOneAndUpdate(
//       { slug },
//       { $set: { ...updatedData, category: categoryId } },
//       { new: true, runValidators: true } // Ensures validation runs on update
//     );
//     if (!data) {
//       throw new ApiError("Sub Category not found", "NOT_FOUND");
//     }
//     return data;
//   },
//   // Delete a category by slug
//   delete: async (slug: string) => {
//     const data = await model.findOneAndDelete({ slug });
//     if (!data) {
//       throw new ApiError("Sub Category not found", "NOT_FOUND");
//     }
//     return data;
//   },
// };
