# NFT Marketplace

NFTMarketplace, is an Ethereum-based decentralized application (DApp) that facilitates the auction of non-fungible tokens (NFTs). NFTs are unique digital assets often representing ownership or proof of authenticity for digital or physical items.

## Contract Architecture

1. **Access Control**: Utilizes OpenZeppelin's AccessControlUpgradeable for managing roles and access control.

2. **ReentrancyGuard**: Prevents reentrant attacks using OpenZeppelin's ReentrancyGuardUpgradeable.

3. **Initialization**: The contract is initialized using the initialize function for upgradeability.

## Usage

1. **Minting NFTs**: The contract supports minting ERC-721 NFTs using the mint function, restricted to addresses with the minter role.

2. **Starting an Auction**: Sellers can start an auction by calling the start function, transferring the NFT to the contract.

3. **Placing Bids**: Bidders can place bids using the bid function, ensuring the bid is higher than the current highest bid.

4. **Withdrawing Bids**: Bidders can withdraw their bids using the withdraw function.

5. **Ending Auctions**: Sellers can end the auction using the end function, transferring the NFT to the highest bidder and funds to the seller.

6. **View Functions**: Various view functions provide information about the current state of the auction, including bid details, auction end time, and bidders' addresses.

## Upgradeability
This contract follows the OpenZeppelin Upgradeable Contracts pattern, allowing for future upgrades without disrupting existing functionalities. Ensure that upgradeable contracts are properly managed to avoid security risks.

## Helpers Overview

After forking repo type ```npm i``` in your terminal to install all the required packages.

## .env Setup

```shell
touch .env
```

Paste the below code in the .env file and update it with your specific keys.

```
API_URL = "https://eth-sepolia.g.alchemy.com/v2/<ALCHEMY_API_KEY>"
PRIVATE_KEY = "<METAMASK_PRIVATE_KEY>"
ETHERSCAN_API_KEY = "<ETHERSCAN_API_KEY>"
```

## Smart Contract 

### Compile
```shell
npx hardhat compile
```

### Deploy

#### MyNFT Contract
```shell
npx hardhat run scripts/deploy.js --network sepolia
```

#### NFTMarket Contract
```shell
npx hardhat run scripts/deployNFTMarket.js --network sepolia
```

#### NFTMarketUpgradable Contract
```shell
npx hardhat run scripts/deployNFTMarketUpgradable.js --network sepolia
```

### Verify on Etherscan

#### MyNFT Contract
```shell
npx hardhat verify --network sepolia <TOKEN_CONTRACT_ADDRESS>
```

#### NFTMarket Contract 
```shell
npx hardhat verify --network sepolia --constructor-args sc <arguments.js> <DEPLOYED_CONTRACT_ADDRESS>
```

#### NFTMarketUpgradable Contract 
```shell
npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS>
```

## Deployed and Verified on Sepolia testnet

- **MYNFT.sol**: [View MYNFT.sol on Etherscan](https://sepolia.etherscan.io/address/0x083c44b1b8337fa4e57Dc4835527Dc583bfEec49#code)

- **NFTMarket.sol**: ![View NFTMarket.sol on Etherscan](https://sepolia.etherscan.io/address/0x5020bf325420D6d2936C6110eccaD792f5a11ECE)

- **NFTMarketUpgrable.sol**: ![View NFTMarketUpgrable.sol on Etherscan](https://sepolia.etherscan.io/address/0x43B2408132a56D8094a11e4d9EDe6ff86CAD38fD#code)

## Hardhat helpers

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
