import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import "./logged-in.css";
import { drizzleConnect } from "drizzle-react";

class Logged extends Component {
    render() {
        console.log(this.props.state);
        return (
            <div>
                <Container className="logged-in">
                    <Row>
                        <Col className="center">
                            <h4>You are logged in to:</h4>
                            <h6>{this.props.account} </h6>
                        </Col>
                    </Row>
                </Container>
                <br />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        state: state,
        account: state.accounts[0],
    };
};
export default drizzleConnect(Logged, mapStateToProps);