import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import contract from "../../contracts/ItemOwnership.json";
import getWeb3 from "../../utils/getWeb3";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";

//Components
import Loader from "../Loader/Loader";
import Error404 from "../Errors/404";

//Page-imports
import Inventory from "../Pages/Inventory/Inventory";
import Home from "../Pages/Home/Home";
import Upgrade from "../Pages/Upgrade/Upgrade";
import "./App.css";
class App extends Component {
  constructor(props, context) {
    super(props);

    this.drizzle = context.drizzle;
    this.contracts = context.drizzle.contracts;
  }

  componentDidMount = async () => {
    try {
      //retrieve what network the webprovider is connected to
      const web3 = await getWeb3();
      //Check to see if this is the same network as the contract is deployed to
      await contract.networks[await web3.eth.net.getId()];
      //Wait till drizzle is initialized
      var state = this.drizzle.store.getState();
      while (!state.drizzleStatus.initialized) {
        const delay = new Promise(resolve => setTimeout(resolve, 500));
        await delay;
        state = this.drizzle.store.getState();
      }


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        "Web3 provider is not set up correctly.\nUse Metamask to connect to network \"localhost:7545.\"",
      );
      console.error(error);
    }
  };


  render() {
    if (!this.props.drizzleStatus.initialized) {
      return (
        <Loader />
      );
    }

    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/inventory" component={Inventory} />
          <Route path="/upgrade" component={Upgrade} />
          <Route component={Error404} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    drizzleStatus: state.drizzleStatus
  }
}
App.contextTypes = {
  drizzle: PropTypes.object,
};
export default drizzleConnect(App, mapStateToProps);