import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import "./logged-in.css"
import { connect } from "react-redux";

class Logged extends Component {
    render() {
        return (
            <div>
                <Container className="logged-in">
                    <Row>
                        <Col className="center">
                            <h4>You are logged in to:</h4>
                            <h6>{this.props.account}</h6>
                        </Col>
                    </Row>
                </Container>
                <br />
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log(state)
    return {
        account: state.account
    }
}

export default connect(mapStateToProps)(Logged);