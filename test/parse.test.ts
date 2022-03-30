import { readFile } from "fs/promises";
import { join } from "path";
import { parse } from "..";

it("parse", async () => {
  const result = parse(await getContract("erc20.sol"), {
    basePath: join(__dirname, ".."),
    includePath: "node_modules",
  });
  console.log(result);
});

async function getContract(name: string) {
  const buffer = await readFile(
    join(__dirname, "..", "test", "contracts", name)
  );
  return buffer.toString();
}
