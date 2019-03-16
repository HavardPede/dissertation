pragma solidity ^0.5.0;
import "./ERC.sol";
import "./ItemContract.sol";


contract ERC165Implementation is ERC165 {
    constructor () public {
        //store that contract implements ERC165
        supportedInterfaces[this.supportedInterfaces.selector] = true;
    }

    //mapping to store what interfaces are supported
    mapping (bytes4 => bool) internal supportedInterfaces;

    /// @notice Query if a contract implements an interface
    /// @param interfaceID The interface identifier, as specified in ERC-165
    /// @dev Interface identification is specified in ERC-165. This function
    ///  uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceID` and
    ///  `interfaceID` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
        return supportedInterfaces[interfaceID];
    }
}




///@title ItemOwnership is the contract that implements all ERC721 standards.
/// This means that the contract takes care of all that has to do with ownerships.
///@author Håvard Pedersen, B6056952
///@dev This will implement and make use of
/// functions, events, and storages defined in its parent-contracts.
contract ItemOwnership is ERC721, ERC165, ItemContract {
    address internal owner;
    constructor () public {
        owner = msg.sender;
    }

    /*** ERC IMPLEMENTATIONS ***/


    /*** NAIVE METHODS ***/
     
    /// @notice Count all NFTs assigned to an owner
    /// @param _owner An address for whom to query the balance
    /// @return The number of NFTs owned by `_owner`, possibly zero
    function balanceOf(address _account) external view returns (uint) {
        return users[_account].items.length;
    }

    /// @notice Count NFTs tracked by this contract
    /// @return A count of valid NFTs tracked by this contract, where each one of
    ///  them has an assigned and queryable owner not equal to the zero address
    function totalSupply() external view returns (uint) {
        return numberOfItems;
    }

    /// @notice Find the owner of an item
    /// @param _tokenId The identifier for an item
    /// @return The address of the owner of the item
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

    ///@dev internal function to check if address is approved for an item
    function isApprovedFor(address _user, uint _id) internal view returns (bool) {
        return itemApprovals[_id] == _user;
    }

    function itemIsInGame(uint _id) internal returns (bool) {
        require(_id > 0 || _id <= ids, "Id is not valid");
        require(ownerOfItem(_id) != 0, "Item is (no longer) in the game");
    }

    //From AddressUtils.sol library
    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }

    /*** SKEPTICAL METHODS ***/

    /// @notice Change or reaffirm the approved address for an NFT
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _to, uint _id) external payable {       
        //Make sure its a valid id
        itemIsInGame(_id);
        //check if caller has right to approve this item to an account
        address owner = ownerOfItem[_id];
        require(
            owner == msg.sender ||
            approvedForAll[owner][msg.sender], 
            "Must be owner or operator of the item"
        );
        
        //approve account
        _approve(_to, _id);
       
        //emit the event
        emit Approval(ownerOfItem[_id], _to, _id);
    }

    /// @notice Get the approved address for a single NFT
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _id) external view returns (address) {
        //Make sure its a valid id
        itemIsInGame(_id);
        return itemApprovals[_id];
    }

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(
        address _from, 
        address _to,
        uint256 _id
    ) public {
        address owner = ownerOfItem[_id];        
        //Make sure its a valid id
        itemIsInGame(_id);

        //Check if sender is authorized to transfer item
        require(
            isApprovedFor(msg.sender, _id) || 
            owner == msg.sender ||
            approvedForAll[owner][msg.sender],
            "Does not have authority over that item"
        );
        //check if owner address matches owner parameter
        require(owner == _from, "The item does not belong to that account");
        
        //call transfer function
        transferOwnership(_from, _to, _id);
    }
    
    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _id, bytes memory data) public {
        
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

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return approvedForAll[_owner][_operator];
    }
    
    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external {
        approvedForAll[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    ///@notice This function can be used to iterate through all items of a user,
    ///in combination with balanceOf(_owner). This is the only way to return all
    ///items an address owns
    ///@dev
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
        User memory user = users[_owner];
        require(user.items.length >= _index, "Owner dont have that many items.");
        return getItem(_owner, _index);

    }
    ///@notice This function can be used to iterate through all items of a user,
    ///in combination with balanceOf(_owner). This is the only way to return all
    ///items an address owns
    ///@dev
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
    external returns (uint _newId) {
        User memory user = users[_owner];
        //check that items are all owned by the given address
        require(
            ownerOfItem[_id1] == 
            ownerOfItem[_id2] == 
            ownerOfItem[_id3] == 
            _owner,
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
            itemApprovals[_id1] == 0 &&
            itemApprovals[_id2] == 0 &&
            itemApprovals[_id3] == 0,
            "Items cant be approved for trade"
        );
        
        //check that items are of same rarity
        require(
            user.items[user.indexOfItem[_id1]].rarity ==
            user.items[user.indexOfItem[_id2]].rarity == 
            user.items[user.indexOfItem[_id3]].rarity,
            "The items must be of same rarity"
        );        
        //check that items are not legendary
        require(
            user.items[user.indexOfItem[_id1]].rarity !=
            4,
            "The items must not be legendary"
        );
        //call upgrade
        upgradeItems(_owner, _id1, _id2, _id3);
    }

}