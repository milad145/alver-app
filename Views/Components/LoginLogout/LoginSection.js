import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import GlobalVariables from '../../Modules/GlobalVariables';
import {NavigationService} from '../../Services/NavigationService';

export default class LoginSection extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    login() {
        this.props.login();
    }

    render() {
        return (
            <View
                style={[styles.body]}>
                <Text style={[styles.loginText, GlobalVariables.TextStyle('v', 'm', 't')]}>
                    برای استفاده از تمام امکانات
                    آلور از قبیل
                    ثبت و مدیریت آگهی وارد حساب کاربری خود شوید.</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}></View>
                    <TouchableOpacity style={styles.button} onPress={this.login.bind(this)}>
                        <Text style={[GlobalVariables.TextStyle('l', null, 't')]}>ورود به حساب</Text>
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
