import React, { Component } from "react";
import "./DisplayItem.css";
import { Container, Row, Col } from "reactstrap";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: DisplayItem
* Description: Displays an item within a box. Also shows a tooltip on hover.
*   Used on mulitple instances on interface
*/
class DisplayItem extends Component {
    constructor(props) {
        super(props);
        //Used to convert item.type from int to readable string
        this.type = ["Amulet", "Helmet", "Trinket", "Weapon", "Body", "Shield"];
    }
    render() {
        //Store items-array of accounts items, and the id of the displayed item
        let { items, itemID } = this.props;
        //Find item within items array
        let item = items.find(i => {
            return i.id === itemID;
        })
        return (
            //If item is defined, represent item-image within a div, and add tooltip on hover
            item !== undefined && (
                <div className={"displayed-item " + item.rarity}>
                    <img src={"./images/" + item.type + "/" + item.image + ".png"} alt={item.name} boxindex={this.props.boxindex} className={this.props.extraClassName}></img>
                    {/*Tooltip represented on hover*/}
                    <Container className="tooltip">
                        <Row>
                            <Col className="col-5">Type:</Col>
                            <Col >{this.type[item.type - 1]}</Col>
                        </Row>
                        <Row>
                            <Col className="col-5">Rarity:</Col>
                            <Col >{item.rarity}</Col>
                        </Row>
                        <Row>
                            <Col className="col-5">Stat1:</Col>
                            <Col >{item.stats[0]}</Col>
                        </Row>
                        <Row>
                            <Col className="col-5">Stat2:</Col>
                            <Col >{item.stats[1]}</Col>
                        </Row>
                    </Container>
                </div>
            )
        )
    }
}
export default DisplayItem;