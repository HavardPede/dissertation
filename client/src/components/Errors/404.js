import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import "./Errors.css";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: error404
* Description: Page representing 404 error. Easily implementable for other errors.
*/
export default class error404 extends Component {
    render() {
        return (
            <div>
                <Navbar />
                <h3 id="error-title">ERROR 404. Page not found.</h3>
                <Footer/>
            </div>
        )
    }
}
