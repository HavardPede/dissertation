import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";

import "./Errors.css";


export default class Home extends Component {
    render() {
        return (
            <div>
                <Navbar />
                <h3 id="error-title">ERROR 404. Page not found.</h3>
            </div>
        )
    }
}
