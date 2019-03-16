export const chosenItems = (index, id) => {
    return ({
        type: 'UPDATE_CHOSEN_ITEMS',
        payload: {
            index: index,
            id: id
        }
    })
}