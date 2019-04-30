import React, { Component } from "react";
import "./EquippedItem.css";
import { connect } from "react-redux";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: EquippedItem
* Description: Box representing an equipped item. 
*   Should be changed for displayItem in later iteration.
*   NB! OUTDATED AND NOT IMPLEMENTING DRIZZLE STORE. NEEDS ALTERATION
*/

class equippedItem extends Component {
    render() {
        //Store what item-type to represent
        var type = this.props.type;
        //Store accounts items-array and a placeholder for the given item to represent.
        var items = this.props.items;
        var item = -1;
        //Find item in items array and store it
        for (var i = 0; i < items.length; i++) {
            if (items[i].type === type && items[i].equipped) {
                item = items[i];
            }
        }
        //IF item found, represent it in box
        return (
            (item !== -1) &&
            <div className={"itemBoxFill " + item.rarity}>
                <img src={item.image} className="item-image" alt={item.name} />
                <h6 className="text-white itemName">{item.name}</h6>
            </div>
        )
    }
}
//Map 
function mapStateToProps(state) {
    return {
        items: state.items.filter((item) => {
            if (item.equipped === true) {
                return item
            }
        })
    }
}
export default connect(mapStateToProps)(equippedItem)