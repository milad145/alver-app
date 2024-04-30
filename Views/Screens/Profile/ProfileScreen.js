import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// import SplashScreen from "react-native-splash-screen";

import Header from './Body/ProfileHeader';
import Footer from '../../Components/Footer/Footer';
import Body from './Body/Body';
import {UserService} from '../../Services/UserService';
import {NavigationService} from '../../Services/NavigationService';
import {EventRegister} from 'react-native-event-listeners';
import GlobalVariables from '../../Modules/GlobalVariables';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: GlobalVariables.GetUser() ? GlobalVariables.GetUser().phoneNumber : '',
            isLogin: !!GlobalVariables.GetUser(),
            refresh: false,
        };
    }

    componentDidMount() {
        // this.isLogin();
        this.listener = EventRegister.addEventListener('changedDarkMode', () => {
            this.setState({darkMode: GlobalVariables.GetDarkMode()});
        });
        this.listener1 = EventRegister.addEventListener('login', () => {
            this.isLogin();
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        EventRegister.removeEventListener(this.listener1);
    }

    componentDidUpdate() {
        if (this.props.route.params.refresh) {
            this.isLogin();
        }
    }

    isLogin() {
        this.setState({
            phoneNumber: GlobalVariables.GetUser() ? GlobalVariables.GetUser().phoneNumber : '',
            isLogin: !!GlobalVariables.GetUser(),
        });
        NavigationService.setParams(this.props.navigation, {refresh: false});
    }

    render() {
        return (
            <View style={[styles.mainView]}>
                <Header navigation={this.props.navigation} route={this.props.route}/>
                <Body navigation={this.props.navigation} route={this.props.route} isLogin={this.state.isLogin}
                      phoneNumber={this.state.phoneNumber}/>
                <Footer navigation={this.props.navigation} route={this.props.route}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
});
