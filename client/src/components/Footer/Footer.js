import React, { Component } from "react";
import "./Footer.css";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: Footer
* Description: Universal footer-component
*/

export default class footer extends Component {
    render() {
        return (
            <footer className="page-footer font-small blue fixed-bottom">

                <div className="footer-copyright text-center py-3">© 2019 Copyright: Håvard Pedersen. All rights reserved.
                </div>

            </footer>
        )
    }
}

