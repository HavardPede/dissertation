import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import "./item-grid.css";
import EquippedItem from "../EquippedItem/EquippedItem"

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: ItemGrid
* Description: Displays a grid of 6 boxes. This represents all equipped items
*   This is not in use, as described in essay. 
*   NB! TO IMPLEMENT TO STABLE VERSION, EquippedItem needs alterations
*/
export default class itemGrid extends Component {
    render() {
        return (
            <div id="box">
                <Container className="center cont">
                    <Row className="justify-content-around grid-row1">
                        <Col className="item-box" xs="7" lg="">
                            <EquippedItem type="amulet" />
                        </Col>
                        <Col className="item-box" xs="7" lg="">
                            <EquippedItem type="helmet" />
                        </Col>
                        <Col className="item-box" xs="7" lg="">
                            <EquippedItem type="trinket" />
                        </Col>
                    </Row>
                    <Row className="justify-content-around grid-row2">
                        <Col className="item-box" xs="7" lg="">
                            <EquippedItem type="weapon" />
                        </Col>
                        <Col className="item-box" xs="7" lg="">
                            <EquippedItem type="body" />
                        </Col>
                        <Col className="item-box" xs="7" lg="">
                            <EquippedItem type="shield" />
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
};
