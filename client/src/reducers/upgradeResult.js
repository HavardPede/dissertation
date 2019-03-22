export default function upgradeResult(state = [], action){
    switch (action.type) {
        case "SET_UPGRADE_STATUS":
            return action.payload
    }
}