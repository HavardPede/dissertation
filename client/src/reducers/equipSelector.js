export default function equipSelector(state = "0", action){
    switch (action.type) {
        case 'UPDATE_EQUIP_SELECTOR':
            return action.payload
            
        default:
            return state
    }
}