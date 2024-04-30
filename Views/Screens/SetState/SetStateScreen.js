import React from 'react';
import {Linking, Platform} from 'react-native';

import RNOtpVerify from 'react-native-otp-verify';

import {UserService} from '../../Services/UserService';
import {NavigationService} from '../../Services/NavigationService';

import GlobalVariables from '../../Modules/GlobalVariables';


export default class SetStateScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.checkUser();
        // this.checkCity();
        this.checkPolicyAcceptance();
    }

    checkUser() {
        UserService.getUser()
            .then(user => {
                GlobalVariables.SetUser(user);
            })
            .catch(() => {
                GlobalVariables.SetUser(null);
            });
    }

    checkPolicyAcceptance() {
        UserService.checkPolicyAcceptance()
            .then(payload => {
                if (payload) {
                    this.checkCity();
                } else {
                    NavigationService.reset(this.props.navigation, 'Policy', {acceptance: true, force: true});
                }
            })
            .catch(() => {
                NavigationService.reset(this.props.navigation, 'Policy', {acceptance: true, force: true});
            });
    }

    checkCity() {
        RNOtpVerify.getHash()
            .then(hash => {
                GlobalVariables.SetSmsHash(hash[0]);
                return UserService.getCity();
            })
            .then(city => {
                if (city && city._id) {
                    GlobalVariables.SetCity(city);
                    NavigationService.reset(this.props.navigation, 'Main', {city: city});
                    // NavigationService.reset(this.props.navigation, 'EditPost', {post: '600443f302eb290db20eedbf'});
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                GlobalVariables.SetCity(null);
                NavigationService.reset(this.props.navigation, 'SelectCity', {changeUserCity: true});
            });
    }


    render() {
        return null;
    }

}

