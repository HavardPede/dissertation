pragma solidity 0.5.0;

import "./ItemOwnership.sol";


contract AuctionHouse is ItemOwnership {


    /*** EVENTS ***/

    ///Fired when a new auction is created
    event AuctionCreated(uint256 id, uint128 price, uint64 expiration);
    ///@notice Fired when an auction is purchased
    event AuctionPurchased(uint256 id, uint256 price, address seller, address buyer);
    ///@notice fired when an auction is either cancelled, timed out or money from purhcase withdrawn
    ///cancelled if price == 0
    event AuctionEnded(uint256 id, uint256 price);







    /*** NAIVE METHODS ***/

    ///@dev used within auction-house item transfer. Removes item from auction-house
    ///and adds it to the an address
    function removeAuction(uint _id, address newOwner) internal {
        //store user-struct for reference
        User storage auctionOwner = users[ownerOfItem[_id]];
        //set bool onAuction to false
        auctionOwner.items[auctionOwner.indexOfItem[_id]].onAuction = false;

        //If item got a new owner, transfer ownership
        if (newOwner != ownerOfItem[_id]) {
            transferOwnership(ownerOfItem[_id], newOwner, _id);
        }
        //Store last auction to overwrite
        Auction memory lastAuction = auctions[auctions.length - 1];
        //Overwrite auction with last item and remove duplicate item
        auctions[auctionIndexes[_id]] = lastAuction;
        auctions.length--;
        //correct index-table
        auctionIndexes[lastAuction.id] = auctionIndexes[_id];
        delete auctionIndexes[_id];
    }


    ///@dev Removes the item from the owners array of items. However, he is still the owner,
    ///and as such will be displayed as the owner in OwnerOf.
    function addAuction(
        uint _id,
        uint256 _price,
        uint256 _duration,
        uint256 _startTime,
        address payable _seller
    ) internal {
        //Set onAuction of item to be true
        User storage itemOwner = users[ownerOfItem[_id]];
        itemOwner.items[itemOwner.indexOfItem[_id]].onAuction = true;

        //create auction struct
        Auction memory auction = Auction(
            _id,
            uint128(_price),  
            uint64(_duration),
            uint64(_startTime),
            _seller
        );

        //Struct added to array of items and index of struct stored
        auctionIndexes[_id] = auctions.push(auction) - 1;
        //emit event
        emit AuctionCreated(_id, uint128(_price), uint64(_duration));
    }





    /*** SKEPTICAL METHODS ***/

    ///@notice function to create a new auction. This removes the item from the users array of items.
    ///@param _id is the id of the item being put up for auction
    ///@param _price is the starting price of the auction.
    ///@param _duration is the time in seconds. Must be 86 400(24hr) or 172 800(48hr).
    ///@param _startTime is the time the auction started
    ///@param _seller is the address of the seller.
    function startAuction(
        uint _id,
        uint256 _price,
        uint256 _duration,
        address payable _seller
    ) external {
        require(ItemOwnership.itemIsInGame(_id), "item does not exist");
        require(
            msg.sender == ownerOfItem[_id] ||
            approvedForAll[ownerOfItem[_id]][msg.sender],
            "You don't have authority over that item"
        );
        require(!isOnAuction(_id), "Item is already on auction");
        require(itemApprovals[_id] == address(0), "Item is approved for someone else");
        require(
            _duration == 86400 ||
            _duration == 172800,
            "Time must be 24 or 48 hours"
        );

        //check that input doesnt overflow. The input-size for the values does not match struct-size
        //This is done purposely to allow for a return message if input-values are too high.
        require(_price == uint256(uint128(_price)), "Too high price");
        addAuction(        
            _id,
            _price,
            _duration,
            now,
            _seller
        );
    }

    ///@notice function to cancel an active auction.
    ///@param _id is the id of the item that is being cancelled
    function cancelAuction(uint _id) external {
        
        require(isOnAuction(_id), "Item is not on auction");
        
        require(
            msg.sender == ownerOfItem[_id] ||
            approvedForAll[ownerOfItem[_id]][msg.sender],
            "You don't have authority over that item"
        );
        //Store a pointer to the given auction
        Auction storage auction = auctions[auctionIndexes[_id]];
        require(auction.startTime + auction.expiration > now, "Auction is expired");
        
        //Call function to remove auction
        removeAuction(_id, ownerOfItem[_id]);
        //emit event that auction has been removed
        emit AuctionEnded(_id, 0);
    }


    ///@notice function to buy item that is on auction and transfer it to msg.sender
    ///@param _id is the id of the item being bought
    function purchaseAuction(uint _id) external payable {
        Auction storage auction = auctions[auctionIndexes[_id]];
        require(isOnAuction(_id), "That item is not on auction");
        require(auction.startTime + auction.expiration > now, "auction is expired");
        require(msg.sender != ownerOfItem[_id]);
        
        //Price payed must be same as expected
        require(msg.value == auction.price, "Wrong amount for payment of auction");

        //remove item from auctionhouse and transfer ownership
        removeAuction(_id, msg.sender);

        //We fend off re-entrancy attacks by transferring the item and taking it off the
        //auction house before transferring the currency.
        auction.seller.transfer(msg.value);
        //send out event
        emit AuctionPurchased(_id, auction.price, auction.seller, msg.sender);
    }

    function getAuctionByIndex(uint _index) public view returns (
        uint id,
        uint128 price, 
        address seller,
        bool ended
    ) {
        require(_index < auctions.length, "Index is too high");
        Auction storage auction = auctions[_index];

        id = auction.id;
        price = auction.price;
        seller = auction.seller;
        ended = (auction.startTime + auction.expiration) < now;
    }

    ///@notice function to get information about an auction. 
    ///@dev For displaying all auctions, this should be used in conjunction with getItemByID. 
    ///That way you can display the item alongside its auction info.
    ///@param _id item to get info about
    function getAuctionInfo(uint _id) external view returns (
        uint id,
        uint128 price, 
        address seller,
        bool ended
    ) {
        require(itemIsInGame(_id), "item does not exist");
        require(isOnAuction(_id), "Item is not on auction");
        return getAuctionByIndex(auctionIndexes[_id]);
    }

    ///@notice returns how many active auctions exist
    function numberOfAuctions() external view returns (uint) {
        return auctions.length;
    }

}