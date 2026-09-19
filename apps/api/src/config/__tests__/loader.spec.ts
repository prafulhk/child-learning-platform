import { describe, it, expect, beforeEach } from "vitest";

describe("config loader", () => {
  beforeEach(() => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
  });

  it("loads valid NODE_ENV and PORT", async () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "4000";

    const loader = await import("../loader.js");
    const cfg = loader.loadConfig();

    expect(cfg.NODE_ENV).toBe("development");
    expect(cfg.PORT).toBe(4000);
  });

  it("defaults PORT to 3000 when missing", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.PORT;

    const loader = await import("../loader.js");
    const cfg = loader.loadConfig();

    expect(cfg.PORT).toBe(3000);
  });

  it("fails on invalid NODE_ENV", async () => {
    process.env.NODE_ENV = "invalid-env";
    process.env.PORT = "3000";

    const loader = await import("../loader.js");

    expect(() => loader.loadConfig()).toThrow(/NODE_ENV/);
  });

  it("fails on non-numeric PORT", async () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "abc";

    const loader = await import("../loader.js");

    expect(() => loader.loadConfig()).toThrow(/PORT/);
  });

  it("fails on negative PORT", async () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "-1";

    const loader = await import("../loader.js");

    expect(() => loader.loadConfig()).toThrow(/PORT/);
  });

  it("fails on PORT zero", async () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "0";

    const loader = await import("../loader.js");

    expect(() => loader.loadConfig()).toThrow(/PORT/);
  });

  it("fails on PORT out of range (> 65535)", async () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "70000";

    const loader = await import("../loader.js");

    expect(() => loader.loadConfig()).toThrow(/PORT/);
  });

  it("fails on fractional PORT", async () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "30.5";

    const loader = await import("../loader.js");

    expect(() => loader.loadConfig()).toThrow(/PORT/);
  });

  it("error messages do not expose raw invalid values", async () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "not-a-port";

    const loader = await import("../loader.js");

    let errorMessage = "";
    try {
      loader.loadConfig();
    } catch (err) {
      errorMessage = (err as Error).message;
    }

    expect(errorMessage).not.toContain("not-a-port");
    expect(errorMessage).toContain("PORT");
  });
});
