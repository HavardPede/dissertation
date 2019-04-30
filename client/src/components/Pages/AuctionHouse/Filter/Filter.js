import React, { Component } from "react";
import { Modal, Row, Col, ModalHeader, ModalBody, ModalFooter, Button, Input } from "reactstrap";
import "./Filter.css";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: Filter
* Description: Filter modal for setting auctionhouse filter
*/

class Filter extends Component {
    constructor(props) {
        super(props)
        //Bind functions
        this.handleEquipSelect = this.handleEquipSelect.bind(this);
        this.handleRaritySelect = this.handleRaritySelect.bind(this);
        this.handleMax = this.handleMax.bind(this);
        this.handleMin = this.handleMin.bind(this); 
        this.updateFilter = this.updateFilter.bind(this);
        this.handleSetStat1 = this.handleSetStat1.bind(this);
        this.handleSetStat2 = this.handleSetStat2.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
    }
    //Initialize state
    state = {
        rarity: "0",
        type: "0",
        min: 0,
        max: 0,
        stat1: 0,
        stat2: 0
    }
    //Set type-filter
    handleEquipSelect(e){
        this.setState({
            type: e.target.value
        })
    }
    //Set rarity-filter
    handleRaritySelect(e){
        this.setState({
            rarity: e.target.value
        })
    }
    //Set minimum price
    handleMin(e){
        let min = e.target.value;
        if (min === "") min = 0;
        this.setState({
            min
        })
    }
    //Set maximum price
    handleMax(e){
        let max = e.target.value;
        this.setState({
            max
        })
    }
    //Set stat1 minimum
    handleSetStat1(e) {
        let stat1 = e.target.value;
        if (stat1 === "") stat1 = 0;
        this.setState({
            stat1
        })
    }
    //Set stat2 minimum
    handleSetStat2(e) {
        let stat2 = e.target.value;
        if (stat2 === "") stat2 = 0;
        this.setState({
            stat2
        })
    }
    //Function to pass filter to parent
    updateFilter(){
        if( //IF any of the inputs are invalid, alert
            this.state.minPrice < 0 || 
            this.state.maxPrice < 0 ||
            this.state.stat1 < 0 ||
            this.state.stat2 < 0
        ) {
            alert("Invalid Input!");
        } else { //If inputs are valid, call prop-function to pass values to parent
            this.props.updateFilter({
                rarity: this.state.rarity,
                type: this.state.type,
                stat1: this.state.stat1,
                stat2: this.state.stat2,
                min: this.state.min,
                max: this.state.max
            })
        }
    }
    //function to set filter-state back to initial state
    removeFilter() {
        this.setState({
            rarity: "0",
            type: "0",
            minPrice: 0,
            maxPrice: 0,
            stat1: 0,
            stat2: 0
        })
        this.props.removeFilter();
        this.props.toggleClose();
    }

    //Represent Modal
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggleClose} size="sm" >
                <ModalHeader toggle={this.props.toggleClose} className="filter">
                    Filter
                </ModalHeader>
                <ModalBody> 
                <Row className="filter-row align-middle">
                    <Col className="col-5 text-center align-middle"> 
                        Type: 
                    </Col> 

                    <Col > 
                        <select id="filter-selector" value={this.state.type} onChange={this.handleEquipSelect}>
                            <option value="0"></option>
                            <option value="2">Helmet</option>
                            <option value="5">Body Armor</option>
                            <option value="1">Amulet</option>
                            <option value="4">weapon</option>
                            <option value="3">Trinket</option>
                            <option value="6">Shield</option>
                        </select>
                    </Col> 

                </Row> 
                <Row className="filter-row align-middle"> 
                    <Col className="col-5 text-center align-middle">
                        Rarity: 
                    </Col> 
                    <Col> 
                        {/*---------------- Rarity selector ---------------- */}
                        <select id="filter-selector" value={this.state.rarity} onChange={this.handleRaritySelect}>
                            <option value="0"></option>
                            <option value="common">Common</option>
                            <option value="rare">Rare</option>
                            <option value="epic">Epic</option>
                            <option value="legendary">legendary</option>
                        </select>
                    </Col> 
                </Row> 
                
                <Row className="filter-row align-middle"> 
                    <Col className="col-5 text-center align-middle">
                        Stat 1:
                    </Col> 
                    <Col> 
                        <Input type="number" value={this.state.stat1} onChange={this.handleSetStat1} name="min" className="price-input" />
                    </Col> 
                </Row> 

                <Row className="filter-row align-middle"> 
                    <Col className="col-5 text-center align-middle">
                        Stat 2:
                    </Col> 
                    <Col> 
                        <Input type="number" value={this.state.stat2} onChange={this.handleSetStat2} name="max" className="price-input" />
                    </Col> 
                </Row> 

                <Row className="filter-row align-middle filter-bottom-row"> 
                    <Col className="text-center"> 
                        Min Price
                        <Input type="number" value={this.state.minPrice} onChange={this.handleMin} name="min" className="price-input" />
                    </Col> 
                    <Col className="text-center"> 
                        Max Price
                        <Input type="number" value={this.state.maxPrice} onChange={this.handleMax} name="max" className="price-input" />
                    </Col>
                </Row> 

                </ModalBody>
                <ModalFooter className="filter">
                    <Button className="auction-house-button" 
                        onClick={this.updateFilter}
                    >SET FILTER</Button>
                    <Button className="auction-house-button" onClick={this.removeFilter}>CANCEL</Button>
                </ModalFooter>
            </Modal>
        )
    }
}
export default Filter;