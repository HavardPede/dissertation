import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Logged from "../../logged-in/logged-in";
import ItemGrid from "../../Item-grid/item-grid";
import Footer from "../../Footer/Footer"
import "./Home.css";


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
