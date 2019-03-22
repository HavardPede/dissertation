import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer"
import { Modal, Container, Row, Col, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Items from "../../items/items";
import ChosenItem from "../../ChosenItem/ChosenItem";
import "./Upgrade.css";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { Link } from "react-router-dom";


class Upgrade extends Component {
    constructor(props, context) {
        super(props);

        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;

        this.toggle = this.toggle.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleChooseItem = this.handleChooseItem.bind(this);
        this.handleBoxUpdate = this.handleBoxUpdate.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
        this.handleUpgradeItems = this.handleUpgradeItems.bind(this);
    }
    state = {
        modal: false,
        boxSelected: "", //Index of box selected, number
        itemSelected: "",
        chosenItems: [-1, -1, -1]
    }
    //Open modal
    toggle(e) {
        this.setState({ boxSelected: e.currentTarget.getAttribute("boxindex") });
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    //Close modal
    toggleClose() {
        this.setState(prevState => ({
            modal: !prevState.modal,
            boxSelected: "",
            itemSelected: ""
        }));
    }
    //Item selected in modal
    handleItemSelect(itemSelected) {
        this.setState({ itemSelected });
    }
    //Update chosenItems with a new item
    handleChooseItem(index, item) {
        let chosenItems = this.state.chosenItems;
        chosenItems[index] = item;
        this.setState({ chosenItems });
    }
    //"select"-button in modal
    handleBoxUpdate() {
        this.handleChooseItem(parseInt(this.state.boxSelected), this.state.itemSelected);
        this.toggleClose();
    }
    //"remove item"-button in modal
    handleRemoveItem() {
        this.handleChooseItem(parseInt(this.state.boxSelected), -1);
        this.toggleClose();
    }
    //function to upgrade 3 items
    handleUpgradeItems() {
        this.contracts.ItemOwnership.methods.upgradeItems
            .cacheSend(
                this.props.account,
                parseInt(this.state.chosenItems[0]),
                parseInt(this.state.chosenItems[1]),
                parseInt(this.state.chosenItems[2])
            );
        this.props.upgradeEvent();
    }

    render() {
        return (
            <div>
                <Navbar />
                {/*---------------- START MAIN CONTENT ---------------- */}
                <Container id="mainUpgrade">
                    <h4>Choose 3 items of the same rarity:</h4>

                    {/*---------------- 3 BOXES ---------------- */}
                    <Row className="upgrade-row">
                        {/*------- ITEM 1 -------*/}
                        <Col className="item-box-upgrade" onClick={this.toggle} boxindex="0" xs="7" lg="3">
                            <ChosenItem index="0" boxindex="0" chosenItems={this.state.chosenItems} items={this.props.items} />
                        </Col>
                        {/*------- ITEM 2 -------*/}
                        <Col className="item-box-upgrade" onClick={this.toggle} boxindex="1" xs="7" lg="3">
                            <ChosenItem index="1" boxindex="1" chosenItems={this.state.chosenItems} items={this.props.items} />
                        </Col>
                        {/*------- ITEM 3 -------*/}
                        <Col className="item-box-upgrade" onClick={this.toggle} boxindex="2" xs="7" lg="3">
                            <ChosenItem index="2" boxindex="2" chosenItems={this.state.chosenItems} items={this.props.items} />
                        </Col>
                    </Row>

                    {/*---------------- UPGRADE BUTTON ---------------- */}
                    <Row id="upgrade-button-row">
                        {!this.state.chosenItems.includes(-1) &&
                            <Link to="/result">
                                <Button className="standard-button" onClick={this.handleUpgradeItems}>Upgrade </Button>
                        </Link>}
                    </Row>
                </Container>

                    {/*---------------- FOOTER ---------------- */}
                    <Footer />

                    {/*---------------- MODAL ---------------- */}
                    <Modal isOpen={this.state.modal} toggle={this.toggleClose} size="lg">
                        <ModalHeader toggle={this.toggleClose} className="Modal">
                            Inventory
                    </ModalHeader>
                        <ModalBody>
                            <Items
                                showButton={false}
                                onItemSelect={this.handleItemSelect}
                                items={this.props.items}
                                parentPage="upgrade"
                                chosenItems={this.state.chosenItems}
                            />
                        </ModalBody>
                        <ModalFooter>
                            {this.state.chosenItems[this.state.boxSelected] !== -1 && <Button className="modalButton" id="removeButton" onClick={this.handleRemoveItem}>Remove item</Button>}
                            <Button className="modalButton" onClick={this.handleBoxUpdate}>Select</Button>
                            <Button className="modalButton" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
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
Upgrade.contextTypes = {
                    drizzle: PropTypes.object,
            };
export default drizzleConnect(Upgrade, mapStateToProps);