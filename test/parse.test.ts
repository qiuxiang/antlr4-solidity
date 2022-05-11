import { dirname, join } from "path";
import { getAbsoletePath, parse, defaultImporter } from "..";

export const parseOptions = {
  basePath: join(__dirname, ".."),
  includePath: "node_modules",
};

it("parse", async () => {
  const filename = "test/contracts/erc20.sol";
  const [, content] = defaultImporter(filename, parseOptions);
  const result = parse("test/contracts/erc20.sol", content, parseOptions);
  console.log([{ result }]);
});

it("get absolute path", async () => {
  expect(getAbsoletePath("test/contracts/erc20.sol", parseOptions)).toBe(
    join(process.cwd(), "test/contracts/erc20.sol")
  );

  // with includePath
  const openzeppelinERC20Path = "@openzeppelin/contracts/token/ERC20/ERC20.sol";
  const openzeppelinERC20AbsolutePath = getAbsoletePath(
    openzeppelinERC20Path,
    parseOptions
  );
  expect(openzeppelinERC20AbsolutePath).toBe(
    join(process.cwd(), "node_modules", openzeppelinERC20Path)
  );

  // with includePath and relative filename
  const openzeppelinERC20BasePath = dirname(openzeppelinERC20AbsolutePath);
  const ierc20Path = getAbsoletePath("./IERC20.sol", {
    basePath: openzeppelinERC20BasePath,
  });
  expect(ierc20Path).toBe(join(openzeppelinERC20BasePath, "IERC20.sol"));

  // with includePath and relative filename
  const utilsContextPath = getAbsoletePath("../../utils/Context.sol", {
    basePath: openzeppelinERC20BasePath,
  });
  expect(utilsContextPath).toBe(
    join(openzeppelinERC20BasePath, "../../utils/Context.sol")
  );
});
