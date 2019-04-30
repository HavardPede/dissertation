
const AuctionHouse = artifacts.require("../contracts/AuctionHouse.sol");

contract("AuctionHouse", accounts => {

  it("Should create an auction", async () => {
    const instance = await AuctionHouse.deployed();
    await instance.createItem(4, 1, 50, 2, 2, accounts[0]);
    await instance.startAuction(1, 10, 86400, accounts[0]);
    let auctionNumber = await instance.numberOfAuctions();
    assert.equal(auctionNumber, 1, "There is not added specifically 1 auction");
  });

  it("Should cancel auction", async () => {
    const instance = await AuctionHouse.deployed();
    let numberOfAuctionsBefore = await instance.numberOfAuctions();
    await instance.cancelAuction(1);
    assert.equal(await instance.numberOfAuctions(), numberOfAuctionsBefore - 1, "Did not remove 1 auction");
  })
  it("Should allow a user to buy an auction", async () => {
    const instance = await AuctionHouse.deployed();
    await instance.createItem(4, 1, 50, 2, 2, accounts[0]);
    await instance.startAuction(2, 1000, 86400, accounts[0]);
    await instance.createItem(4, 1, 50, 2, 2, accounts[0]);
    await instance.startAuction(3, 1000, 86400, accounts[0]);
    await instance.purchaseAuction.sendTransaction(2, accounts[1], {from: accounts[1]});
    
    assert.equal(1, await instance.balanceOf(accounts[1]), "Did not remove 1 auction");
  })

  it("should set correct owner of item when auction is purchased", async () => {
    const instance = await AuctionHouse.deployed();
    assert.equal(accounts[1], await instance.ownerOf(2), "New owner is not set");
  })

});