import { parse, ParseOptions } from "./parse";

export function getStandardJsonInput(
  sourcePath: string,
  source: string,
  options: ParseOptions
) {
  const { sources } = parse(sourcePath, source, options);
  return {
    language: "Solidity",
    sources: Object.fromEntries(
      Object.keys(sources).map((i) => [i, { content: sources[i] }])
    ),
    settings: { outputSelection: { "*": { "": ["ast"] } } },
  };
}
