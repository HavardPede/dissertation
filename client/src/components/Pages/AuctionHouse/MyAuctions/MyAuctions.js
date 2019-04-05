import React, { Component } from "react";
import { Modal, Row, Col, ModalHeader, ModalBody, ModalFooter, Button, Input, ButtonGroup} from "reactstrap";
import "./MyAuctions.css";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";

class SellItem extends Component {
    constructor(props, context) {
        super(props);

        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggleClose} size="sm" >
                <ModalHeader toggle={this.props.toggleClose} className="filter">
                    My Auctions
                </ModalHeader>
                <ModalBody> 
                
                <Row className="filter-row align-middle"> 
                   
                </Row>               
                </ModalBody>
            </Modal>
        )
    }
}
const mapStateToProps = state => {
    return {
        account: state.accounts[0],
        state: state.contracts.AuctionHouse
    }
}
SellItem.contextTypes = {
    drizzle: PropTypes.object,
};
export default drizzleConnect(SellItem, mapStateToProps);