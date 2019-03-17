import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import getWeb3 from "../../utils/getWeb3";

//Components
import Loader from "../Loader/Loader";
import Error404 from "../Errors/404";

//Page-imports
import Inventory from "../Pages/Inventory/Inventory";
import Home from "../Pages/Home/Home";
import Upgrade from "../Pages/Upgrade/Upgrade";
import "./App.css";

//redux
import { setAccount } from '../../actions/accountAction';
import { connect } from "react-redux";


class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      this.props.setAccount(accounts[0]);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  
  render() {
    if (!this.state.web3) {
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

 const mapDispatchToProps = (dispatch) => {
  return {
    setAccount: (account) => dispatch(setAccount(account))
  }
}


export default connect(null, mapDispatchToProps) (App);
