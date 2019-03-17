pragma solidity 0.5.0;

import "./ERC.sol";


/// @title ItemBase contract. Holds all types and events
///@author Håvard Pedersen, B6056952
contract ItemContract is ERC721 {


     /*** EVENTS ***/

    ///@notice mintEvent is called whenever a new item is created. This includes createItem or 
    /// upgradeItem.
    event MintItem(address owner, uint id, uint equipmentType, uint16 img, uint16[2] stats, uint8 rarity);
        
    /// @notice This emits when ownership of any item changes by any mechanism.
    ///  This event emits when items are created (`from` == 0) and destroyed
    ///  (`to` == 0).
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    /// @notice This emits when the approved address for an item is changed or
    ///  reaffirmed. The zero address indicates there is no approved address.
    ///  When a Transfer event emits, this also indicates that the approved
    ///  address for that item (if any) is reset to none.
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    /// @notice This emits when an operator is enabled or disabled for an owner.
    ///  The operator can manage all items of the owner.
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);




    /*** CONSTANTS ***/

    ///@dev Information about each stat. the first two values are increments for 
    ///Stat 1 and 2, the last two values are base rolls for stat 1 and two
    uint8[4][6] internal statInformation = [
        [50, 15, 100, 30], //Amulet
        [50, 5, 150, 10],  //Helmet
        [5, 15, 10, 30],  //Talisman
        [70, 15, 50, 20], //Weapon 
        [150, 8, 200, 20],  //Armor
        [100, 10, 250, 35]  //Shield
    ];





    /*** TYPES ***/

    ///@dev The struct for the item token. Each item is an instance of this struct.
    struct Item {
        uint id;
        uint equipmentType; 
        uint16 img;
        uint16[2] stats;
        uint8 rarity; //1-4 => common, rare, epic, legendary      
        /*
        type:
        001 - amulet
        002 - helmet
        003 - talisman
        004 - weapon
        005 - body 
        006 - shield
        */
    }

    ///@dev The user struct. Stores Users items an a map of items to index
    struct User {
        Item[] items;
        mapping(uint => uint) indexOfItem;
    }   





    /*** STORAGE ***/

    ///@dev stores current highest id of item
    uint public ids; 
    
    ///@notice store current amount of items
    uint public numberOfItems;
    

    ///@dev Maps an account address to a user-struct for that user
    mapping(address => User) internal users; 


    ///@dev maps item id to its owner
    ///@notice in a later iteration of the game, this might be changed to external to save gas
    mapping(uint => address) internal ownerOfItem;


    ///@notice stores which account address an item is approved for
    mapping(uint => address) public itemApprovals;

    ///@dev Maps an account, say account 1, to a nested map of accounts. 
    ///This nested map stores a bool per account address.
    ///The bool represents if that account has authorization to control 
    ///all of tokens linked to account1
    mapping (address => mapping (address => bool)) internal approvedForAll;



    /*** Functions ***/

    ///@dev Function to return an item given a user and the index of the item
    ///@param _index Id of the item in question
    ///@return returns an array of the stats of the item
    ///@return [id, img, stats1, stats2, rarity]
    function getItem(address _owner, uint _index) internal view
    returns (
        uint id,
        uint equipmentType,
        uint16 img,
        uint16 stat1,
        uint16 stat2,
        uint8 rarity,
        address owner
    ) {
        Item storage item = users[_owner].items[_index];
        id = item.id;
        equipmentType = item.equipmentType;
        img = item.img;
        stat1 = item.stats[0];
        stat2 = item.stats[1];
        rarity = item.rarity;
        owner = _owner;
    }

    function transferOwnership(address _from, address _to, uint _id) internal {
        //Store item locally
        Item storage item = users[_from].items[users[_from].indexOfItem[_id]];
        require(users[_from].items.length > 0, "Account must have items to transfer from");
        //remove item from users list of items
        if (users[_from].items.length > 1) {
            users[_from].items[users[_from].indexOfItem[_id]] = users[_from].items[users[_from].items.length-1];
            users[_from].indexOfItem[_id] = users[_from].indexOfItem[_id];
        }
        users[_from].items.length--;

        //Push item onto owners list of items and store the index to the item
        users[_to].indexOfItem[ids] = users[_to].items.push(item) - 1;

        //Set owner of item
        ownerOfItem[ids] = _to;

        //remove approvals for this item
        if (itemApprovals[_id] != address(0x0)) {
            delete itemApprovals[_id];
        }

        //Emit transfer event
        emit Transfer(_from, _to, _id);
    }

    ///@dev Function to mint a new item, store it in the owners array and send out events.
    ///@param _img the int that stores both item type and logic for what image to use.
    ///@param _stat1 as stat2.
    ///@param _stat2 these two are the stats of the items, where they should be assigned to
    /// stat[] as follows: [_stat1, _stat2].
    ///@param _rarity the rarity of the new item
    ///@param _owner the address of the lucky owner of this newly minted item
    ///@return returns the id of the new item
    function createItem(
        uint _equipmentType,
        uint16 _img,
        uint16 _stat1, 
        uint16 _stat2, 
        uint8 _rarity,
        address _owner
    ) public returns (uint) {
        //Increment highest id in game. 
        //This will be the id of the new item
        ids++;
        
        //Locally store an item-struct with the given params
        Item memory item = Item(ids, _equipmentType, _img, [_stat1, _stat2], _rarity);

        //Push item onto owners list of items and store the index to the item
        users[_owner].indexOfItem[ids] = users[_owner].items.push(item) - 1;

        //Set owner of item
        ownerOfItem[ids] = _owner;

        //Increment how many items currently exists
        numberOfItems++;

        //Emit mintItem-event to let listeners know new item was created
        emit MintItem(
            _owner,
            ids,
            _equipmentType,
            _img,
            [_stat1, _stat2],
            _rarity
        );
        //emit transfer event
        emit Transfer(address(0), _owner, ids);
        return ids;
    }

    ///@dev This function is used to remove an item from the game
    ///@param _owner this is not strickly necessary, as owner could easily be found.
    /// But passing it as a parameter adds an extra level of security to such a dire function.
    function deleteItem(address _owner, uint _id) public {
        //Check that the address given owns the item
        require(ownerOfItem[_id] == _owner, "That user dont own the item");
        require(users[_owner].items.length > 0, "Account must have items to remove fron");

        //remove item from users list of items
        if (users[_owner].items.length > 1) {
            Item storage lastItem = users[_owner].items[users[_owner].items.length-1];
            users[_owner].items[users[_owner].indexOfItem[_id]] = lastItem;
            users[_owner].indexOfItem[lastItem.id] = users[_owner].indexOfItem[_id];
        }
        users[_owner].items.length--;

        //remove item from list of item-indexes
        delete users[_owner].indexOfItem[_id];
        
        //Remove map-element in ownerOfItem
        delete ownerOfItem[_id];
        
        //Let it be known that an item has been removed
        numberOfItems--;

        //Emit tranfser event
        emit Transfer(_owner, address(0), _id);
    }

    ///@dev this is the function called when upgrading items
    function upgradeItems
    (
        address _account, 
        uint _id1, 
        uint _id2, 
        uint _id3
    ) public returns (uint _newID) {
        uint rarity = users[_account].items[users[_account].indexOfItem[_id1]].rarity;
        uint random = uint(keccak256(abi.encodePacked(now, msg.sender, ids)));
    
        //Choose which item base to potentially upgrade
        uint chosenID = random % 3;
        if (chosenID == 0) {
            chosenID = _id1;
        }else if (chosenID == 1) {
            chosenID = _id2;
        }else {
            chosenID = _id3;
        }
        Item memory itemBeingUpgraded = users[_account].items[users[_account].indexOfItem[chosenID]];
    
        //Burn the items given for the upgrade
        deleteItem(_account, _id1);
        deleteItem(_account, _id2);
        deleteItem(_account, _id3);

        //Compute if new item will be minted
        bool upgrade = false;
        if (rarity == 1) {
            upgrade = true;
        }else if (rarity == 2 && (random % 100 > 19)) {
            upgrade = true;
        }else if (rarity == 3 && (random % 100 > 49)) {
            upgrade = true;
        }
        if (upgrade) {
            //Mint new item, based on selected item base
            _newID = createItem(
                itemBeingUpgraded.equipmentType,            
                itemBeingUpgraded.img,
                itemBeingUpgraded.stats[0] + statInformation[itemBeingUpgraded.equipmentType - 1][0],
                itemBeingUpgraded.stats[1] + statInformation[itemBeingUpgraded.equipmentType - 1][1], 
                itemBeingUpgraded.rarity + 1,
                _account
            );

        } else {
            _newID = 0;
        }
        _newID = 0;
    }
}