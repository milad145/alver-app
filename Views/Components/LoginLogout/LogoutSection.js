import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import GlobalVariables from '../../Modules/GlobalVariables';
import {latinNumToPersianNum} from '../../Modules/Assets';
import {UserService} from '../../Services/UserService';
import {NavigationService} from '../../Services/NavigationService';

export default class LogoutSection extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    logout() {
        this.props.logout();
    }

    render() {
        return (
            <View
                style={[styles.body]}>
                <Text style={[styles.loginText, GlobalVariables.TextStyle('v', 'm', 't')]}>
                    شما با شماره
                    موبایل {latinNumToPersianNum(this.props.phoneNumber)} وارد شده اید و
                    آگهی های ثبت شده با این شماره را مشاهده می‌کنید.</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}></View>
                    <TouchableOpacity style={styles.button} onPress={this.logout.bind(this)}>
                        <Text style={[GlobalVariables.TextStyle('l', null, 't')]}>خروج از حساب</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        paddingBottom: 10,
    },
    loginText: {
        marginBottom: 20,
    },
    button: {
        padding: 7,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        borderRadius: GlobalVariables.BorderRadius,
        alignSelf: 'flex-end',
    },
});
