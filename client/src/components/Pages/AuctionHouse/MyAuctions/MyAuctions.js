import React, { Component } from "react";
import { Modal, Container, Row, Col, ModalHeader, ModalBody, Button, } from "reactstrap";
import "./MyAuctions.css";
import DisplayItem from "../../../DisplayItem/DisplayItem";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: MyAuctions
* Description: Modal to represent all auctions owned by the user
*/

class myAuctions extends Component {
    constructor(props, context) {
        super(props);
        //Fetch Drizzle
        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;
        //Bind functions
        this.handleDisplayAuction = this.handleDisplayAuction.bind(this);
        this.handleCancelAuction = this.handleCancelAuction.bind(this);
    }
    //Function to display a given auction
    handleDisplayAuction(auction) {
        return (
            <Container key={"myAuction" + auction.id}>
                <Row className="my-auctions-row align-middle">
                    <Col>
                        <div className="my-auctions-item" >    
                            <DisplayItem items={this.props.items} itemID={auction.id}></DisplayItem>
                        </div>
                    </Col>
                    <Col className="col-7 my-auctions-button-col">
                        {auction.ended ?
                            <Button className="standard-button"  id={auction.id} onClick={this.handleCancelAuction}>Cancel</Button> :
                            <Button className="standard-button" id={auction.id} onClick={this.handleCancelAuction}>Cancel</Button>
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
    //Function used to cancel an auction on the blockchain
    handleCancelAuction(e) {
        console.log(e.target.id)
        this.contracts.AuctionHouse.methods.cancelAuction.cacheSend(e.target.id);
        this.props.toggleClose();
    }

    render() {
        //Store all users auctions in two arrays, active and ended auctions.
        let activeAuctions = [];
        let endedAuctions = this.props.auctions.filter(auction => {
            if (auction.ended) {
                return auction;
            } else {
                activeAuctions.push(auction);
            }
        });
        //Setup for modal
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggleClose} size="sm" >
                <ModalHeader toggle={this.props.toggleClose} className="filter">
                    My Auctions
                </ModalHeader>
                <ModalBody>
                    <Row className="my-auctions-titles">
                        <Col className="text-center">
                            <h4>ACTIVE</h4>
                        </Col>
                    </Row> 
                    {activeAuctions.map(auction => (this.handleDisplayAuction(auction)))}
                    <Row className="my-auctions-titles">
                        <Col className="text-center">
                            <h4 className="align-middle">ENDED</h4>
                        </Col>
                    </Row>
                    {endedAuctions.map(auction => (this.handleDisplayAuction(auction)))}
                </ModalBody>
            </Modal>
        )
    }
}
//Map drizzle store to component via props
const mapStateToProps = state => {
    return {
        account: state.accounts[0],
        state: state.contracts.AuctionHouse
    }
}
myAuctions.contextTypes = {
    drizzle: PropTypes.object,
};
export default drizzleConnect(myAuctions, mapStateToProps);