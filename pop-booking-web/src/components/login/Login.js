import React, {Component} from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import {Button, FormLabel, FormControl, FormGroup, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import {decorate, observable} from 'mobx';
import {observer} from "mobx-react";
import {D} from '../../D';
import {toast} from 'react-toastify';

class Login extends Component {
    captcha_site_key = process.env.REACT_APP_CAPTCHA_SITE_KEY || "6LeQhC8UAAAAAPw_2k4_sZtE3w1y6VgIuCB-DMOx";

    ref = undefined;

    username = "";
    password = "";
    captchaToken;

    isLoading = false;

    reset = () => {
        this.ref.reset();
    }

    login = () => {
        this.isLoading = true;
        this.props.onLogin({
            username: this.username,
            password: this.password,
            captchaToken: this.captchaToken
        }).then(() => {
            this.isLoading = false;
            this.props.onExit();
        }).catch((reason) => {
            this.isLoading = false;
            this.reset();
        });
    }

    onVerifyCaptcha = (token) => {
        this.captchaToken = token;
    };

    loadCaptcha = () => {

    };

    render() {

        const {onExit} = this.props;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{D('Login')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <GoogleReCaptchaProvider reCaptchaKey="[Your recaptcha key]">
                        <FormGroup>
                            <FormLabel>{D('Username')}</FormLabel>
                            <FormControl autoFocus
                                         type="text" value={this.username} placeholder={D('Username')}
                                         onChange={(evt) => this.username = evt.target.value}/>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>{D('Password')}</FormLabel>
                            <FormControl type="password" value={this.password} placeholder={D('Password')}
                                         onChange={(evt) => this.password = evt.target.value}/>
                        </FormGroup>
                        <FormGroup>
                            {this.props.resetPasswordLink && D('Forgotten password? ')}
                            {this.props.resetPasswordLink && <a target="_blank" href={this.props.resetPasswordLink}>{D('Click to reset password')}</a>}
                        </FormGroup>
                        </GoogleReCaptchaProvider>,
                    </form>
                </Modal.Body>
                <Modal.Footer>

                    <Button bsStyle="primary" onClick={this.login} disabled={this.isLoading}>{D('Login')}</Button>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
};

export default observer(Login);

Login.propTypes = {
    onExit: PropTypes.func,
    onLogin: PropTypes.func.isRequired,
    resetPasswordLink: PropTypes.string
};

decorate(Login, {
    username: observable,
    password: observable,
    isLoading: observable
})
