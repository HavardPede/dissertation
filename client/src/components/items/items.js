import React, { Component } from "react";
import StandardButton from "../Button/Button.js";
import "./items.css";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { Button, Container, Row, Col } from "reactstrap";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: Items
* Description: Represents the inventory of the account. 
*/

class items extends Component {
    constructor(props, context) {
        super(props)
        //Fetch drizzle 
        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;
        //Bind functions
        this.handlePresentItem = this.handlePresentItem.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleEquipSelect = this.handleEquipSelect.bind(this);
        this.handleRaritySelect = this.handleRaritySelect.bind(this);
        this.handleSetRarity = this.handleSetRarity.bind(this);
        this.createItem = this.createItem.bind(this);
        this.type = ["Amulet", "Helmet", "Trinket", "Weapon", "Body", "Shield"];
    }
    //Initial state for component
    state = {
        itemSelected: -1,
        rarity: "0",
        type: "0",
        showRaritySelector: true
    }
    /*
    * Called when component mounts. 
    * Check is used for upgrade-page.
    * if one or more items are chosen for upgrade, only show items of its rarity.
    * If caller is not upgrade-page, empty chosenItems-array should be passed as prop
    */
    componentDidMount = async () => {
        let id = this.props.chosenItems.find(item => {
            return item !== -1;
        })
        if (id !== undefined) {
            let item = this.props.items.find(item => {
                return item.id === id;
            })
            this.setState({ rarity: item.rarity, showRaritySelector: false });
        }
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
    //Function for when a type is selected
    handleEquipSelect(e) {
        this.setState({ type: e.target.value });
    }
    //Function for when rarity is selected
    handleRaritySelect(e) {
        this.setState({ rarity: e.target.value })
    }
    handleSetRarity(rarity) {
        this.setState({ rarity });
    }
    createItem() {
        for(let i = 0; i <= 3; i++) {
            this.contracts.AuctionHouse.methods.createItem.cacheSend(5, 4, 50, 2, 1, this.props.account);
        }  
    }

    //Function to return an item image
    handlePresentItem(item) {

        var rarity = this.state.rarity;
        var type = this.state.type;
        if (!item.onAuction) { 
            if(
                (this.props.parentPage === "upgrade" && item.rarity !== "legendary") ||
                this.props.parentPage !== "upgrade"
            ) {
                if (type === "0" || type === item.type) { //correct type
                    if (rarity === "0" || rarity === item.rarity) { //correct rarity
                        if (!this.props.chosenItems.includes(item.id)) { //is not chosen 
                            return (
                                <div 
                                    className={
                                        item.rarity + " invent-item " + 
                                        ((this.state.itemSelected === item.id) && 
                                        " invent-item-selected") + " " + 
                                        (item.equipped && "equipped")
                                    }
                                    key={item.id} 
                                    id={item.id} 
                                    onClick={this.handleItemSelect}
                                >
                                    {//IF equipped items get implemented again, uncomment this
                                    //item.equipped && <div className="overlay" id={item.id}><p>E</p></div>
                                    }
                                    <img src={"./images/" + item.type + "/" + item.image + ".png"} alt={item.name} id={item.id} ></img>
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
                        } 
                    } 
                }
            } 
        }
        else return ""
    }

    render() {
        return (
            <div>
                <h5 id="heading">
                    {/*---------------- Equipment type selector ---------------- */}
                    <select className="selector" value={this.state.type} onChange={this.handleEquipSelect}>
                        <option value="0">Equipment type</option>
                        <option value="2">Helmet</option>
                        <option value="5">Body Armor</option>
                        <option value="1">Amulet</option>
                        <option value="4">weapon</option>
                        <option value="3">Trinket</option>
                        <option value="6">Shield</option>
                    </select>

                    {/*---------------- Rarity selector ---------------- */}
                    {this.state.showRaritySelector &&
                        <select className="selector" value={this.state.rarity} onChange={this.handleRaritySelect}>
                            <option value="0">Rarity</option>
                            <option value="common">Common</option>
                            <option value="rare">Rare</option>
                            <option value="epic">Epic</option>
                            <option value="legendary">legendary</option>
                        </select>
                    }
                    {/*---------------- Button top right ---------------- */}
                    <Button type="button" onClick={this.createItem} className="standard-button"> Create New Item </Button>
                </h5>

                {/*---------------- Inventory box ---------------- */}
                <div id="inventory">
                    {this.props.items.map((item) => (this.handlePresentItem(item)))}
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        account: state.accounts[0],
        state: state.contracts.AuctionHouse
    }
}
items.contextTypes = {
    drizzle: PropTypes.object,
};
export default drizzleConnect(items, mapStateToProps);