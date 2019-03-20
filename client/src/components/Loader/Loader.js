import React, { Children, Component } from "react";
import "./Loader.css";
import { drizzleConnect } from "drizzle-react";
import contract from "../../contracts/ItemOwnership.json";
import PropTypes from "prop-types";
import getWeb3 from "../../utils/getWeb3";

class Loader extends Component {
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
        if (!this.props.drizzleStatus.initialized || this.props.show ) {
            return (
                <div id="main-loader">
                    <img src={process.env.PUBLIC_URL + 'preloader.gif'} alt="loading gif"></img>
                </div>
            )
        }
        return Children.only(this.props.children);
    }
}
const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus,
    };
};
Loader.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(Loader, mapStateToProps);