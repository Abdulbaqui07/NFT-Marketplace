const hre = require("hardhat");

async function main() {

    // Grabbing the contract factory 
    const MyNFT = await ethers.getContractFactory("MyNFT");

    // Starting deployment, returning a promise that resolves to a contract object
    const nft = await MyNFT.deploy(); // Instance of the contract

    await nft.deployed();

    console.log("Contract deployed to address:", nft.address);
}

main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

