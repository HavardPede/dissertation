import React, { Component } from "react";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { Button, Tooltip, Container, Row, Col } from "reactstrap";
import "./AuctionHouseItems.css";

class AuctionHouseItems extends Component {
    constructor(props, context) {
        super(props)

        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;
        this.type = ["Amulet", "Helmet", "Trinket", "Weapon", "Body", "Shield"];

        this.passesFilter = this.passesFilter.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handlePresentItem = this.handlePresentItem.bind(this);
    }
    state = {
        itemSelected: -1,
    }

    //function for when you press an item
    handleItemSelect(e) {
        const id = e.target.id
        var selected;
        if (this.state.itemSelected === id) {
            selected = -1;
        } else {
            selected = id;
        }
        this.setState({ itemSelected: selected })
        this.props.onItemSelect(selected);
    };



    passesFilter(item) {
        let filter = this.props.filter;
        if(filter === undefined){
            return true;
        }
        else return false;
    }

    //Function to return an item image
    handlePresentItem(item) {
        return (
            <Container key={item.id} className={"auction-house-item " + item.rarity}>
                <Row>
                    <Col xs="3">
                    </Col>
                    <Col xs="5" className="auction-image">
                        <img src={"./images/" + item.type + "/" + item.image + ".png"} alt={item.name} id={item.id}></img>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-5 text-center">Stat1:</Col>
                    <Col className="text-center">{item.stats[0]}</Col>
                </Row>
                <Row>
                    <Col className="col-5 text-center">Stat2:</Col>
                    <Col className="text-center">{item.stats[1]}</Col>
                </Row>
                <Row className="auction-price-row">
                    <Col className="col-3 text-center">Price</Col>
                    <Col className="text-center">0.111 ETH</Col>
                </Row>
            </Container>
        )
    }


    render() {
        return (
            <div id="all-ah-items">
                {this.props.items.map((item) => (this.handlePresentItem(item)))}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        account: state.accounts[0],
        state: state.contracts.ItemOwnership
    }
}
AuctionHouseItems.contextTypes = {
    drizzle: PropTypes.object,
};
export default drizzleConnect(AuctionHouseItems, mapStateToProps);