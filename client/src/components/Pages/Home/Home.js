import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Logged from "../../logged-in/logged-in";
import ItemGrid from "../../Item-grid/item-grid";
import Footer from "../../Footer/Footer"
import "./Home.css";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: Home page
* Description: The simplistic home page, displaying only account address currently
*/

export default class Home extends Component {
    render() {
        return (
            <div>
                <Navbar />
                <div id="mainHome" className="center">
                    <Logged />
                    <div id="grid">
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}
