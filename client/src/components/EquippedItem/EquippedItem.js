import React, { Component } from "react";
import "./EquippedItem.css";
import { connect } from "react-redux";



class equippedItem extends Component {
    render() {

        var type = this.props.type;
        var items = this.props.items;
        var item = -1;

        for (var i = 0; i < items.length; i++) {
            if (items[i].type === type) {
                item = items[i];
            }
        }

        return (
            (item !== -1) &&
            <div className={"itemBoxFill " + item.rarity}>
                <img src={item.image} className="item-image" alt={item.name} />
                <h6 className="text-white itemName">{item.name}</h6>
            </div>
        )
    }
}
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