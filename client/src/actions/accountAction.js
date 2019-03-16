export const setAccount = (account) => {
    return ({
        type: 'UPDATE_ACCOUNT',
        payload: account
    })
}