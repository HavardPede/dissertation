const ItemContract = artifacts.require("../contracts/ItemOwnerShip.sol");

contract("ItemContract", accounts => {

  it("Create an item and add it to the game", async () => {
    const instance = await ItemContract.deployed();

    let balanceBefore = await instance.balanceOf(accounts[1]);
    let itemsBefore = await instance.numberOfItems.call();

    await instance.createItem(4, 1, 50, 2, 2, accounts[1]);


    assert.equal(balanceBefore, await instance.balanceOf(accounts[1]) - 1, "Item was not added to balance of the user");
    assert.equal(itemsBefore, (await instance.numberOfItems.call()) - 1, "Didnt increment items in the game by 1")
    assert.equal(accounts[1], await instance.ownerOf(1), "Owner of item not set")
  });


  it("Should delete an item correctly", async () => {
    const instance = await ItemContract.deployed();
    
    let balanceBefore = await instance.balanceOf(accounts[1]);
    let itemsBefore = await instance.numberOfItems.call();

    await instance.deleteItem(accounts[1], 1);

    assert.equal(balanceBefore - 1, await instance.balanceOf(accounts[1]), "Item was not removed from balance of the user");
    assert.equal(itemsBefore - 1 , (await instance.numberOfItems.call()), "Didnt decrement items in the game by 1")
  })


  it("Should remove 3 items and add a new when upgrading a common item", async () => {
    const instance = await ItemContract.deployed();
    await instance.createItem(4, 1, 50, 2, 1, accounts[1]);
    await instance.createItem(4, 1, 50, 2, 1, accounts[1]);
    await instance.createItem(4, 1, 50, 2, 1, accounts[1]);

    let numberOfItemsBeforeUpgrade = await instance.numberOfItems.call();

    await instance.upgradeItems(accounts[1], 2, 3, 4);
    let numberOfItemsAfterUpgrade = await instance.numberOfItems.call();
    assert(
      numberOfItemsBeforeUpgrade - 2 == numberOfItemsAfterUpgrade,
      "Didnt upgrade items properly"
    );
  })

  it("Should upgrade an items stats properly", async () => {
    const instance = await ItemContract.deployed();
    await instance.createItem(4, 1, 50, 20, 1, accounts[1]);
    await instance.createItem(4, 1, 50, 20, 1, accounts[1]);
    await instance.createItem(4, 1, 50, 20, 1, accounts[1]);
    await instance.upgradeItems(accounts[1], 6, 7, 8);
    let item = await instance.getItemByID(accounts[1], 9);
    assert(item[3] == 120, "Didnt upgrade item-stats properly");
  })

  it("Should transfer ownership of item", async () => {
    const instance = await ItemContract.deployed();
    await instance.createItem(4, 1, 50, 20, 1, accounts[1]);
    let owner = await instance.ownerOf(10);
    await instance.transferOwnership(accounts[1], accounts[2], 10);
    let newOwner = await instance.ownerOf(10);
    assert(owner != newOwner && newOwner == accounts[2], "Didnt transfer item properly");
  })
});