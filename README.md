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

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
