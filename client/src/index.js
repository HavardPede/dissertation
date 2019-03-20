import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
//Stylesheets
import './index.css';
import Loader from "./components/Loader/Loader";

//redux
import configureStore from "./store";
import drizzleOptions from "./drizzleOptions";
import { DrizzleProvider } from 'drizzle-react';
import {Drizzle} from "drizzle";

const drizzle = new Drizzle(drizzleOptions, configureStore());

ReactDOM.render(
    <DrizzleProvider drizzle={drizzle} options={drizzleOptions}>
        <Loader>
            <App />
        </Loader>
    </DrizzleProvider>, 
    document.getElementById('root'));