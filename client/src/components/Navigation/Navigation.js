import React, { Component, Children } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default class Navigation extends Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return (
            <div>
                <Navbar />
                    {Children.only(this.props.children)}
                <Footer />
            </div>
        );
    }
}