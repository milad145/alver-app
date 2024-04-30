import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import GlobalVariables from '../../Modules/GlobalVariables';

import {NavigationService} from '../../Services/NavigationService';
import {UserService} from '../../Services/UserService';

import LogoutSection from './LogoutSection';
import LoginSection from './LoginSection';

export default class LoginLogout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: GlobalVariables.GetUser() ? GlobalVariables.GetUser().phoneNumber : '',
            isLogin: !!GlobalVariables.GetUser(),
        };
    }

    componentDidUpdate() {
        if (this.state.isLogin !== !!GlobalVariables.GetUser()) {
            this.setState({
                phoneNumber: GlobalVariables.GetUser() ? GlobalVariables.GetUser().phoneNumber : '',
                isLogin: !!GlobalVariables.GetUser(),
            });
        }
    }

    login() {
        NavigationService.navigate(this.props.navigation, 'Login');
    }

    logout() {
        UserService.logout1()
            .then(() => {
                EventRegister.emit('login');
                NavigationService.navigate(this.props.navigation, 'Profile', {refresh: true});
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            this.state.isLogin ?
                <LogoutSection logout={() => this.logout()} phoneNumber={this.state.phoneNumber}
                               navigation={this.props.navigation}
                               route={this.props.route}/>
                :
                <LoginSection login={() => this.login()} navigation={this.props.navigation} route={this.props.route}/>
        );
    }
}

const styles = StyleSheet.create({
    body: {},
});
