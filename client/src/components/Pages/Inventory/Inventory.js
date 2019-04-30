import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import Items from "../../items/items";
import { Container, Row, Col } from "reactstrap";
import "./inventory.css";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: Invetory page
* Description: Displays all items owned by the user
*/

export default class Inventory extends Component {
    constructor(props) {
        super(props);
        //Bind functions
        this.handleItemSelect = this.handleItemSelect.bind(this);
    }
    //Set initial state
    state = {
        ItemSelected: ""
    }
    //Item selected in modal
    handleItemSelect(itemSelected) {
        var buff = "";
        if (this.state.ItemSelected !== itemSelected) {
            buff = itemSelected
        }
        this.setState({ ItemSelected: buff });
    }

    //Display invetory-box
    render() {
        return (
            <div>
                <Navbar />
                <Container className="mainInventory">
                    <Row className="text-center">
                        <Col xs="1"> 
                        </Col>
                        <Col xs="10">
                            <Items 
                                onItemSelect={this.handleItemSelect} 
                                items={this.props.items} 
                                parentPage="inventory"
                                chosenItems={[]}  
                                />
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
    }
}
