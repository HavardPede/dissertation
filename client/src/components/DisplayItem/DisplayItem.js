import React, { Component } from "react";
import "./DisplayItem.css"
class DisplayItem extends Component {

    render() {
        let { items, itemID } = this.props;
        let item = items.find(i => {
            return i.id === itemID;
        })
        return (
            item !== undefined && 
                <div className={"itemBoxFill " + item.rarity}>
                <img src={"./images/" + item.type + "/" + item.image + ".png"} className="item-image" alt={item.name} boxindex={this.props.boxindex}></img>

                <h6 className="text-white itemName">
                    {item.name}<br />
                    {item.equipped && (<i>Equipped</i>)}
                </h6>
            </div>
            )
}
}

export default DisplayItem;