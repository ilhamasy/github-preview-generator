import { describe, it, expect } from "vitest";
import { parseGitHubRepo } from "../src/lib/parseRepo";

describe("parseGitHubRepo", () => {
  it("parses owner/repo slug correctly", () => {
    expect(parseGitHubRepo("ilhamasy/cleanyourtv-ps5-theme")).toEqual({
      owner: "ilhamasy",
      repo: "cleanyourtv-ps5-theme",
    });
  });

  it("parses full https URL", () => {
    expect(parseGitHubRepo("https://github.com/ilhamasy/cleanyourtv-ps5-theme")).toEqual({
      owner: "ilhamasy",
      repo: "cleanyourtv-ps5-theme",
    });
  });

  it("parses URL with trailing slash and .git extension", () => {
    expect(parseGitHubRepo("https://github.com/facebook/react.git/")).toEqual({
      owner: "facebook",
      repo: "react",
    });
  });

  it("parses URL with subpaths like /tree/main", () => {
    expect(parseGitHubRepo("https://github.com/vercel/next.js/tree/canary/examples")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("handles markdown links e.g. [text](https://github.com/owner/repo)", () => {
    expect(parseGitHubRepo("[link](https://github.com/tailwindlabs/tailwindcss)")).toEqual({
      owner: "tailwindlabs",
      repo: "tailwindcss",
    });
  });

  it("rejects non-github URLs", () => {
    expect(parseGitHubRepo("https://gitlab.com/owner/repo")).toBeNull();
    expect(parseGitHubRepo("https://google.com")).toBeNull();
  });

  it("rejects invalid inputs", () => {
    expect(parseGitHubRepo("")).toBeNull();
    expect(parseGitHubRepo("just-a-string")).toBeNull();
    expect(parseGitHubRepo("invalid/repo/name/with/extra/bad/chars!!")).toBeNull();
  });
});
