import React, { Component } from "react";
import "./Button.css";
import { Link } from "react-router-dom";


/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: Button
* Description: Standard button component used all over interface
*/
export default class items extends Component {
    render() {
        return (
            <Link to={this.props.link}>
                <button type="button" className="standard-button">
                    {this.props.text}
                </button>
            </Link>
        )
    }
}
