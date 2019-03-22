import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import { Container, Row, Col, Button } from "reactstrap";
import AuctionHouseItems from "./AuctionHouseItems/AuctionHouseItems";
import Filter from "./Filter/Filter";
import "./AuctionHouse.css";




export default class AuctionHouse extends Component {
    constructor(props) {
        super(props);

        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleToggleFilter = this.handleToggleFilter.bind(this);
        this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
        this.handleSetFilter = this.handleSetFilter.bind(this);
        this.handleToggleSellItem = this.handleToggleSellItem.bind(this);
    }
    state = {
        ItemSelected: -1,
        filterModal: false,
        filter: null,
        sellItemModal:false
    }

    //Item selected in modal
    handleItemSelect(itemSelected) {
    }
    handleSetFilter(filter) {
        this.setState({filter, filterModal: false});
    }
    
    handleToggleFilter(){
        this.setState({
            filter: null,
            filterModal: !this.state.filterModal
        })
    }
    handleRemoveFilter(){
        this.handleToggleFilter();
        this.setState({filter: null})
    }
    handleToggleSellItem(){
        this.setState({sellItemModal: !this.state.sellItemModal})
    }

    render() {
        return (
            <div>
                <Navbar />
                <Container id="mainAH">
                    <Row>
                        <Col className="text-center" id="AH-title">
                            <h1>AUCTION HOUSE</h1>
                        </Col>
                    </Row>
                    <Row id="button-row">
                        <Col id="filter-button" className="text-left">
                        </Col>
                        <Col id="sell-button" className="text-right">
                            <Button type="button" onClick={() => this.handleToggleFilter()} className="auction-house-button" >FILTER</Button>
                            <Button type="button" onClick={this.handleToggleSellItem} className="auction-house-button"> SELL ITEM </Button>
                        </Col>
                    </Row>
                    <Row>
                        <div id="auction-items-box">
                            <AuctionHouseItems onItemSelect={this.handleItemSelect} filter={this.state.filter} items={this.props.items} />
                        </div>
                    </Row>
                </Container>
                <Footer /> 
                
                <Filter 
                    isOpen={this.state.filterModal}
                    toggleClose={this.handleToggleFilter} 
                    updateFilter={this.handleSetFilter} 
                    removeFilter={this.handleRemoveFilter}
                />
            </div>
        )
    }
}
