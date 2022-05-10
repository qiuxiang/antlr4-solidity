import { dirname, join } from "path";
import { getAbsoletePath, parse, defaultImporter } from "..";

const parseOptions = {
  basePath: join(__dirname, ".."),
  includePath: join(__dirname, "..", "node_modules"),
};

it("parse", async () => {
  const filename = "test/contracts/erc20.sol";
  const [, source] = defaultImporter(filename, parseOptions);
  const result = parse("test/contracts/erc20.sol", source, parseOptions);
  console.log(Object.keys(result.sources));
});

it("get absolute path", async () => {
  expect(getAbsoletePath("test/contracts/erc20.sol", parseOptions)).toBe(
    join(process.cwd(), "test/contracts/erc20.sol")
  );

  const openzeppelinERC20Path = "@openzeppelin/contracts/token/ERC20/ERC20.sol";
  const openzeppelinERC20AbsolutePath = getAbsoletePath(
    openzeppelinERC20Path,
    parseOptions
  );
  expect(openzeppelinERC20AbsolutePath).toBe(
    join(process.cwd(), "node_modules", openzeppelinERC20Path)
  );

  const openzeppelinERC20BasePath = dirname(openzeppelinERC20AbsolutePath);
  const ierc20Path = getAbsoletePath("./IERC20.sol", {
    basePath: openzeppelinERC20BasePath,
  });
  expect(ierc20Path).toBe(join(openzeppelinERC20BasePath, "IERC20.sol"));

  const utilsContextPath = getAbsoletePath("../../utils/Context.sol", {
    basePath: openzeppelinERC20BasePath,
  });
  expect(utilsContextPath).toBe(
    join(openzeppelinERC20BasePath, "../../utils/Context.sol")
  );
});
