import React, { Component } from "react";
import { Modal, Row, Col, ModalHeader, ModalBody, ModalFooter, Button, Input, ButtonGroup} from "reactstrap";
import "./SellItem.css";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import Items from "../../../items/items";
import DisplayItem from "../../../DisplayItem/DisplayItem";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: SellItem
* Description: Modal to allow user to sell an item they own on the AuctionHouse
*/

class SellItem extends Component {
    constructor(props, context) {
        super(props);
        //Fetch drizzle
        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;
        //Bind functions
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handlePriceSelect = this.handlePriceSelect.bind(this);
        this.handleTimeSelect = this.handleTimeSelect.bind(this);
        this.handleSellItem = this.handleSellItem.bind(this);
        this.toggleItemModal = this.toggleItemModal.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    //Initialize state
    state = {
        itemID: "-1",
        price: 0,
        time:  -1,
        itemModal: false,
    }

    //Item selected in modal
    handleItemSelect(itemID) {
        this.setState({ itemID });
    }
    //Set time as time in seconds
    handleTimeSelect(e) {
        this.setState({
            time: e.target.value * 3600
        })
    }
    //Set price
    handlePriceSelect(e) {
        this.setState({
            price: e.target.value
        })
    }
    //Remove selected choices by resetting state to initial state.
    handleCancel() {
        this.setState({
            itemID: "-1",
            price: 0,
            time:  -1,
            itemModal: false,
        });
        this.props.toggleClose();
    }
    //Function to call Smart Contract-method "startAuction" to sell an auction with the give choices
    handleSellItem() {
        let { itemID, price, time } = this.state;
        if (
            itemID !== -1 &&
            price > 0 &&
            time !== -1
        ) {
            this.contracts.AuctionHouse.methods.startAuction
            .cacheSend(itemID, price, time, this.props.account);
            this.handleCancel();
        } else {
            alert("Invalid inputs");
        }
    }
    //Function to toggle Item-modal
    toggleItemModal() {
        this.setState({itemModal: !this.state.itemModal})
    }
    //Function to remove selected item
    handleRemoveItem() {
        this.setState({
            itemModal: !this.state.itemModal,
            itemID: -1
        })
    }
    //Display modal
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggleClose} size="sm" >
                <ModalHeader toggle={this.props.toggleClose} className="filter">
                    Sell Item
                </ModalHeader>
                <ModalBody> 
                
                <Row className="filter-row align-middle"> 
                    <Col className="col-5 text-center sell-modal-center-col">
                        item:
                    </Col> 
                    <Col> 
                        <div className="item-box-sell" onClick={this.toggleItemModal}>
                            <DisplayItem items={this.props.items} itemID={this.state.itemID}></DisplayItem>
                        </div>
                    </Col> 
                </Row> 
                <Row className="filter-row align-middle"> 
                    <Col className="col-6 text-center sell-modal-center-col">
                        Price in Finney: (1/1000 ETH)

                    </Col> 
                    <Col> 
                        <Input type="number" value={this.state.price} onChange={this.handlePriceSelect} name="price" id="price-input-sell" />
                    </Col> 
                </Row> 
                <Row className="filter-row align-middle"> 
                    <Col className="col-5 text-center sell-modal-center-col">
                        Duration: 
                    </Col> 
                    <Col> 
                        <ButtonGroup id="time-input-sell">
                        <Button color="secondary" onClick={this.handleTimeSelect} value={24} active={this.state.time === 86400}>24H</Button>
                        <Button color="secondary" onClick={this.handleTimeSelect} value={48} active={this.state.rSelected === 172800}>48H</Button>
                        </ButtonGroup>
                    </Col> 
                </Row>               
                </ModalBody>
                <ModalFooter className="filter">
                    <Button className="auction-house-button" 
                        onClick={this.handleSellItem}
                    >SELL ITEM</Button>
                    <Button className="auction-house-button" onClick={this.handleCancel}>CANCEL</Button>
                </ModalFooter>
                
                    {/*---------------- ITEM MODAL ---------------- */}
                    <Modal isOpen={this.state.itemModal} toggle={this.toggleItemModal} size="lg">
                        <ModalHeader toggle={this.toggleItemModal} className="Modal">
                            Inventory
                    </ModalHeader>
                        <ModalBody>
                            <Items
                                onItemSelect={this.handleItemSelect}
                                items={this.props.items}
                                parentPage="inventory"
                                chosenItems={[]}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button className="modalButton" onClick={this.toggleItemModal}>Select</Button>
                            <Button className="modalButton" onClick={this.handleRemoveItem}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
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
SellItem.contextTypes = {
    drizzle: PropTypes.object,
};
export default drizzleConnect(SellItem, mapStateToProps);