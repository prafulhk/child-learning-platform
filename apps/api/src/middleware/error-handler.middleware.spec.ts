import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

import { AppError } from "../shared/errors/app-error.js";
import { errorHandler, notFoundHandler } from "./error-handler.middleware.js";

describe("error handler middleware", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("maps known AppError values to consistent API responses", async () => {
    const app = express();

    app.get("/expected", () => {
      throw new AppError({
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: {
          fieldErrors: {
            email: ["Invalid email"],
          },
        },
        legacy: {
          errors: {
            email: ["Invalid email"],
          },
        },
      });
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    const response = await request(app).get("/expected");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toBeDefined();
    expect(response.body.errors).toEqual({
      email: ["Invalid email"],
    });
  });

  it("maps unexpected errors to safe internal responses", async () => {
    const app = express();

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {
      // no-op
    });

    app.get("/unexpected", () => {
      throw new Error("secret-token-123");
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    const response = await request(app).get("/unexpected");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Internal server error");
    expect(response.body.error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(JSON.stringify(response.body)).not.toContain("secret-token-123");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unexpected API error",
      expect.objectContaining({
        method: "GET",
        path: "/unexpected",
      }),
    );
  });

  it("returns standardized not-found errors for unknown routes", async () => {
    const app = express();

    app.use(notFoundHandler);
    app.use(errorHandler);

    const response = await request(app).get("/missing");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Resource not found");
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
