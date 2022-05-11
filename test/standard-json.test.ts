import { defaultImporter, parse, toInputJson } from "..";
import { parseOptions } from "./parse.test";

it("standard json", async () => {
  const filename = "test/contracts/erc20.sol";
  const [_, content] = defaultImporter(filename, parseOptions);
  const json = toInputJson(parse(filename, content, parseOptions));
  console.log([json]);
  // require("fs/promises").writeFile("input.json", JSON.stringify(json));
});
