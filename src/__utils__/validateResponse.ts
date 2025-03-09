import { Response } from "supertest";
export const validateResponse = (
  response: Response,
  expectedStatus: number,
  expectedMessage: string
) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty("response");
  expect(response.body.response).toHaveProperty("statusCode", expectedStatus);
  expect(response.body.response).toHaveProperty("statusMessage");
  expect(response.body.response).toHaveProperty("message", expectedMessage);
  expect(response.body.response).toHaveProperty("timestamp");
  expect(response.body.response).toHaveProperty("status");
  if (expectedStatus >= 200 && expectedStatus < 300) {
    expect(response.body).toHaveProperty("data");
  } else {
    expect(response.body).toHaveProperty("errors");
  }
};
