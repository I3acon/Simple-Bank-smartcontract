import { expect } from "chai";
import { ethers } from "hardhat";
import console, { assert } from "console";
import ERC20_ABI from "../constant/ERC20.json";
import Bank_ABI from "../artifacts/contracts/Bank.sol/Bank.json";
import config from "../config.json";

//Init Provider
const provider = new ethers.providers.JsonRpcProvider(config.rpc.url);

//Init Account
const wallet = new ethers.Wallet(config.account0.privatekey, provider);
const wallet1 = new ethers.Wallet(config.account1.privatekey, provider);

//Init Contract
const BankContract = new ethers.Contract(
  config.contracts.bank.address,
  Bank_ABI.abi,
  wallet
);

const BankContractAct1 = new ethers.Contract(
  config.contracts.bank.address,
  Bank_ABI.abi,
  wallet1
);

const daiContract = new ethers.Contract(
  config.contracts.dai.address,
  ERC20_ABI,
  wallet
);


//Happy Situation

describe("Deposit Dai to contract", function () {
  it("Should deposit dai", async function () {
  await daiContract.approve(config.contracts.bank.address , ethers.utils.parseEther("1000"))
  await BankContract.deposit(ethers.utils.parseEther("1000"))
  const result = await BankContract.returnBalance(config.account0.address)/1e18;
  expect(result).to.be.equal(1000);
  });
});

describe("Transfer DAI ", function () {
  it("Should transfer dai from account 0 to account 1", async function () {
  await BankContract.transfer(config.account1.address,ethers.utils.parseEther("100"))
  const result = await BankContract.returnBalance(config.account0.address)/1e18;
  expect(result).to.be.equal(900);
  const result1 = await BankContract.returnBalance(config.account1.address)/1e18;
  expect(result1).to.be.equal(100);
  });
});

describe("Withdraw Dai from contract (Account 0)", function () {
  it("Should Withdraw dai from account 0", async function () {
  await BankContract.withdraw(ethers.utils.parseEther("900"))
  const result = await BankContract.returnBalance(config.account0.address)/1e18;
  expect(result).to.be.equal(0);
  });
});

describe("Withdraw Dai from contract (Account 1)", function () {
  it("Should Withdraw dai from account 1", async function () {
  await BankContractAct1.withdraw(ethers.utils.parseEther("100"))
  const result = await BankContract.returnBalance(config.account1.address)/1e18;
  expect(result).to.be.equal(0);
  });
});

//Unhappy Situation

describe("Deposit Dai to contract", function () {
  it("Should not deposit dai", async function () {
  await daiContract.approve(config.contracts.bank.address , ethers.utils.parseEther("100000000"))
  await expect(BankContract.deposit(ethers.utils.parseEther("100000000"))).to.be.reverted;
  });
});

describe("Transfer DAI ", function () {
  it("Should not transfer dai from account 0 to account 1", async function () {
  await expect(BankContract.transfer(config.account1.address,ethers.utils.parseEther("100000000"))).to.be.reverted;
  });
});

describe("Withdraw Dai from contract (Account 0)", function () {
  it("Should not Withdraw dai from account 0", async function () {
    await expect(BankContract.withdraw(ethers.utils.parseEther("100000000"))).to.be.reverted;
  });
});







