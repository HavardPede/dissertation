const ItemContract = artifacts.require("../contracts/ItemOwnerShip.sol");
contract("ItemContract", accounts => { //pass in the contract and the accounts

    //Start of test 
    it("should start with a contract without items", async () => {
        const instance = await ItemContract.deployed();
        assert.equal(0, await instance.totalSupply()); //Determines if test passes or fails
    });
});
