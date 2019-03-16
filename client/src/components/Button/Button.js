import React, { Component } from "react";
import "./Button.css";
import { Link } from "react-router-dom";


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
