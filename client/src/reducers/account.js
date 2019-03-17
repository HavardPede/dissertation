export default function account(state = "", action){
  switch (action.type) {
    case 'UPDATE_ACCOUNT':
      return action.payload
    default:
      return state
  }
}