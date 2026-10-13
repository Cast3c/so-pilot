import { describe, expect, it } from "vitest";
import { aggregatePostStatus } from "./post-status";

describe("aggregatePostStatus", () => {
  it("sin destinos es borrador", () => {
    expect(aggregatePostStatus([])).toBe("draft");
  });
  it("un destino programado", () => {
    expect(aggregatePostStatus(["scheduled"])).toBe("scheduled");
  });
  it("todos publicados", () => {
    expect(aggregatePostStatus(["published", "published"])).toBe("published");
  });
  it("todos fallidos", () => {
    expect(aggregatePostStatus(["failed", "failed"])).toBe("failed");
  });
  it("publicados y fallidos es parcial", () => {
    expect(aggregatePostStatus(["published", "failed"])).toBe("partial");
  });
  it("si alguno se está publicando, el post se está publicando", () => {
    expect(aggregatePostStatus(["publishing", "published"])).toBe("publishing");
  });
  it("si queda alguno programado, el post sigue programado", () => {
    expect(aggregatePostStatus(["scheduled", "published"])).toBe("scheduled");
  });
  it("todos cancelados", () => {
    expect(aggregatePostStatus(["cancelled", "cancelled"])).toBe("cancelled");
  });
  it("los cancelados no cuentan si hay otros", () => {
    expect(aggregatePostStatus(["cancelled", "published"])).toBe("published");
    expect(aggregatePostStatus(["cancelled", "failed"])).toBe("failed");
  });
});
