import React, { Component } from "react";
import Button from "../Button/Button.js";
import "./items.css";

class items extends Component {
    constructor(props) {
        super(props)

        this.handlePresentItem = this.handlePresentItem.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleEquipSelect = this.handleEquipSelect.bind(this);
        this.handleRaritySelect = this.handleRaritySelect.bind(this);
        this.handleSetRarity = this.handleSetRarity.bind(this);
    }
    state = {
        itemSelected: -1,
        rarity: "0",
        type: "0",
        showRaritySelector: true
    }
    componentDidMount = async () => {
        let id = this.props.chosenItems.find(item => {
            return item !== -1;
        })
        if(id !== undefined){
            let item = this.props.items.find(item => {
                return item.id === id;
            })
            this.setState({rarity: item.rarity, showRaritySelector: false});
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

    //Function to return an item image
    handlePresentItem(item) {

        var rarity = this.state.rarity;
        var type = this.state.type;
        if (type === "0" || type === item.type) { //correct type
            if (rarity === "0" || rarity === item.rarity) { //correct rarity
                if (!this.props.chosenItems.includes(item.id)) { //is not chosen 
                    return (
                        <div className={item.rarity + " invent-item " + ((this.state.itemSelected === item.id) && " invent-item-selected") + " " + (item.equipped && "equipped")}
                            key={item.id} onClick={this.handleItemSelect}>
                            {item.equipped && <div className="overlay" id={item.id}><p>E</p></div>}
                            <img src={"./images/" + item.type + "/" + item.image + ".png"} alt={item.name} id={item.id}></img>
                        </div>
                    )
                } else return ""
            } else return ""
        } else return ""
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

                    {/*---------------- Rarity selector ---------------- */console.log("yo")}
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
                    {this.props.showButton &&
                        <div id="inventory-button">
                            <Button text="Upgrade" link="/upgrade" />
                        </div>
                    }
                </h5>

                {/*---------------- Inventory box ---------------- */}
                <div id="inventory">
                    {this.props.items.map((item) => (this.handlePresentItem(item)))}
                </div>
            </div>
        )
    }
}

export default items;