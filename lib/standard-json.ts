import { ParseResult } from "./parse";

export function toInputJson(files: Record<string, ParseResult>) {
  return {
    language: "Solidity",
    sources: Object.fromEntries(
      Object.keys(files).map((i) => [i, { content: files[i].content }])
    ),
    settings: { outputSelection: { "*": { "": ["ast"] } } },
  };
}
