const ItemContract = artifacts.require("../contracts/ItemOwnerShip.sol");

contract("ItemContract", accounts => {

  it("Create an item and add it to the game", async () => {
    const instance = await ItemContract.deployed();

    let balanceBefore = await instance.balanceOf(accounts[1]);
    let itemsBefore = await instance.numberOfItems.call();

    await instance.createItem(4001, 50, 2, 2, accounts[1]);


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


  it("Should upgrade an item properly", async () => {
    const instance = await ItemContract.deployed();
    await instance.createItem(4001, 50, 2, 2, accounts[1]);
    await instance.createItem(4001, 50, 2, 2, accounts[1]);
    await instance.createItem(4001, 50, 2, 2, accounts[1]);

    let numberOfItemsBeforeUpgrade = await instance.numberOfItems.call();
 
    await instance.upgradeItems(accounts[1], 2, 3, 4);
    let numberOfItemsAfterUpgrade = await instance.numberOfItems.call();
    assert.equal(numberOfItemsBeforeUpgrade - 2, numberOfItemsAfterUpgrade, "Didnt upgrade items properly");
})
});