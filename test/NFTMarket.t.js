const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFTMarket', function () {
  let NFTMarket;
  let nftMarket;
  let MyNFT;
  let myNFT;
  let owner;
  let bidder;

  beforeEach(async function () {
    [owner, bidder] = await ethers.getSigners();

    // Deploy MyNFT contract
    MyNFT = await ethers.getContractFactory('MyNFT');
    myNFT = await MyNFT.connect(owner).deploy();
    await myNFT.waitForDeployment();

    // Deploy NFTMarket contract
    NFTMarket = await ethers.getContractFactory('NFTMarket');
    nftMarket = await NFTMarket.connect(owner).deploy(myNFT.address, 1, 10); // Replace with actual parameters
    await nftMarket.waitForDeployment();

    // Mint NFT
    await myNFT.connect(owner).mint(owner.address, 1);
  });

  it('should start and end auction', async function () {
    // Mint NFT
    await myNFT.connect(owner).mint(owner.address, 2);

    // Start auction
    await nftMarket.connect(owner).start();
    expect(await nftMarket.started()).to.be.true;

    // Bid on the auction
    const bidAmount = ethers.utils.parseEther('1');
    await nftMarket.connect(bidder).bid({ value: bidAmount });

    // End auction
    await nftMarket.connect(owner).end();
    expect(await nftMarket.ended()).to.be.true;
  });

  it('should withdraw bid', async function () {
    // Mint NFT
    await myNFT.connect(owner).mint(owner.address, 2);

    // Start auction
    await nftMarket.connect(owner).start();

    // Bid on the auction
    const bidAmount = ethers.utils.parseEther('1');
    await nftMarket.connect(bidder).bid({ value: bidAmount });

    // Withdraw bid
    const initialBalance = await ethers.provider.getBalance(bidder.address);
    await nftMarket.connect(bidder).withdraw();
    const finalBalance = await ethers.provider.getBalance(bidder.address);

    expect(finalBalance).to.be.above(initialBalance);
  });

  it('should retrieve auction information', async function () {
    // Mint NFT
    await myNFT.connect(owner).mint(owner.address, 2);

    // Start auction
    await nftMarket.connect(owner).start();

    // Bid on the auction
    const bidAmount = ethers.utils.parseEther('1');
    await nftMarket.connect(bidder).bid({ value: bidAmount });

    const auctionInfo = await nftMarket.getAuctionNFTs();
    expect(auctionInfo[0]).to.equal(owner.address); // Seller
    expect(auctionInfo[1]).to.equal(1); // NFT ID
    expect(auctionInfo[2]).to.equal(bidAmount); // Highest bid
    expect(auctionInfo[4]).to.be.true; // Auction started
  });
});
