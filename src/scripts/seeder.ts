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
      // Generate random stocks for product
      const sizes = ["xs", "s", "m", "l", "xl", "xxl"];
      const colors = [faker.color.human(), faker.color.human()];
      const stocks = [];
      for (const size of sizes) {
        for (const color of colors) {
          stocks.push({
            size,
            color,
            quantity: faker.number.int({ min: 1, max: 50 }),
          });
        }
      }
      return {
        title: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
        stocks,
        description: faker.commerce.productDescription(),
        quantity: faker.number.int({ min: 1, max: 100 }),
        sold: faker.number.int({ min: 0, max: 20 }),
        price: faker.commerce.price(),
        discount: faker.number.int({ min: 1, max: 50 }),
        imageCover: faker.image.url(),
        images: [faker.image.url(), faker.image.url()],
        category: category._id,
        subCategories: [],
        brand: brand._id,
      };
    })
  );

  // Coupons (unique codes)
  const couponCodes = new Set<string>();
  const couponsArr = [];
  while (couponsArr.length < 3) {
    const code = faker.string.alphanumeric(8);
    if (!couponCodes.has(code)) {
      couponCodes.add(code);
      couponsArr.push({
        code,
        expire: faker.date.future(),
        quantity: faker.number.int({ min: 1, max: 100 }),
        discount: faker.number.int({ min: 5, max: 50 }),
      });
    }
  }
  await CouponM.insertMany(couponsArr);

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
    users.map((user) => {
      const cartItems = [
        {
          product: faker.helpers.arrayElement(products)._id,
          quantity: faker.number.int({ min: 1, max: 5 }),
          price: Number(faker.commerce.price()),
          color: faker.color.human(),
          size: faker.helpers.arrayElement(["xs", "s", "m", "l", "xl", "xxl"]),
        },
      ];
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return {
        user: user._id,
        cartItems,
        totalPrice,
        totalPriceAfterDiscount: totalPrice,
      };
    })
  );

  console.log("Database seeded!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
