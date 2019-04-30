import React, { Component } from "react";
import "./ChosenItem.css";
class ChosenItem extends Component {

    
/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: ChosenItem
* Description: Component representing an item within a box.
*   Mainly used on the upgrade-page.
*/
    render() {
        //Defines which index in the chosenItems-array is referenced. Used for upgrade-page, defining box 0, 1 or 2.
        var index = this.props.index;
        var chosenItems = this.props.chosenItems;
        //Store all-items array and placeholder for current item
        var items = this.props.items;
        var item = -1;

        //Find item and store it in item-array
        if(items !== undefined){
            items.map(itemC => {
                if (itemC.id === chosenItems[index]) {
                    item = itemC;
                }
                return null;
            });
        }
        //represent item, if item is defined
        return (
            (item !== -1) &&
            <div className={"itemBoxFill " + item.rarity}>
                <img src={"./images/" + item.type + "/" + item.image + ".png"} className="item-image" alt={item.name} boxindex={this.props.boxindex}></img>
                {/*The following is not currently in use. But if equipped items is re-implemented, this will work to display if item is equipped*/}
                <h6 className="text-white itemName">
                    {item.name}<br />
                    {item.equipped && (<i>Equipped</i>)}
                    </h6>
            </div>

        )
    }
}
export default ChosenItem;