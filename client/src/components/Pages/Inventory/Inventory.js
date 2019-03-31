import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import Items from "../../items/items";
import { Container, Row, Col } from "reactstrap";
import "./inventory.css";




export default class Inventory extends Component {
    constructor(props) {
        super(props);

        this.handleItemSelect = this.handleItemSelect.bind(this);
    }
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
                            {this.state.ItemSelected !== "" && <button type="button" className="standard-button">
                                Equip/Unequip Item
                        </button>}
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
    }
}
