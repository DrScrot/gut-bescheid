import { describe, expect, it } from "vitest";
import * as regelwerk from "../src/index";

describe("Platzhalter", () => {
  it("lädt das Regelwerk-Paket", () => {
    expect(regelwerk).toBeTypeOf("object");
  });
});
