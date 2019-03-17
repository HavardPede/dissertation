import React, { Component } from "react";
import Button from "../Button/Button.js";
import "./items.css";
import { connect } from "react-redux";
import { setEquipSelector, setRaritySelector } from "../../actions/Selectors";

class items extends Component {
    constructor(props) {
        super(props)

        this.handlePresentItem = this.handlePresentItem.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleEquipSelect = this.handleEquipSelect.bind(this);
        this.handleRaritySelect = this.handleRaritySelect.bind(this);
        this.showRaritySelector = this.showRaritySelector.bind(this);
    }
    state = {
        itemSelected: -1
    }

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
    handleEquipSelect(e) {
        this.props.setEquipSelector(e.target.value);
    }
    handleRaritySelect(e) {
        this.props.setRaritySelector(e.target.value)
    }


    handlePresentItem(item) {
        var rarity = this.props.raritySelector;
        var type = this.props.equipSelector;

        if (type === "0" || type === item.type) {
            if (rarity === "0" || rarity === item.rarity) {
                if (!this.props.chosenItems.includes(item.id)) {
                    return (
                        <div className={item.rarity + " invent-item " + ((parseInt(this.state.itemSelected) === item.id) && " invent-item-selected") + " " + (item.equipped && "equipped")}
                            key={item.id} onClick={this.handleItemSelect}>
                            {item.equipped && <div className="overlay" id={item.id}><p>E</p></div>}
                            <img src={item.image} alt={item.name} id={item.id}></img>
                        </div>
                    )
                } else return ""
            } else return ""
        } else return ""
    }

    showRaritySelector() {
        const chosenItems = this.props.chosenItems;
        var item = -1;
        for (var i = 0; i < chosenItems.length; i++) {
            if (chosenItems[i] !== -1) {
                item = chosenItems[i];
                break;
            }
        } if (this.props.parentPage === "inventory" || item === -1){
            return true;
        }else{
            var chosen = this.props.items.find( (i) =>{
                if(i.id === item) return i;
            })
            this.props.setRaritySelector(chosen.rarity);
            return false;
        }
    }

    render() {
        return (
            <div>
                <h5 id="heading">
                    {/*---------------- Equipment type selector ---------------- */}
                    <select className="selector" value={this.props.equipSelector} onChange={this.handleEquipSelect}>
                        <option value="0">Equipment type</option>
                        <option value="helmet">Helmet</option>
                        <option value="body">Body Armor</option>
                        <option value="amulet">Amulet</option>
                        <option value="weapon">weapon</option>
                        <option value="trinket">Trinket</option>
                        <option value="shield">Shield</option>
                    </select>

                    {/*---------------- Rarity selector ---------------- */}
                    {this.showRaritySelector() &&
                        <select className="selector" value={this.props.raritySelector} onChange={this.handleRaritySelect}>
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

function mapStateToProps(state) {
    return {
        items: state.items,
        equipSelector: state.equipSelector,
        raritySelector: state.raritySelector,
        chosenItems: state.chosenItems
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setEquipSelector: (value) => dispatch(setEquipSelector(value)),
        setRaritySelector: (value) => dispatch(setRaritySelector(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(items)