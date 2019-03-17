import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer"
import { Modal, Container, Row, Col, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import ButtonC from "../../Button/Button";
import Items from "../../items/items";
import ChosenItem from "../../ChosenItem/ChosenItem";
import "./Upgrade.css";
import { connect } from "react-redux";
import { chosenItems } from "../../../actions/chosenItems";


class Upgrade extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleChooseItem = this.handleChooseItem.bind(this);
        this.handleBoxUpdate = this.handleBoxUpdate.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
    }

    state = {
        modal: false,
        boxSelected: "", //Index of box selected, number
        itemSelected: ""
    };
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
        this.props.setChosenItems(index, item)
    }
    //"select"-button in modal
    handleBoxUpdate() {
        this.handleChooseItem(parseInt(this.state.boxSelected), parseInt(this.state.itemSelected));
        this.toggleClose();
    }
    //"remove item"-button in modal
    handleRemoveItem() {
        this.handleChooseItem(parseInt(this.state.boxSelected), -1);
        this.toggleClose();
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
                        <Col className="item-box-upgrade" id="box1" onClick={this.toggle} boxindex="0" xs="7" lg="3">
                            <ChosenItem index="0" boxindex="0" />
                        </Col>
                        {/*------- ITEM 2 -------*/}
                        <Col className="item-box-upgrade" onClick={this.toggle} boxindex="1" xs="7" lg="3">
                            <ChosenItem index="1" boxindex="1" items={this.state.Items} />
                        </Col>
                        {/*------- ITEM 3 -------*/}
                        <Col className="item-box-upgrade" onClick={this.toggle} boxindex="2" xs="7" lg="3">
                            <ChosenItem index="2" boxindex="2" items={this.state.Items} />
                        </Col>
                    </Row>

                    {/*---------------- UPGRADE BUTTON ---------------- */}
                    <Row id="upgrade-button-row">
                        {!this.props.chosenItems.includes(-1) && <ButtonC text="Upgrade" link="/Success" />}
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
                        <Items showButton={false} onItemSelect={this.handleItemSelect} parentPage ="upgrade" />
                    </ModalBody>
                    <ModalFooter>
                        {this.props.chosenItems[this.state.boxSelected] !== -1 && <Button className="modalButton" id="removeButton" onClick={this.handleRemoveItem}>Remove item</Button>}
                        <Button className="modalButton" onClick={this.handleBoxUpdate}>Select</Button>
                        <Button className="modalButton" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state){
    return {
        chosenItems: state.chosenItems
    }
}
const mapDispatchToProps = (dispatch) => {
    return{
        setChosenItems: (index, id) => dispatch( chosenItems(index, id) )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Upgrade);