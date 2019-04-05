import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import "./AuctionHouseItems.css";

class AuctionHouseItems extends Component {
    constructor(props, context) {
        super(props)
        this.type = ["Amulet", "Helmet", "Trinket", "Weapon", "Body", "Shield"];

        this.passesFilter = this.passesFilter.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handlePresentItem = this.handlePresentItem.bind(this);
        this.correctFilter = this.correctFilter.bind(this);
    }
    state = {
        itemSelected: -1,
        correctedFilter:{
            type: 0,
            rarity: 0,
            min: 0,
            max: 0,
            stat1: 0,
            stat2:0
        }
    }
    componentDidUpdate(){
    }
    componentWillReceiveProps() {
        if (this.props.filter !== null) {
            this.correctFilter();
        }
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

    correctFilter() {
        let filter = this.props.filter;
        let type = filter.type;
        let rarity = filter.rarity;
        let min;
        let max;
        let stat1;
        let stat2;

        filter.min === "" ? min = 0 : min = filter.min;
        filter.max === "" ? max = null : max = filter.max;
        filter.stat1 === "" ? stat1 = 0 : stat1 = filter.stat1;
        filter.stat2 === "" ? stat2 = 0 : stat2 = filter.stat2;
        this.setState({
            correctedFilter: {
                type,
                rarity,
                min,
                max,
                stat1,
                stat2
            }
        })
    }

    passesFilter(item) {
        let filter = this.state.correctedFilter;
        if (filter.rarity === 0 || filter.rarity === item.rarity) {
            if (filter.type === 0 || filter.type === item.type) {
                if (item.price >= filter.min && (item.price <= filter.max || filter.max == 0)) {
                    if(item.stats[0] >= filter.stat1 && item.stats[1] >= filter.stat2) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //Function to return an item image
    handlePresentItem(item) {
        if(this.passesFilter(item)){
            return (
                <Container 
                    key={item.id} 
                    id={item.id} 
                    onClick={this.handleItemSelect} 
                    className={ 
                        ((this.props.itemSelected === item.id) && 
                        "AH-item-selected") +
                        " auction-house-item " + 
                        item.rarity
                    }
                >
                    <Row>
                        <Col xs="3">
                        </Col>
                        <Col xs="5" className="auction-image">
                            <img src={"./images/" + item.type + "/" + item.image + ".png"} alt={item.name} id={item.id}></img>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-5 text-center">Stat1:</Col>
                        <Col className="text-center">{item.stats[0]}</Col>
                    </Row>
                    <Row>
                        <Col className="col-5 text-center">Stat2:</Col>
                        <Col className="text-center">{item.stats[1]}</Col>
                    </Row>
                    <Row className="auction-price-row">
                        <Col className="col-3 text-center">Price:</Col>
                        <Col className="text-center">{item.price} Finney</Col>
                    </Row>
                </Container>
            )
        }
        else return "";
    }


    render() {
        return (
            <div id="all-ah-items">
                {this.props.items.map((item) => (this.handlePresentItem(item)))}
            </div>
        )
    }
}
export default AuctionHouseItems;