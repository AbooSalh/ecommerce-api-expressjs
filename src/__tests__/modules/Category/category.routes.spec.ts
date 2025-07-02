import request from "supertest";
import app from "@/server";

describe("Category API", () => {
  describe("GET /api/categories", () => {
    it("should return 200 and a paginated list of categories with correct structure", async () => {
      const res = await request(app).get("/api/categories");
      expect(res.statusCode).toBe(200);

      // Check top-level response structure
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("statusMessage", "OK");
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("result");
      expect(res.body.result).toHaveProperty("documents");
      expect(Array.isArray(res.body.result.documents)).toBe(true);

      // Check pagination object
      expect(res.body.result).toHaveProperty("pagination");
      expect(res.body.result.pagination).toHaveProperty("currentPage");
      expect(res.body.result.pagination).toHaveProperty("limit");
      expect(res.body.result.pagination).toHaveProperty("totalPages");
      expect(res.body.result.pagination).toHaveProperty("totalResults");

      // Check each category object
      for (const category of res.body.result.documents) {
        expect(category).toHaveProperty("_id");
        expect(category).toHaveProperty("name");
        expect(typeof category.name).toBe("string");
        // Add more property checks as needed
      }
    });

    it("should support pagination query params", async () => {
      const res = await request(app).get("/api/categories?limit=2&page=1");
      expect(res.statusCode).toBe(200);
      expect(res.body.result.documents.length).toBeLessThanOrEqual(2);
      expect(res.body.result.pagination.currentPage).toBe(1);
      expect(res.body.result.pagination.limit).toBe(2);
    });

    it("should return an empty array if no categories exist (simulate with filter)", async () => {
      const res = await request(app).get(
        "/api/categories?name=__nonexistent__"
      );
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.result.documents)).toBe(true);
      expect(res.body.result.documents.length).toBe(0);
    });
  });

  describe("GET /api/categories/:id", () => {
    it("should return 422 for invalid category id", async () => {
      const res = await request(app).get("/api/categories/invalidid");
      expect(res.statusCode).toBe(422);
    });
  });

  describe("POST /api/categories", () => {
    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app).post("/api/categories").send({});
      expect(res.statusCode).toBe(401);
    });
  });
});
