import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';


export default function configureStore() {

    const initialState = {
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