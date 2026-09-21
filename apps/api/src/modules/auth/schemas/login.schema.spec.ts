import { describe, expect, it } from "vitest";

import { loginSchema } from "./login.schema.js";

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "hridhaan@test.com",
      password: "Pradhaani@1",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "Password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "parent@test.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});
