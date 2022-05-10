// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./a.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  constructor() ERC20("T", "T") {
    _mint(address(this), 1e3**decimals());
  }
}
