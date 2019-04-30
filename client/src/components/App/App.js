import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import Item from "../../utils/item";
//Components
import Error404 from "../Errors/404";
import Loader from "../Loader/Loader";

//Page-imports
import Inventory from "../Pages/Inventory/Inventory";
import Home from "../Pages/Home/Home";
import Upgrade from "../Pages/Upgrade/Upgrade";
import AuctionHouse from "../Pages/AuctionHouse/AuctionHouse";
import "./App.css";
import Result from "../UpgradeResult/UpgradeResult";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";



/*
* Author: Håvard Pedersen 
* Last edit: 30.04.2019
* Title: App
* Description: The highest application-component. 
*   This fetches main data from blockchain,
*   and is the one calling the other components. Also stores router,
*   defining which page to display for a given url.
*/
class App extends Component {
  constructor(props, context) {
    super(props);
    //Fetch drizzle
    this.drizzle = context.drizzle;
    this.contracts = context.drizzle.contracts;

    //Bind functions
    this.setBalance = this.setBalance.bind(this);
    this.generateItem = this.generateItem.bind(this);
    this.setItemKeyList = this.setItemKeyList.bind(this);
    this.setItemList = this.setItemList.bind(this);
    this.handleUpgrade = this.handleUpgrade.bind(this);
    this.handleResetUpgradeResult = this.handleResetUpgradeResult.bind(this);

    //Variable used to convert rarity from int to string
    this.rarity = ["common", "rare", "epic", "legendary"];
    //Apps state, storing keys and data
    this.state = {
      balanceKey: null,
      itemKeys: null,
      balance: "",
      items: [],
      upgrade: null
    }
    this.upgradeResult = null;
  }
  //When applications first mounts
  componentDidMount = async () => {
    //Fetch balance and store key
    const balanceKey = this.contracts.AuctionHouse.methods.balanceOf.cacheCall(this.props.account);
    this.setState({ balanceKey });
    this.setBalance();
  };
  //Whenever application updates, view what data updated, and handle accordingly
  componentDidUpdate(prevProps, prevState) {
    //If balanceOf is in drizzle-state, update local value
    if (this.props.state.balanceOf !== prevProps.state.balanceOf) {
      this.setBalance();
    }
    //If the balance is changed, upload items anew
    if (this.state.balance !== prevState.balance) {
      this.setItemKeyList();
    }
    //If number of fetched items is updated, set itemlist
    if (this.props.state.getItemByIndex !== prevProps.state.getItemByIndex && this.state.balance > 0) {
      this.setItemList();
    }
  }

  //function to set balance of account
  setBalance() {
    if (this.state.balanceKey in this.props.state.balanceOf && this.state.balanceKey !== null) {
      this.setState({
        balance: this.props.state.balanceOf[this.state.balanceKey].value
      });
    }
  }
  //function to set the array of itemKeys, based on balance
  setItemKeyList() {
    let itemKeys = [];
    let key;
    for (let i = 0; i < this.state.balance; i++) {
      key = this.contracts.AuctionHouse.methods.getItemByIndex.cacheCall(this.props.account, i);
      itemKeys.push(key)
    }
    this.setState({ itemKeys });
  }
  //function to set the list of items, based on itemKeys
  setItemList() {
    let lastItemKey = this.state.itemKeys[this.state.itemKeys.length - 1];
    if (lastItemKey in this.props.state.getItemByIndex && this.state.balance !== this.state.items.length) {
      let items = [];
      for (let i = 0; i < this.state.itemKeys.length; i++) {
        let itemStats = this.props.state.getItemByIndex[this.state.itemKeys[i]].value;
        let item = this.generateItem(itemStats);
        items.push(item);
      }
      this.setState({ items });
    }
  }
  //Function used to convert item fetched from blockchain, into an Item-object
  generateItem(key) {
    return new Item(
      key.id,
      key.equipmentType,
      key.img,
      [key.stat1, key.stat2],
      this.rarity[key.rarity - 1],
      key.onAuction
    );
  }
  //functions to handle upgrade
  handleResetUpgradeResult() {
    this.setState({ upgrade: null });
  }
  handleUpgrade(upgrade) {
    this.setState({ upgrade });
  }

  render() {
    if (this.state.items.length === parseInt(this.state.balance)) { //If all items are rendered
      return (
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/inventory" ><Inventory items={this.state.items} /></Route>
            <Route path="/auction-house" ><AuctionHouse items={this.state.items} /></Route>
            <Route path="/upgrade" ><Upgrade items={this.state.items} upgradeEvent={this.handleResetUpgradeResult} /></Route>
            <Route path="/result" >
              <Result
                items={this.state.items}
                handleUpgrade={this.handleUpgrade}
                upgrade={this.state.upgrade}
              />
            </Route>
            <Route component={Error404} />
          </Switch>
        </BrowserRouter>
      );
    }
    //If all items are not rendered, display loader
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Loader show={true} />
          <Footer />
        </div>
      </BrowserRouter>
    )
  }
}
//provide drizzle store as a prop
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    drizzleStatus: state.drizzleStatus,
    state: state.contracts.AuctionHouse
  }
}
App.contextTypes = {
  drizzle: PropTypes.object,
};
export default drizzleConnect(App, mapStateToProps);