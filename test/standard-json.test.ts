import { join } from "path";
import { defaultImporter, getStandardJsonInput } from "..";

const parseOptions = {
  basePath: join(__dirname, ".."),
  includePath: join(__dirname, "..", "node_modules"),
};

it("standard json", async () => {
  const [absolutePath, source] = defaultImporter(
    "test/contracts/erc20.sol",
    parseOptions
  );
  const result = getStandardJsonInput(absolutePath, source, parseOptions);
  console.log(result);
});
