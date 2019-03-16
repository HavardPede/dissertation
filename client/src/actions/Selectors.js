export const setEquipSelector = (type) => {
    return ({
        type: 'UPDATE_EQUIP_SELECTOR',
        payload: type
    })
}
export const setRaritySelector = (rarity) => {
    return ({
        type: 'UPDATE_RARITY_SELECTOR',
        payload: rarity
    })
}