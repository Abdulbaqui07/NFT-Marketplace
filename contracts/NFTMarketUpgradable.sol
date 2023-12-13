// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// Interface for ERC721 token
interface IERC721 {
    function safeTransferFrom(address from, address to, uint tokenId) external;
    function transferFrom(address, address, uint) external;
    function _safeMint(address to, uint256 tokenId) external;
}

contract NFTMarketplace is Initializable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {

    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);

    IERC721 public nft;
    uint public nftId;

    address payable public seller;
    uint public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    // Mapping to store bidder addresses for a specific NFT ID
    mapping(uint => address[]) public biddersForNftId;
    
    // Role for the NFT minter
    bytes32 public constant MINTER_ROLE = keccak256(abi.encodePacked(address(0xFbB28e9380B6657b4134329B47D9588aCfb8E33B)));

    // Modifier to restrict functions to the NFT minter
    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, _msgSender()), "Caller is not a minter");
        _;
    }

    // Modifier to restrict functions to the seller
    modifier onlySeller() {
        require(_msgSender() == seller, "Not the seller");
        _;
    }

    // Initialize function for upgradeable contract
    function initialize(address _nft, uint _nftId, uint _startingBid) initializer public {
        __NFTMarketplace_init(_nft, _nftId, _startingBid);
    }

    function __NFTMarketplace_init(address _nft, uint _nftId, uint _startingBid) internal initializer {
        __AccessControl_init();

        // Define roles before setting them up
        _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
        grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        grantRole(MINTER_ROLE, _msgSender());

        __ReentrancyGuard_init();

        nft = IERC721(_nft);
        nftId = _nftId;
        
        seller = payable(_msgSender());
        highestBid = _startingBid;
    }

    // Function for the seller to start the auction
    function start() external onlySeller {
        require(!started, "Auction already started");
        require(msg.sender == seller, "not seller");

        // Transfer the NFT to the marketplace contract
        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;
        endAt = block.timestamp + 7 days;

        emit Start();
    }

    // Function for bidders to place a bid
    function bid() external payable nonReentrant {
        require(started, "Auction not started");
        require(block.timestamp < endAt, "Auction ended");
        require(msg.value > highestBid, "Bid not higher than current highest bid (value < highest)");

        // Update bid information
        if (highestBidder != address(0)) {
            // bids[highestBidder] = bids[highestBidder].add(highestBid);
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
        biddersForNftId[nftId].push(msg.sender);

        emit Bid(msg.sender, msg.value);
    }
    
    // Function for bidders to withdraw their bid
    function withdraw() external nonReentrant {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: bal}("");
        require(success, "Transfer failed");
    
        emit Withdraw(msg.sender, bal);
    }

    // Function for the seller to end the auction
    function end() external onlySeller nonReentrant {
        require(started, "Auction not started");
        require(block.timestamp >= endAt, "Auction not ended");
        require(!ended, "Auction already ended");

        ended = true;

        // Transfer NFT and funds to the winner or return the NFT to the seller if no bids
        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            (bool success, ) = seller.call{value: highestBid}("");
            require(success, "Transfer failed");
        } else {
            nft.safeTransferFrom(address(this), seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }


    // Function to retrieve data of NFT(s) listed at a fixed price
    function getFixedPriceNFTs() external view returns (address, uint, uint) {
        return (seller, nftId, highestBid);
    }

    // Function to retrieve data of NFT(s) listed on an auction basis
    function getAuctionNFTs() external view returns (address, uint, uint, uint, bool) {
        return (seller, nftId, highestBid, endAt, started);
    }

    // Function to retrieve auction end time for a specific NFT ID
    function getAuctionEndTime() external view returns (uint) {
        return endAt;
    }

    // Function to retrieve wallet addresses of bidders for a specific NFT ID
    function getBiddersForNFT(uint _nftId) external view returns (address[] memory) {
        return biddersForNftId[_nftId];
    }

    // Function to mint ERC-721 NFTs (restricted to the minter role)
    function mint(address to, uint tokenId) external onlyMinter {
        // Using OpenZeppelin ERC721 mint function
        nft._safeMint(to, tokenId);
    }
}
