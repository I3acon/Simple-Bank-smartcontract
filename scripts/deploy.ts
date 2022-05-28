
import { ethers } from "hardhat";
import config from "../config.json"
import hre from "hardhat";
import ERC20_ABI from "../constant/ERC20.json";

async function main() {

  const Bank = await ethers.getContractFactory("Bank");
  const bank = await Bank.deploy(config.contracts.dai.address);

  await bank.deployed();

  console.log("Bank Contract deployed to:", bank.address);

  //  await hre.network.provider.request({
  //   method: "hardhat_impersonateAccount",
  //   params: [config.rich.address],
  // });
  // const signer = await ethers.getSigner(config.rich.address);
  // const daiContract = new ethers.Contract(config.contracts.dai.address, ERC20_ABI, signer);

  // await daiContract.connect(signer).transfer(config.account0.address, ethers.utils.parseEther("1000"));
  // const accountBalance = await daiContract.balanceOf(config.account0.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
