const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");

describe("NFTMarketUpgradable", () => {
  let owner;
  let seller;
  let bidder1;
  let bidder2;
  let nftMarketplace;
  let nft;

  beforeEach(async () => {
    [owner, seller, bidder1, bidder2] = await ethers.getSigners();

    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.initialize(owner.address, 1, 10);

    const MyNFT = await ethers.getContractFactory("MyNFT");
    nft = await MyNFT.deploy();
    await nft.mint(seller.address, 1);
  });

  it("should start and end an auction with a bid", async () => {
    // Start the auction
    await nftMarketplace.connect(seller).start();
    expect(await nftMarketplace.started()).to.be.true;

    // Bidder1 places a bid
    await expect(nftMarketplace.connect(bidder1).bid({ value: 15 }))
      .to.emit(nftMarketplace, "Bid")
      .withArgs(bidder1.address, 15);

    // Bidder2 places a higher bid
    await expect(nftMarketplace.connect(bidder2).bid({ value: 20 }))
      .to.emit(nftMarketplace, "Bid")
      .withArgs(bidder2.address, 20);

    // Bidder1 withdraws their bid
    await expect(nftMarketplace.connect(bidder1).withdraw())
      .to.emit(nftMarketplace, "Withdraw")
      .withArgs(bidder1.address, 15);

    // Seller ends the auction
    await expect(nftMarketplace.connect(seller).end())
      .to.emit(nftMarketplace, "End")
      .withArgs(bidder2.address, 20);

    // Check that the NFT is transferred to the highest bidder
    expect(await nft.ownerOf(1)).to.equal(bidder2.address);
  });

  it("should not allow non-seller to start the auction", async () => {
    await expect(nftMarketplace.connect(bidder1).start()).to.be.revertedWith(
      "Not the seller"
    );
  });

  it("should not allow non-seller to end the auction", async () => {
    await expect(nftMarketplace.connect(bidder1).end()).to.be.revertedWith(
      "Not the seller"
    );
  });

  it("should not allow bids after auction ends", async () => {
    await nftMarketplace.connect(seller).start();

    // Move time forward to make the auction end
    await waffle.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
    await waffle.provider.send("evm_mine");

    await expect(nftMarketplace.connect(bidder1).bid({ value: 15 })).to.be
      .reverted;
  });

  it("should not allow bid lower than current highest bid", async () => {
    await nftMarketplace.connect(seller).start();

    await expect(nftMarketplace.connect(bidder1).bid({ value: 5 })).to.be
      .reverted;
  });

  it("should not allow bid if auction is not started", async () => {
    await expect(nftMarketplace.connect(bidder1).bid({ value: 15 })).to.be
      .reverted;
  });
});
