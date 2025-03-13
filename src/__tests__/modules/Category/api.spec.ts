import request from "supertest";
import Category from "@/modules/Category/model";
import dbConnection from "@/common/config/database.config";
import { validateResponse } from "@/__tests__/__utils__/validateResponse";
import app from "@/server";

describe("Category API Endpoints", () => {
  beforeAll(async () => {
    await dbConnection.connect();
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  afterEach(async () => {
    await Category.deleteMany({}); // Clean up the database after each test
  });

  describe("GET /api/categories", () => {
    it("should return all categories", async () => {
      const response = await request(app).get("/api/categories");
      validateResponse(response, 200, "Categories found");
      expect(response.body.data).toHaveProperty("categories");
    });
  });

  describe("GET /api/categories/:title", () => {
    it("should return a category by title", async () => {
      const category = await Category.create({
        title: "Test Category 1", // Ensure unique title
        image: "test1.jpg",
      });
      const response = await request(app).get(
        `/api/categories/${category.title}`
      );
      validateResponse(response, 200, "Category found");
      expect(response.body.data[0]).toHaveProperty("title", "Test Category 1");
    });

    it("should return 404 if category not found", async () => {
      const response = await request(app).get(
        "/api/categories/NonExistentCategory"
      );
      validateResponse(response, 404, "Category not found");
    });
  });

  describe("POST /api/categories", () => {
    it("should create a new category", async () => {
      const response = await request(app)
        .post("/api/categories")
        .send({ title: "New Category 1", image: "new1.jpg" }); // Ensure unique title
      validateResponse(response, 201, "Category created");
      expect(response.body.data).toHaveProperty("title", "New Category 1");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/api/categories").send({});
      validateResponse(response, 400, "Category title is required");
    });
  });

  describe("PUT /api/categories/:title", () => {
    it("should update an existing category", async () => {
      const category = await Category.create({
        title: "Update Category 1", // Ensure unique title
        image: "update1.jpg",
      });
      const response = await request(app)
        .put(`/api/categories/${category.title}`)
        .send({ title: "Updated Category 1", image: "updated1.jpg" }); // Ensure unique title
      validateResponse(response, 200, "Category updated");
      expect(response.body.data).toHaveProperty("title", "Updated Category 1");
    });

    it("should return 404 if category not found", async () => {
      const response = await request(app)
        .put("/api/categories/NonExistentCategory")
        .send({ title: "Updated Category 1", image: "updated1.jpg" });
      validateResponse(response, 404, "Category not found");
    });
  });

  describe("DELETE /api/categories/:title", () => {
    it("should delete an existing category", async () => {
      const category = await Category.create({
        title: "Delete Category 1", // Ensure unique title
        image: "delete1.jpg",
      });
      const response = await request(app).delete(
        `/api/categories/${category.title}`
      );
      validateResponse(response, 200, "Category deleted");
    });

    it("should return 404 if category not found", async () => {
      const response = await request(app).delete(
        "/api/categories/NonExistentCategory"
      );
      validateResponse(response, 404, "Category not found");
    });
  });
});
