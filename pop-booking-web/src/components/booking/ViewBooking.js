import React from 'react';
import Helper from '../../shared/HelperFunctions';
import {D} from '../../D';
import {Button, Col, FormLabel, Form, FormGroup, Container, Modal, Row, FormControl} from "react-bootstrap";
import PropTypes from 'prop-types';
import Booking from "../../models/Booking";

export default class ViewBooking extends React.Component {

    render() {
        const {onExit, booking} = this.props;
        const {bookableItem, start, end, booker} = booking;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{D('View booking')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <FormLabel>{D('Booker')}</FormLabel>
                                    <FormControl.Static>{`${booker.name || ""} ${booker.roomNo}`}</FormControl.Static>
                                </FormGroup>
                            </Col>
                            <Col xs={12}>

                                <FormGroup>
                                    <FormLabel>{D('Unit')}</FormLabel>{' '}
                                    <FormControl.Static>{bookableItem.name}</FormControl.Static>
                                </FormGroup>

                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6}>
                                <FormGroup>
                                    <FormLabel>{D('From')}</FormLabel>
                                    <FormControl.Static>{Helper.getDateAndTimeAsString(start)}</FormControl.Static>
                                </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                                <FormGroup>
                                    <FormLabel>{D('To')}</FormLabel>
                                    <FormControl.Static>{Helper.getDateAndTimeAsString(end)}</FormControl.Static>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ViewBooking.propTypes = {
    onExit: PropTypes.func.isRequired,
    booking: PropTypes.instanceOf(Booking)
}
