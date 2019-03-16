import React, { Component } from "react";
import "./Loader.css";

export default class Loader extends Component {
    render() {
        return (
            <div id="main-loader">
                <img src={process.env.PUBLIC_URL + 'preloader.gif'} alt="loading gif"></img>
            </div>
        )
    }
}