import React, { Component } from "react";
import "./ChosenItem.css";
import { connect } from "react-redux";
class ChosenItem extends Component {

    render() {

        var index = this.props.index;
        var chosenItems = this.props.chosenItems;
        var items = this.props.items;
        var item = -1;

        items.map(itemC => {
            if (itemC.id === chosenItems[index]) {
                item = itemC;
            }
            return null;
        });

        return (
            (item !== -1) &&
            <div className={"itemBoxFill " + item.rarity}>
                <img src={item.image} className="item-image" alt={item.name} boxindex={this.props.boxindex}></img>
                
                <h6 className="text-white itemName">
                    {item.name}<br />
                    {item.equipped && (<i>Equipped</i>)}
                    </h6>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.items,
        chosenItems: state.chosenItems
    }
}

export default connect(mapStateToProps)(ChosenItem)