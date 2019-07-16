import React, {Component} from 'react';
import {Col, Container, Dropdown, Nav, Navbar, NavDropdown, NavItem, Row} from "react-bootstrap";
import {observer} from 'mobx-react';
import {computed, decorate, action, observable} from "mobx";

import Home from "./components/home/Home";

import Login from "./components/login/Login";
import BookingCalendar from "./components/booking/BookingCalendar";
import {D} from './D';
import {ToastContainer} from "react-toastify";
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {IndexLinkContainer} from 'react-router-bootstrap';
import MyProfile from "./components/login/MyProfile";
import AdminPage from "./components/admin/AdminPage";
import PropTypes from 'prop-types';
import {stores} from "./controllers/Context";
import SecurityStore from "./controllers/SecurityStore";
import { createBrowserHistory } from 'history'

const history = createBrowserHistory();

class App extends Component {

    pages = {
        HOME: '/',
        LOGIN: '/login',
        CALENDAR: '/calendar',
        ADMIN: '/admin'
    }

    showLogin = false;
    showMyProfile = false;

    constructor(props) {
        console.log("Got here");
        console.log(props);
        super(props);
    }


    selectLanguage = (key) => {
        let value = key.split('.')[1];
        this.props.stores.language.language = value;
    }

    editProfile = () => {
        const res = this.props.stores.user.fetchCurrentUser();
        if (res) {
            res.then(user => {
                this.showMyProfile = true;
                return user;
            })
        }
    };

    onLogin = (credentials) => {
        return this.props.stores.security.login(credentials)
            .then(res => {
                this.showLogin = false;
            })
    };

    render() {
        const {pages} = this;
        const {stores} = this.props;
        const {language, languages} = stores.language;
        const {user, isLoggedIn, isAdmin} = stores.security;

        console.log("Got here too");
        console.log(pages.ADMIN)

        return (
            <div>
                <Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#link">Link</Nav.Link>
      <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  </Navbar.Collapse>
</Navbar>
                <Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home">POP Booking</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link eventKey={pages.HOME} href="#home">{D('Home')}</Nav.Link>
      <Nav.Link href="#link">Link</Nav.Link>
      <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  </Navbar.Collapse>
</Navbar>
                <Container>
                    <Row>
                        <Col xs={12} md={10} offset={1}>
                            <Route exact path="/" render={() => <Home stores={stores}/>}/>
                            <Route path={pages.CALENDAR} render={() => <BookingCalendar stores={stores}/>}/>
                            {isAdmin && <Route path={`${pages.ADMIN}`} render={() => <AdminPage stores={stores}/>}/>}
                        </Col>
                        {this.showLogin &&
                        <Login history={history} onExit={() => this.showLogin = false}
                               onLogin={this.onLogin} resetPasswordLink={this.props.stores.security.resetPasswordLink}/>
                        }
                        {this.showMyProfile &&
                        <MyProfile onExit={() => this.showMyProfile = false}
                                   user={stores.user.currentUser}
                                   store={stores.user}/>
                        }
                    </Row>
                </Container>
                <ToastContainer position='bottom-right' autoClose={8000}/>
            </div>
        )
    }

}

export default withRouter(observer(App));

decorate(App, {
    selectLanguage: action,
    showMyProfile: observable,
    showLogin: observable
});

App.propTypes = {
    stores: PropTypes.objectOf(PropTypes.shape({
        security: PropTypes.instanceOf(SecurityStore)
    }))
}
