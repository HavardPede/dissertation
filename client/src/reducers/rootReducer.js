import { combineReducers } from "redux";
import raritySelector from "./raritySelector";
import equipSelector from "./equipSelector";
import account from "./account";
import items from "./items";
import chosenItems from "./chosenItems";
import { drizzleReducers } from "drizzle";

//Import child-reducers
//..

export default combineReducers({
    account,
    raritySelector,
    equipSelector,
    items,
    chosenItems,
    ...drizzleReducers
});