import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import Items from "../../items/items";
import { Container, Row, Col } from "reactstrap";
import Grid from "../../Item-grid/item-grid";
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
                    <Row>
                        <Col xs="12" lg="7">
                            <Items showButton={true} onItemSelect={this.handleItemSelect} parentPage="inventory"  />
                            {this.state.ItemSelected !== "" && <button type="button" className="standard-button">
                                Equip/Unequip Item
                        </button>}
                        </Col>
                        <Col xs="5">
                            <h4 id="titleInventory">Equipment</h4>
                            <div id="equipment">
                                <Grid width="300px" />
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
    }
}
