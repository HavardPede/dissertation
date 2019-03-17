export default function items(state = [], action){
    switch (action.type) {
        case 'CHANGE_ITEMS':
            return {
                ...state,
                items: []
            }
        default:
            return state
    }
}