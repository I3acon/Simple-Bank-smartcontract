import { expect } from "chai";
import { ethers } from "hardhat";
import console from "console";
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

//Init balance function
const balance = async () => {
  const balance = await daiContract.balanceOf(config.account0.address) / 1e18;
  const bankBalance = +await BankContract.returnBalance(config.account0.address)/1e18;
  const tvd = +await BankContract.returnTVD()/1e18;
  const recipientsWalletBalance = await daiContract.balanceOf(config.account1.address) / 1e18;
  const recipientsBankBalance = +await BankContract.returnBalance(config.account1.address)/1e18;
  console.log("Account 0 dai balance (Wallet):",balance);
  console.log("Account 0 dai balance (Bank):",bankBalance);
  console.log("Account 1 dai balance (Wallet):",recipientsWalletBalance);
  console.log("Account 1 dai balance (Bank):",recipientsBankBalance);
  console.log("Bank TVD:",tvd);
}

describe("Deposit Dai to contract", function () {
  it("Should deposit dai", async function () {
  console.log("\n Balance before deposit")
  await balance()
  await daiContract.approve(config.contracts.bank.address , ethers.utils.parseEther("1000"))
  await BankContract.deposit(ethers.utils.parseEther("1000"))
  console.log("\n Balance after deposit")
  await balance()
  });
});

describe("Transfer DAI ", function () {
  it("Should transfer dai", async function () {
  console.log("\n Balance before transfer")
  await balance()
  await BankContract.transfer(config.account1.address,ethers.utils.parseEther("100"))
  console.log("\n Balance after transfer")
  await balance()
  });
});

describe("Withdraw Dai from contract (Account 0)", function () {
  it("Should deposit dai", async function () {
  console.log("\n Balance before withdraw")
  await balance()
  await BankContract.withdraw(ethers.utils.parseEther("900"))
  console.log("\n Balance after withdraw")
  await balance()
  });
});

describe("Withdraw Dai from contract (Account 1)", function () {
  it("Should deposit dai", async function () {
  console.log("\n Balance before withdraw")
  await balance()
  await BankContractAct1.withdraw(ethers.utils.parseEther("100"))
  console.log("\n Balance after withdraw")
  await balance()
  });
});









