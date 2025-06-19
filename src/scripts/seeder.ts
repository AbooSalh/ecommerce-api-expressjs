import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Import models
import BrandM from "../modules/Brands/model";
import Category from "../modules/category/model";
import ProductM from "../modules/Product/model";
import UserM from "../modules/User/model";
import ReviewM from "../modules/Review/model";
import CartM from "../modules/Cart/model";
import CouponM from "../modules/Coupon/model";
import { faker } from "@faker-js/faker";

const MONGO_URI =
  (process.env.DB_URL ?? "mongodb://localhost:27017/") +
  "/" +
  (process.env.DB_NAME ?? "ecommerce_db");

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB");

  // Clear collections
  await Promise.all([
    BrandM.deleteMany({}),
    Category.deleteMany({}),
    ProductM.deleteMany({}),
    UserM.deleteMany({}),
    ReviewM.deleteMany({}),
    CartM.deleteMany({}),
    CouponM.deleteMany({}),
  ]);

  // Brands (unique titles)
  const brandTitles = new Set<string>();
  const brandsArr = [];
  while (brandsArr.length < 5) {
    const title = faker.company.name();
    if (!brandTitles.has(title)) {
      brandTitles.add(title);
      brandsArr.push({
        title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        image: faker.image.url(),
      });
    }
  }
  const brands = await BrandM.insertMany(brandsArr);

  // Categories (unique titles)
  const categoryTitles = new Set<string>();
  const categoriesArr = [];
  while (categoriesArr.length < 5) {
    const title = faker.commerce.department();
    if (!categoryTitles.has(title)) {
      categoryTitles.add(title);
      categoriesArr.push({
        title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        image: faker.image.url(),
      });
    }
  }
  const categories = await Category.insertMany(categoriesArr);

  // Users
  const users = await UserM.insertMany(
    Array.from({ length: 5 }).map(() => {
      const name = faker.person.fullName();
      return {
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        role: "user",
        addresses: [],
        wishlist: [],
      };
    })
  );

  // Products
  const products = await ProductM.insertMany(
    Array.from({ length: 10 }).map(() => {
      const category = faker.helpers.arrayElement(categories);
      const brand = faker.helpers.arrayElement(brands);
      return {
        title: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
        description: faker.commerce.productDescription(),
        quantity: faker.number.int({ min: 1, max: 100 }),
        sold: faker.number.int({ min: 0, max: 20 }),
        price: faker.commerce.price(),
        discount: faker.number.int({ min: 1, max: 50 }),
        colors: [faker.color.human(), faker.color.human()],
        imageCover: faker.image.url(),
        images: [faker.image.url(), faker.image.url()],
        category: category._id,
        subCategories: [],
        brand: brand._id,
      };
    })
  );

  // Coupons
  await CouponM.insertMany(
    Array.from({ length: 3 }).map(() => ({
      name: faker.string.alphanumeric(8),
      expire: faker.date.future(),
      discount: faker.number.int({ min: 5, max: 50 }),
    }))
  );

  // Reviews
  await ReviewM.insertMany(
    Array.from({ length: 10 }).map(() => ({
      user: faker.helpers.arrayElement(users)._id,
      product: faker.helpers.arrayElement(products)._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      title: faker.lorem.sentence(3),
      comment: faker.lorem.sentences(2),
    }))
  );

  // Carts
  await CartM.insertMany(
    users.map((user) => ({
      user: user._id,
      cartItems: [
        {
          product: faker.helpers.arrayElement(products)._id,
          quantity: faker.number.int({ min: 1, max: 5 }),
          price: faker.commerce.price(),
          color: faker.color.human(),
          size: faker.helpers.arrayElement(["xs", "s", "m", "l", "xl", "xxl"]),
        },
      ],
      totalPrice: faker.commerce.price(),
      totalPriceAfterDiscount: faker.commerce.price(),
    }))
  );

  console.log("Database seeded!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
