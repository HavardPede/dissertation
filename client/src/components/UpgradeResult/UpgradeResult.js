import { Container, Row, Col, Button } from "reactstrap"; import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./UpgradeResult.css";
import DisplayItem from "../DisplayItem/DisplayItem";
import "./UpgradeResult.css";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";


class UpgradeResult extends Component {
    constructor(props, context) {
        super(props);
        this.drizzle = context.drizzle;
        this.contracts = context.drizzle.contracts;
        this.isNewItemFetched = this.isNewItemFetched.bind(this);
    }
    componentDidMount = async () => {
        console.log("mounted.", this.props.upgrade);
        console.log("Item recieved?", this.isNewItemFetched())
        if (this.props.upgrade === null) {
            this.contracts.ItemOwnership.events.Upgrade({
                filter: {
                    owner: this.props.account
                }
            }, (err, result) => {
                if (!err) {
                    let output = result.returnValues;
                    this.props.handleUpgrade({
                        id: output[1],
                        successful: output[1] !== "0"
                    })
                }
            }
            )
        }
    }
    shouldComponentUpdate(prevProps) {
        if (this.props.upgrade === prevProps.upgrade || !prevProps.upgrade.successful) {
            return false;
        } else {
            return true;
        }
    }
    isNewItemFetched() {
        let upgrade = this.props.upgrade;
        if ( upgrade !== null && upgrade !== undefined && upgrade.successful) {
            let item = this.props.items.find(i => {
                return i.id === upgrade.id
            })
            if (item !== undefined) {
                return true;
            }
        }
        return false;
    }

    render() {
        let { upgrade } = this.props;
        if (
            upgrade === null ||
            (upgrade.successful && !this.isNewItemFetched())) {
            return (
                <div>
                    <Navbar />
                    <div id="main-loader">
                        <img
                            src={process.env.PUBLIC_URL + 'preloader.gif'}
                            id="loading-image"
                            alt="loading gif"
                        />
                    </div>
                    <Footer />
                </div>
            )
            //If upgrade is successful
        } else if (upgrade.successful) {
            return (
                <div>
                    <Navbar />
                    <Container className="mainBoxResult" id="mainSuccess">
                        <h2>UPGRADE SUCCESSFUL!</h2>
                        <Row className="upgrade-row">
                            <Col xs="7" lg="3">
                            </Col>
                            {/*------- ITEM BOX -------*/}
                            <Col className="item-box-upgrade" onClick={this.toggle} boxindex="1" xs="7" lg="3">
                                <DisplayItem
                                    items={this.props.items}
                                    itemID={upgrade.id}
                                />
                                <Link to="/upgrade">
                                    <Button
                                        type="button"
                                        className="return-button"
                                        onClick={this.props.handleReturn}
                                    >
                                        Return
                            </Button>
                                </Link>
                            </Col>
                            <Col xs="7" lg="3">
                            </Col>
                        </Row>
                    </Container>
                    <Footer />
                </div>
            )
            //if upgrade is not successful
        } else {
            return (
                <div>
                    <Navbar />
                    <Container className="mainBoxResult">
                        <h2>UPGRADE FAILED!</h2>
                        <Link to="/upgrade">
                            <Button
                                type="button"
                                className="return-button"
                                onClick={this.props.handleReturn}
                            >
                                Return
                            </Button>
                        </Link>
                    </Container>
                    <Footer />
                </div>
            )
        }

    }
}
const mapStateToProps = state => {
    return {
        account: state.accounts[0],
        drizzleStatus: state.drizzleStatus,
        state: state.contracts.ItemOwnership
    }
}
UpgradeResult.contextTypes = {
    drizzle: PropTypes.object,
};
export default drizzleConnect(UpgradeResult, mapStateToProps);