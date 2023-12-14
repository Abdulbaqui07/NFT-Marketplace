const hre = require("hardhat");
const { toWei } = require("web3-utils");

async function main() {
    // Deploy MyNFT contract
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();
    await myNFT.waitForDeployment();

    console.log("MyNFT contract deployed to address:", myNFT.address);

    const mintToAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    const mintTokenId = 1;

    await myNFT.mint(mintToAddress, mintTokenId);
    console.log(`NFT with tokenId ${mintTokenId} minted to ${mintToAddress}`);

    // Grabbing the contract factory 
    const NFTMarket = await hre.ethers.getContractFactory("NFTMarketplace");

    // Starting deployment, returning a promise that resolves to a contract object
    const nftMarket = await NFTMarket.deploy();

    await nftMarket.waitForDeployment();

    console.log("NFTMarket contract deployed to address:", nftMarket.address);
}

main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });
