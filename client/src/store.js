import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import ItemList from "./utils/getItems";

//drizzle
import { generateContractsInitialState } from "drizzle";
import drizzleOptions from "./drizzleOptions";


export default function configureStore() {

    const initialState = {
        contracts: generateContractsInitialState(drizzleOptions),
        items: new ItemList().itemList,
        equipSelector: "0",
        raritySelector: "0",
        chosenItems: [-1, -1, -1]
    }

    const enhancers = applyMiddleware(thunk) && 
        (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    return createStore(
        rootReducer,
        initialState,
        enhancers
    );
}