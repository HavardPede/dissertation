import React, { Component } from "react";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { Container, Row, Col } from "reactstrap";
import "./AuctionHouseItems.css";

class AuctionHouseItems extends Component {
    constructor(props, context) {
        super(props)

        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;
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
    componentWillReceiveProps() {
        if (this.props.filter !== null) {
            this.correctFilter();
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
        console.log(filter);
        if (filter.rarity === 0 || filter.rarity === item.rarity) {
            console.log("passes Rarity")
            if (filter.type === 0 || filter.type === item.type) {
                console.log("passes Type")
                if (item.price >= filter.min && (item.price <= filter.max || filter.max == null)) {
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
                <Container key={item.id} className={"auction-house-item " + item.rarity}>
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
                        <Col className="col-3 text-center">Price</Col>
                        <Col className="text-center">0.111 ETH</Col>
                    </Row>
                </Container>
            )
        }
    }


    render() {
        return (
            <div id="all-ah-items">
                {this.props.items.map((item) => (this.handlePresentItem(item)))}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        account: state.accounts[0],
        state: state.contracts.ItemOwnership
    }
}
AuctionHouseItems.contextTypes = {
    drizzle: PropTypes.object,
};
export default drizzleConnect(AuctionHouseItems, mapStateToProps);