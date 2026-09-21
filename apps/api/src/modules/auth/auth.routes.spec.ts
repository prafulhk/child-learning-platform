import { describe, expect, it } from "vitest";
import request from "supertest";

import { app } from "../../app.js";

describe("Auth API", () => {
  it("returns 400 for invalid login data", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "invalid-email",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("returns 400 for invalid registration data", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "A",
      email: "invalid-email",
      password: "short",
      confirmPassword: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
