import { dirname, join } from "path";
import { getPath, parse } from "..";

const parseOptions = {
  basePath: join(__dirname, ".."),
  includePath: join(__dirname, "..", "node_modules"),
};

it("parse", async () => {
  const result = parse("test/contracts/erc20.sol", parseOptions);
  console.log(Object.keys(result.sources));
});

it("getPath", async () => {
  expect(getPath("test/contracts/erc20.sol", parseOptions)).toBe(
    join(process.cwd(), "test/contracts/erc20.sol")
  );

  const openzeppelinERC20Path = "@openzeppelin/contracts/token/ERC20/ERC20.sol";
  const openzeppelinERC20AbsolutePath = getPath(
    openzeppelinERC20Path,
    parseOptions
  );
  expect(openzeppelinERC20AbsolutePath).toBe(
    join(process.cwd(), "node_modules", openzeppelinERC20Path)
  );

  const openzeppelinERC20BasePath = dirname(openzeppelinERC20AbsolutePath);
  const ierc20Path = getPath("./IERC20.sol", {
    basePath: openzeppelinERC20BasePath,
  });
  expect(ierc20Path).toBe(join(openzeppelinERC20BasePath, "IERC20.sol"));

  const utilsContextPath = getPath("../../utils/Context.sol", {
    basePath: openzeppelinERC20BasePath,
  });
  expect(utilsContextPath).toBe(
    join(openzeppelinERC20BasePath, "../../utils/Context.sol")
  );
});
