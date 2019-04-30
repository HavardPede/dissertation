import React, { Component } from "react";
import { Navbar, Nav, NavItem, NavbarBrand, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import './Navbar.css';

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: Navbar
* Description: Universal navigation-bar component
*/

export default class Navb extends Component {
    render() {
        return (
            <div>
                <Navbar color="danger"  light expand="lg">
                    <NavbarBrand tag={Link} to="/" className="mr-auto brand text-white">CryptoWarrior</NavbarBrand>
                    <Nav className="ml-auto text-white main-nav nav" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/inventory" className="text-white nav-elem">INVENTORY</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/upgrade" className="text-white nav-elem">UPGRADE</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/auction-house" className="text-white nav-elem">AUCTION HOUSE</NavLink>
                        </NavItem>

                    </Nav>
                </Navbar>
            </div >
        )
    }
}