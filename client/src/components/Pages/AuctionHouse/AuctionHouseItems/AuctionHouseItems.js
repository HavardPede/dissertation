import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import "./AuctionHouseItems.css";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: AuctionHouseItems
* Description: Component that represents all live auctions on the auctionhouse
*/

class AuctionHouseItems extends Component {
    constructor(props) {
        super(props)
        //Used to convert item-type from int to readable string
        this.type = ["Amulet", "Helmet", "Trinket", "Weapon", "Body", "Shield"];
        //Bind functions
        this.passesFilter = this.passesFilter.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handlePresentItem = this.handlePresentItem.bind(this);
    }
    //Initialize state
    state = {
        itemSelected: -1
    }

    //function for when you press an item
    handleItemSelect(e) {
        const id = e.currentTarget.id;
        var selected;
        if (this.state.itemSelected === id) {
            selected = -1;
        } else {
            selected = id;
        }
        this.setState({ itemSelected: selected })
        this.props.onItemSelect(selected);
    };
        //Function to check if a given item passes the filter set on the auctionhouse
        passesFilter(item) {
            //Fetch filter
            let filter = this.props.filter;
            if (filter.rarity === "0" || filter.rarity === item.rarity) { //Check if it passes rarity
                if (filter.type === "0" || filter.type === item.type) { //Check if item passes type-check
                    if (item.price >= filter.min && (filter.max === null || item.price <= filter.max || filter.max === 0)) { //Check if item passes price-check
                        if (parseInt(item.stats[0]) >= parseInt(filter.stat1) && parseInt(item.stats[1]) >= parseInt(filter.stat2)) { //check if item passes stat-check
                            return true; //If item passes checks, return true
                        }
                    }
                }
            }
            return false; //If any of the checks fail, return false
        }

        //Function to return an auction-row
        handlePresentItem(item) {
            if (this.passesFilter(item)) {
                return (

                    <tr
                        key={item.id}
                        id={item.id}
                        onClick={this.handleItemSelect}
                        className={
                            ((this.props.itemSelected === item.id) &&
                                "AH-item-selected") +
                            " auction-house-item"
                        }>
                        <td>
                            <div className={"auction-image " + item.rarity}>
                                <img src={"./images/" + item.type + "/" + item.image + ".png"} alt={item.name} id={item.id}></img>
                            </div>
                        </td>
                        <td className="auction-item-center-col">{item.seller == this.props.account ? "Mine" : <span className="address-text">{item.seller}</span>}</td>
                        <td className="auction-item-center-col">{item.stats[0]}</td>
                        <td className="auction-item-center-col">{item.stats[1]}</td>
                        <td className="auction-item-center-col"><strong>{item.price} Finney</strong></td>
                    </tr>
                )
            }
            else return null;
        }

        //Call handlePresentItem on all items
        render() {
            return (
                <tbody>
                    <tr></tr>
                    {this.props.items.map((item) => (this.handlePresentItem(item)))}
                </tbody>
            )
        }
    }
    export default AuctionHouseItems;