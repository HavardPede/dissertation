export const updateUpgradeResult = (upgradeStatus, itemID) => {
    console.log("updating upgrade result:", upgradeStatus, itemID)
    return {
        type: "SET_UPGRADE_STATUS",
        payload: itemID
    };
};