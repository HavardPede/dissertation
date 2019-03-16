export default function raritySelector(state = "0", action){
    switch (action.type) {
        case 'UPDATE_RARITY_SELECTOR':
            return action.payload
        default:
            return state
    }
}