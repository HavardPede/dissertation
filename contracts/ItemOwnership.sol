pragma solidity 0.5.0;
import "./ERC.sol";
import "./ItemContract.sol";


contract ERC165Implementation is ERC165 {
    constructor () public {
        //store that contract implements ERC165
        supportedInterfaces[bytes4(keccak256("supportsInterface(bytes4)"))] = true;
        
        //Store that te contract implements ERC721
        supportedInterfaces[
        bytes4(keccak256("balanceOf(address)")) ^
        bytes4(keccak256("ownerOf(uint256)")) ^
        bytes4(keccak256("safeTransferFrom(address,address,uint256,bytes")) ^
        bytes4(keccak256("safeTransferFrom(address,address,uint256")) ^
        bytes4(keccak256("transferFrom(address,address,uint256")) ^
        bytes4(keccak256("approve(address,uint256")) ^
        bytes4(keccak256("setApprovalForAll(address,bool")) ^
        bytes4(keccak256("getApproved(uint256")) ^
        bytes4(keccak256("isApprovedForAll(address,address)")) ^
        bytes4(keccak256("totalSupply()"))
        ] = true;
    }

    //mapping to store what interfaces are supported
    mapping (bytes4 => bool) internal supportedInterfaces;

    /// @notice Query if a contract implements an interface.
    /// @param interfaceID The interface identifier, as specified in ERC-165.
    /// @dev Interface identification is specified in ERC-165. This function
    ///  uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceID` and
    ///  `interfaceID` is not 0xffffffff, `false` otherwise.
    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
        return supportedInterfaces[interfaceID];
    }
}




///@title ItemOwnership is the contract that implements all ERC721 standards.
/// This means that the contract takes care of all that has to do with ownerships.
///@author Håvard Pedersen, B6056952.
///@dev This will implement and make use of
/// functions, events, and storages defined in its parent-contracts.
contract ItemOwnership is ERC721, ItemContract, ERC721TokenReceiver {
    address internal owner;
    constructor () public {
        owner = msg.sender;
        createItem(4, 1, 50, 2, 2, 0x940819A549A6A5f5E55dAb8d4C4d0C6c045FfFAf);
        createItem(4, 1, 50, 2, 2, 0x940819A549A6A5f5E55dAb8d4C4d0C6c045FfFAf);
        createItem(4, 1, 50, 2, 2, 0x940819A549A6A5f5E55dAb8d4C4d0C6c045FfFAf);
        createItem(4, 1, 50, 2, 2, 0x940819A549A6A5f5E55dAb8d4C4d0C6c045FfFAf);
    }





    /*** NAIVE METHODS ***/
     
    /// @notice Count all items assigned to an owner.
    /// @param _account An address for whom to query the balance.
    /// @return The number of items owned by `_owner`, possibly zero.
    function balanceOf(address _account) external view returns (uint) {
        return users[_account].items.length;
    }
    /// @notice Returns a map of map. This should be accessed as follows:
    /// [type][value], where type is weapon type, and value is either
    /// 0 (statIncrement for stat1), 1(statIncrement for stat2),
    /// 2 (Lowest roll for stat1), 3(Lowest roll for stat2).
    function getStatInformation() external view returns(uint8[4][6] memory) {
        return statInformation;
    }

    /// @notice Count items tracked by this contract.
    /// @return A count of valid items tracked by this contract, where each one of
    ///  them has an assigned and queryable owner not equal to the zero address.
    function totalSupply() external view returns (uint) {
        return numberOfItems;
    }

    /// @notice Find the owner of an item.
    /// @param _id The identifier for an item.
    /// @return The address of the owner of the item.
    function ownerOf(uint _id) external view returns (address) {
        return ownerOfItem[_id];
    }

    ///@dev this might seem like a redundant function, as we also have approve. 
    ///However, this is a naive, internal call. The other approve function is external,
    ///and checks all parameters. This is done to lower gasprice. 
    ///@notice does not trigger Approval event, as this will be done by the calling functions.
    function _approve(address _to, uint _id) internal {
        itemApprovals[_id] = _to;
    }

    ///@dev internal function to check if address is approved for an item.
    function isApprovedFor(address _user, uint _id) internal view returns (bool) {
        return itemApprovals[_id] == _user;
    }

    function itemIsInGame(uint _id) internal view returns (bool) {
        require(_id > 0 || _id <= ids, "Id is not valid");
        require(ownerOfItem[_id] != address(0), "Item is (no longer) in the game");
    }

    //From AddressUtils.sol library.
    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }
    /// @notice Handle the receipt of an NFT
    /// @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    function onERC721Received(
        address, 
        address, 
        uint256, 
        bytes calldata
    )external returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }    

    /*** SKEPTICAL METHODS ***/

    /// @notice Change or reaffirm the approved address for an item.
    /// @param _to The new approved item controller.
    /// @param _id The item to approve.
    function approve(address _to, uint _id) external payable {       
        //Make sure its a valid id
        itemIsInGame(_id);
        //check if caller has right to approve this item to an account
        address itemOwner = ownerOfItem[_id];
        require(
            itemOwner == msg.sender ||
            approvedForAll[owner][msg.sender], 
            "Must be owner or operator of the item"
        );
        
        //approve account
        _approve(_to, _id);
       
        //emit the event
        emit Approval(ownerOfItem[_id], _to, _id);
    }

    /// @notice Get the approved address for a single item.
    /// @param _id The item to find the approved address for.
    /// @return The approved address for this item, or the zero address if there is none.
    function getApproved(uint256 _id) external view returns (address) {
        //Make sure its a valid id
        itemIsInGame(_id);
        return itemApprovals[_id];
    }

    /// @notice Transfer ownership of an item -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING itemS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST.
    /// @param _from The current owner of the item.
    /// @param _to The new owner.
    /// @param _id The item to transfer.
    function transferFrom (
        address _from, 
        address _to,
        uint256 _id
    ) public payable {
        address itemOwner = ownerOfItem[_id];        
        //Make sure its a valid id
        itemIsInGame(_id);

        //Check if sender is authorized to transfer item
        require(
            isApprovedFor(msg.sender, _id) || 
            itemOwner == msg.sender ||
            approvedForAll[owner][msg.sender],
            "Does not have authority over that item"
        );
        //check if owner address matches owner parameter
        require(itemOwner == _from, "The item does not belong to that account");
        
        //call transfer function
        transferOwnership(_from, _to, _id);
    }
    
    /// @notice Transfers the ownership of an item from one address to another address.
    /// @param _from The current owner of the item.
    /// @param _to The new owner.
    /// @param _id The item to transfer.
    /// @param data Additional data with no specified format, sent in call to `_to`.
    function safeTransferFrom(address _from, address _to, uint256 _id, bytes calldata data) external payable {
        
        //call transfer function to do checks and transfer item
        transferFrom(_from, _to, _id);

        if (isContract(_to)) {
            ERC721TokenReceiver receiver = ERC721TokenReceiver(_to);
            require(
                receiver.onERC721Received(msg.sender, _from, _id, data) ==
                bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")),
                "Contracts don't implement the same standard"
            );
        }
    }

    /// @notice Transfers the ownership of an item from one address to another address.
    /// @param _from The current owner of the item.
    /// @param _to The new owner.
    /// @param _id The item to transfer.
    function safeTransferFrom(address _from, address _to, uint256 _id) external payable {
        this.safeTransferFrom(_from, _to, _id, "");
    }

    /// @notice Query if an address is an authorized operator for another address.
    /// @param _owner The address that owns the items.
    /// @param _operator The address that acts on behalf of the owner.
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise.
    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return approvedForAll[_owner][_operator];
    }
    
    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets.
    /// @param _operator Address to add to the set of authorized operators.
    /// @param _approved True if the operator is approved, false to revoke approval.
    function setApprovalForAll(address _operator, bool _approved) external {
        approvedForAll[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    ///@notice This function can be used to iterate through all items of a user,
    ///in combination with balanceOf(_owner). This is the only way to return all
    ///items an address owns.
    function getItemByIndex(address _owner, uint _index) external view 
    returns(
        uint id,
        uint equipmentType,
        uint16 img,
        uint16 stat1,
        uint16 stat2,
        uint8 rarity,
        address ownerAddress
    ) {
        User storage user = users[_owner];
        require(user.items.length >= _index, "Owner dont have that many items.");
        return getItem(_owner, _index);

    }
    ///@notice This function can be used to iterate through all items of a user,
    ///in combination with balanceOf(_owner). This is the only way to return all
    ///items an address owns.
    function getItemByID(address _owner, uint _id) external view 
    returns(
        uint id,
        uint equipmentType,
        uint16 img,
        uint16 stat1,
        uint16 stat2,
        uint8 rarity,
        address ownerAddress
    ) {
        itemIsInGame(_id);
        require(ownerOfItem[_id] == _owner, "Thats not the owner of the item");
        return getItem(_owner, users[_owner].indexOfItem[_id]);

    }
    
    function upgrade(address _owner, uint _id1, uint _id2, uint _id3) 
    external returns (uint) {
        User storage user = users[_owner];
        //check that items are all owned by the given address
        require(
            ownerOfItem[_id1] == ownerOfItem[_id2] &&
            ownerOfItem[_id1] == ownerOfItem[_id3] &&
            address(ownerOfItem[_id1]) == _owner,
            "All items are not owned by that address."
        );
        //Check that caller has authority over the account
        require(
            msg.sender == _owner ||
            approvedForAll[_owner][msg.sender],
            "You dont have the authority to do that."
        );
        //Check that items are not approved for trade
        require(
            itemApprovals[_id1] == itemApprovals[_id2] &&
            itemApprovals[_id1] == itemApprovals[_id3] &&
             itemApprovals[_id1] == address(0),
            "Items cant be approved for trade"
        );
        
        //check that items are of same rarity
        uint8 rarity = user.items[user.indexOfItem[_id1]].rarity;
        require(
            rarity == user.items[user.indexOfItem[_id2]].rarity &&
            rarity == user.items[user.indexOfItem[_id3]].rarity,
            "The items must be of same rarity"
        );        
        //check that items are not legendary
        require(
            rarity != 4,
            "The items must not be legendary"
        );
        //call upgrade
        return upgradeItems(_owner, _id1, _id2, _id3);
    }

}