const ItemContract = artifacts.require("../contracts/ItemOwnerShip.sol");
contract("ItemContract", accounts => {

    it("Should not allow transfer of item before approval", async () => {
        const instance = await ItemContract.deployed();
        await instance.createItem(4, 1, 50, 20, 1, accounts[1]);
        let err = null;
        try{
            await instance.transferFrom(accounts[1], accounts[0], 1);
        } catch(error) {
            err = error;
        }
        assert.ok(err instanceof Error);
        
        await instance.approve(accounts[0], 1, { from: accounts[1] });
        await instance.transferFrom(accounts[1], accounts[0], 1);
    });


    
    it("Should not upgrade before 3 items of the owners are selected", async () => {
        const instance = await ItemContract.deployed();
        try{
            await instance.upgrade(accounts[0], 1, 2, 3);
        } catch(error) {
            err = error;
        }
        assert.ok(err instanceof Error);
        await instance.createItem(4, 1, 50, 20, 1, accounts[0]);
        await instance.createItem(4, 1, 50, 20, 1, accounts[0]);
        await instance.upgrade(accounts[0], 1, 2, 3);
        assert(await instance.balanceOf(accounts[0]) == 1, "Upgrade failed");
    }); 
}); 