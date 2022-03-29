import { readFile } from "fs/promises";
import { join } from "path";
import { parse } from "..";

it("parse", async () => {
  console.log("parse");
  parse(await getContract("erc20.sol"));
});

async function getContract(name: string) {
  const buffer = await readFile(
    join(__dirname, "..", "test", "contracts", name)
  );
  return buffer.toString();
}
