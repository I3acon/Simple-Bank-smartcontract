//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface Erc20 {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);
}

contract Bank {
    Erc20 public dai;
    uint256 public tvd;
    mapping(address => uint256) public balance;

    constructor(address _dai) {
        dai = Erc20(_dai);
    }

    function deposit(uint256 _amount) public {
        require(_amount > 0);
        dai.transferFrom(msg.sender, address(this), _amount);
        tvd += _amount;
        balance[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount) public {
        require(balance[msg.sender] >= _amount);
        dai.transfer(msg.sender, _amount);
        tvd -= _amount;
        balance[msg.sender] -= _amount;
    }

    function transfer(address _to, uint256 _amount) public {
        require(balance[msg.sender] >= _amount);
        balance[msg.sender] -= _amount;
        balance[_to] += _amount;
    }

    function returnBalance(address _account) public view returns (uint256) {
        return balance[_account];
    }

    function returnTVD() public view returns (uint256) {
        return tvd;
    }
}
