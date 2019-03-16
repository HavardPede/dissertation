export default function chosenItems(state = [-1, -1, -1], action){
    switch (action.type) {
        case 'UPDATE_CHOSEN_ITEMS':
            var buff = [...state]
            buff[action.payload.index] = action.payload.id
            return buff
        default:
            return state
    }
}