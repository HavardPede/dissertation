import React, { Component } from "react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import { Container, Row, Col, Button, Table } from "reactstrap";
import AuctionHouseItems from "./AuctionHouseItems/AuctionHouseItems";
import Filter from "./Filter/Filter";
import SellItem from "./SellItem/SellItem";
import MyAuctions from "./MyAuctions/MyAuctions";
import "./AuctionHouse.css";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import AHItem from "../../../utils/AuctionHouseItem";

/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: AuctionHouse
* Description: Page that represents the auction-house. Calls all components listed inside the AuctionHouse-directory.
*/

class AuctionHouse extends Component {
    constructor(props, context) {
        super(props);
        //Fetch Drizzle
        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;
        //Used to convert item-rarity from int to readable string
        this.rarity = ["common", "rare", "epic", "legendary"];
        //Bind functions
        this.setAHBalance = this.setAHBalance.bind(this);
        this.setAHKeyList = this.setAHKeyList.bind(this);
        this.setAhInfoList = this.setAhInfoList.bind(this);
        this.setItemList = this.setItemList.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleToggleFilter = this.handleToggleFilter.bind(this);
        this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
        this.handleSetFilter = this.handleSetFilter.bind(this);
        this.handleToggleSellItem = this.handleToggleSellItem.bind(this);
        this.generateItem = this.generateItem.bind(this);
        this.handlePurchase = this.handlePurchase.bind(this);
        this.handleToggleMyAuctions = this.handleToggleMyAuctions.bind(this);
    }
    //Store an initial filter
    initialFilter = {
        rarity: "0",
        type: "0",
        min: 0,
        max: null,
        stat1: 0,
        stat2: 0
    };
    //Set initial state
    state = {
        //Used for fetching AH items
        AHBalanceKey: null,
        AHBalance: null,
        auctionKeys: [],
        AHItemInfo: [],
        itemKeys: [],
        myAuctions: [],
        othersAuctions: [],
        //Used for state of page
        itemSelected: -1,
        filterModal: false,
        filter: this.initialFilter,
        sellItemModal: false,
        myAuctionsModal: false
    }
    //When state changes, call correct function.
    componentDidUpdate(prevProps, prevState) {
        //Whenever the amount of auctions change, update that in store.
        if (this.props.state.numberOfAuctions !== prevProps.state.numberOfAuctions) {
            this.setAHBalance();
        }
        //Whenever a new ah-balance is fetched, use this to fetch all auctions anew.
        if (this.state.AHBalance !== prevState.AHBalance) {
            this.setAHKeyList();
        }
        //Whenever auctions have been fetched
        if (this.props.state.getAuctionByIndex !== prevProps.state.getAuctionByIndex) {
            this.setAhInfoList();
        }
        //whenever some new items have been fetched, update state
        if (this.props.state.getItemByID !== prevProps.state.getItemByID) {
            this.setItemList();
        }
    }

    componentDidMount = async () => {
        //When component mounts, fetch how many items are currently on the auction house
        const AHBalanceKey = this.contracts.AuctionHouse.methods.numberOfAuctions.cacheCall();
        this.setState({ AHBalanceKey });
        this.setAHBalance();
    };

    //When the ah-balance is fetched, store it in state
    setAHBalance() {
        if (this.state.AHBalanceKey !== null && this.state.AHBalanceKey in this.props.state.numberOfAuctions) {
            let AHBalance = this.props.state.numberOfAuctions[this.state.AHBalanceKey].value;
            this.setState({ AHBalance });
        }
    }
    //When new ah-balance is set, fetch the keys for all auctions
    setAHKeyList() {
        let auctionKeys = [];
        let key;
        for (let i = 0; i < this.state.AHBalance; i++) {
            key = this.contracts.AuctionHouse.methods.getAuctionByIndex.cacheCall(i);
            auctionKeys.push(key);
        }
        this.setState({ auctionKeys, myAuctions: [], othersAuctions: [] });
    }
    //When all ah-item keys are fetched, store the returned values and fetch information about items
    setAhInfoList() {
        let { auctionKeys, AHBalance, AHItemInfo } = this.state;
        let { getAuctionByIndex } = this.props.state;

        let lastKey = auctionKeys[auctionKeys.length - 1];
        if (lastKey in getAuctionByIndex && AHBalance !== AHItemInfo.length) {

            let infos = new Map();
            let itemKeys = [];

            for (let i = 0; i < auctionKeys.length; i++) {
                let itemInfo = getAuctionByIndex[auctionKeys[i]].value;

                infos.set(itemInfo[0], itemInfo);
                itemKeys.push(this.contracts.AuctionHouse.methods.getItemByID.cacheCall(itemInfo.seller, itemInfo[0]));
            }
            this.setState({ AHItemInfo: infos, itemKeys });
        }
    }
    //When information about data is fetched, store the information
    setItemList() {
        let lastKey = this.state.itemKeys[this.state.itemKeys.length - 1];
        if (lastKey in this.props.state.getItemByID && this.state.itemKeys.length !== this.state.myAuctions.length + this.state.othersAuctions.length) {
            let myAuctions = [];
            let othersAuctions = [];

            for (let i = 0; i < this.state.itemKeys.length; i++) {
                let itemStats = this.props.state.getItemByID[this.state.itemKeys[i]].value;
                let auction = this.generateItem(itemStats);
                if (auction.seller === this.props.account) {
                    myAuctions.push(auction);
                }
                else {
                    othersAuctions.push(auction);
                }
            }
            this.setState({ myAuctions, othersAuctions });
        }
    }
    //Function to represent an item as an Item-object
    generateItem(itemStats) {
        let auctionInfo = this.state.AHItemInfo.get(itemStats.id)
        return new AHItem(
            itemStats.id,
            itemStats.equipmentType,
            itemStats.img,
            [itemStats.stat1, itemStats.stat2],
            this.rarity[itemStats.rarity - 1],
            auctionInfo.price,
            auctionInfo.seller,
            auctionInfo.ended
        )
    }

    //Item selected in modal
    handleItemSelect(itemSelected) {
        this.setState({ itemSelected });
    }
    //set a given filter
    handleSetFilter(filter) {
        this.setState({ filter, filterModal: false });
    }
    //Toggle filter-modal
    handleToggleFilter() {
        this.setState({
            filterModal: !this.state.filterModal
        });
    }
    //Remove stored filter and set it to inital filter
    handleRemoveFilter() {
        this.setState({ filter: this.initialFilter });
    }
    //Toggle sell-item modal
    handleToggleSellItem() {
        this.setState({ sellItemModal: !this.state.sellItemModal })
    }
    //Toggle my-auctions modal
    handleToggleMyAuctions() {
        this.setState({ myAuctionsModal: !this.state.myAuctionsModal })
    }
    //Function to call Smart Contract-method "purchaseAuction" to purchase a selected auction
    handlePurchase() {
        this.contracts.AuctionHouse.methods.purchaseAuction.cacheSend(this.state.itemSelected, this.props.account);
    }

    //represent the auction house
    render() {
        return (
            <div>
                <Navbar />
                <Container id="mainAH">
                    <Row>   
                        {/*----------TITLE----------*/}
                        <Col className="text-center" id="AH-title">
                            <h1>AUCTION HOUSE</h1>
                        </Col>
                    </Row>

                    {/*----------BUTTON ROW----------*/}
                    <Row id="button-row">
                        <Col id="AH-button" className="text-right">
                            <Button type="button" id="filter-button" onClick={() => this.handleToggleFilter()} className="auction-house-button" >FILTER</Button>
                            {this.state.filter !== this.initialFilter &&
                                <Button outline
                                    type="button" 
                                    id="remove-filter-button" 
                                    onClick={() => this.handleRemoveFilter()} 
                                    className="auction-house-button" 
                                >
                                &#x274C; CURRENT FILTER 
                                </Button>
                            }
                            <Button type="button" onClick={this.handleToggleMyAuctions} className="auction-house-button"> MY AUCTIONS </Button>
                            <Button type="button" onClick={this.handleToggleSellItem} className="auction-house-button"> SELL ITEM </Button>
                        </Col>
                    </Row>

                    {/*----------AUCTION HOUSE ITEMS----------*/}
                    <Row>
                        <div id="auction-items-box">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th><h5>RARITY</h5></th>
                                        <th><h5>SELLER</h5></th>
                                        <th><h5>STAT 1</h5></th>
                                        <th><h5>STAT 2</h5></th>
                                        <th><h5>PRICE</h5></th>
                                    </tr>
                                </thead>
                                    <AuctionHouseItems
                                        onItemSelect={this.handleItemSelect}
                                        itemSelected={this.state.itemSelected}
                                        filter={this.state.filter}
                                        items={ [...this.state.othersAuctions, ...this.state.myAuctions]}
                                        account={this.props.account}
                                    />
                            </Table>
                        </div>
                    </Row>

                    {/*----------PURCHASE BUTTON----------*/}
                    <Row id="AH-purchase-button-row">
                        {this.state.itemSelected !== -1 &&
                            <Button type="button" onClick={this.handlePurchase} className="standard-button">Purchase Auction</Button>
                        }
                    </Row>
                </Container>
                <Footer />
                
                {/*----------FILTER MODAL----------*/}
                <Filter
                    isOpen={this.state.filterModal}
                    toggleClose={this.handleToggleFilter}
                    updateFilter={this.handleSetFilter}
                    removeFilter={this.handleRemoveFilter}
                />
                {/*----------SELL ITEM MODAL----------*/}
                <SellItem
                    isOpen={this.state.sellItemModal}
                    toggleClose={this.handleToggleSellItem}
                    items={this.props.items}
                />
                {/*----------MY AUCTIONS MODAL----------*/}
                <MyAuctions
                    isOpen={this.state.myAuctionsModal}
                    toggleClose={this.handleToggleMyAuctions}
                    auctions={this.state.myAuctions}
                    items={this.props.items}
                />
            </div>
        )
    }
}
//Map Drizzle store to component through props
const mapStateToProps = state => {
    return {
        account: state.accounts[0],
        state: state.contracts.AuctionHouse
    }
}
AuctionHouse.contextTypes = {
    drizzle: PropTypes.object,
};
export default drizzleConnect(AuctionHouse, mapStateToProps);