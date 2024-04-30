import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import Header from './Body/FeedHeader';
import Body from './Body/Body';
import {UserService} from '../../Services/UserService';
import {NavigationService} from '../../Services/NavigationService';

import Footer from '../../Components/Footer/Footer';
import Loader from '../../Components/Loader/Loader';
import GlobalVariables from '../../Modules/GlobalVariables';
import {EventRegister} from 'react-native-event-listeners';

export default class FeedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: !!GlobalVariables.GetUser(),
            isLoading: true,
        };
    }


    componentDidMount() {
        this.isLogin();
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
        let isLogin = !!GlobalVariables.GetUser();
        this.setState({isLogin, isLoading: false});
        NavigationService.setParams(this.props.navigation, {refresh: false});
        if (!isLogin) {
            this.login();
        }
    }

    login() {
        NavigationService.navigate(this.props.navigation, 'Login', {screen: 'Feed'});
    }

    render() {
        return (

            <View style={[styles.mainView]}>
                <Header navigation={this.props.navigation} route={this.props.route}/>
                {this.state.isLogin ?
                    <Body navigation={this.props.navigation} route={this.props.route}/>
                    :
                    <View
                        style={[styles.loaderWrapper, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                        {this.state.isLoading ?
                            <Loader type="refresh" color="#888"/>
                            :
                            <TouchableOpacity style={[styles.footerButton, styles.footerElement]}
                                              onPress={() => this.isLogin()}>
                                <Text style={[styles.footerButtonText]}>ورود به حساب کاربری</Text>
                            </TouchableOpacity>
                        }
                    </View>
                }
                <Footer navigation={this.props.navigation} route={this.props.route}/>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    loaderWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        width: '45%',
    },
});
