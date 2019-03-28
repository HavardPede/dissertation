import React, { Component } from "react";
import { Modal, Row, Col, ModalHeader, ModalBody, ModalFooter, Button, Input } from "reactstrap";
import "./Filter.css";

class Filter extends Component {
    constructor(props) {
        super(props)
        this.handleEquipSelect = this.handleEquipSelect.bind(this);
        this.handleRaritySelect = this.handleRaritySelect.bind(this);
        this.handleMax = this.handleMax.bind(this);
        this.handleMin = this.handleMin.bind(this); 
        this.updateFilter = this.updateFilter.bind(this);
        this.handleSetStat1 = this.handleSetStat1.bind(this);
        this.handleSetStat2 = this.handleSetStat2.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
    }
    state = {
        rarity: 0,
        type: 0,
        minPrice: 0,
        maxPrice: 0,
        stat1: 0,
        stat2: 0
    }
    handleEquipSelect(e){
        this.setState({
            type: e.target.value
        })
    }
    handleRaritySelect(e){
        this.setState({
            rarity: e.target.value
        })
    }
    handleMin(e){
        this.setState({
            minPrice: e.target.value
        })
    }    
    handleMax(e){
        this.setState({
            maxPrice: e.target.value
        })
    }
    handleSetStat1(e) {
        this.setState({
            stat1: e.target.value
        })
    }    
    handleSetStat2(e) {
        this.setState({
            stat2: e.target.value
        })
    }

    updateFilter(){
        if(
            this.state.minPrice < 0 || 
            this.state.maxPrice < 0 ||
            this.state.stat1 < 0 ||
            this.state.stat2 < 0
        ) {
            alert("Invalid Input!");
        } else {
            this.props.updateFilter({
                rarity: this.state.rarity,
                type: this.state.type,
                stat1: this.state.stat1,
                stat2: this.state.stat2,
                min: this.state.minPrice,
                max: this.state.maxPrice
            })
        }
    }
    removeFilter() {
        this.setState({
            rarity: 0,
            type: 0,
            minPrice: 0,
            maxPrice: 0,
            stat1: 0,
            stat2: 0
        })
        this.props.removeFilter();
    }
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