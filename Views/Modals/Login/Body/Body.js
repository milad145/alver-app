import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, BackHandler} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';
import RNOtpVerify from 'react-native-otp-verify';

import Loader from '../../../Components/Loader/Loader';
import PhoneNumber from '../../../Components/Inputs/PhoneNumber';

import GlobalVariables from '../../../Modules/GlobalVariables';

import {NavigationService} from '../../../Services/NavigationService';
import {UserService} from '../../../Services/UserService';
import {ToastService} from '../../../Services/ToastService';
import {PermissionService} from '../../../Services/PermissionService';


export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true,
            phoneNumber: '',
        };
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.renewPhoneNumber());
        this.listener = EventRegister.addEventListener('renewPhoneNumber', () => this.renewPhoneNumber());
    }

    renewPhoneNumber() {
        this.setState({active: true});
    }

    componentWillUnmount() {
        this.backHandler.remove();
        EventRegister.removeEventListener(this.listener);
    }

    checkSmsPermission() {
        this.next();
        // PermissionService.checkAndRequest('RECEIVE_SMS')
        //     .then(() => PermissionService.checkAndRequest('READ_SMS'))
        //     .then(() => this.next())
        //     .catch(() => this.next());
    }

    next() {
        if (this.state.active && this.state.validPhoneNumber) {
            this.setState({active: false});
            UserService.getActiveCode(this.state.phoneNumber, GlobalVariables.GetSmsHash())
                .then(result => {
                    this.setState({active: true});
                    let {smsText, smsCodeLength} = result;
                    let reqularExp = `([\\d]{${smsCodeLength}})`;
                    smsText = smsText.replace('{number}', reqularExp);
                    NavigationService.push(this.props.navigation, 'Confirm', {
                        smsText, phoneNumber: this.state.phoneNumber, ...this.props.route.params,
                    });
                })
                .catch(error => {
                    this.setState({active: true});
                    if (error.type === 'request') {
                        ToastService.show(error.message, 3000, 'c');
                    } else if (error.type === 'response') {
                        ToastService.show(error.data.message, 3000, 'c');
                    }
                });
        }
    }

    render() {
        return (
            <View style={styles.login}>
                <ScrollView
                    style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    <Text style={[styles.title, GlobalVariables.TextStyle('b', 'xl', 't')]}>شماره موبایل خود را وارد
                        کنید</Text>
                    <Text style={[GlobalVariables.TextStyle('l', 's', 't')]}>برای استفاده از امکانات آلور، لطفا
                        شماره
                        موبایل خود را وارد کنید. کد تایید به این شماره پیامک خواهد شد.</Text>
                    <PhoneNumber phoneNumber={this.state.phoneNumber} returnKeyType="next" autoFocus={true}
                                 onSubmitEditing={() => this.checkSmsPermission()} editable={this.state.active}
                                 onChangeText={(phoneNumber, validPhoneNumber) => this.setState({
                                     phoneNumber,
                                     validPhoneNumber,
                                 })}/>
                </ScrollView>

                <View
                    style={[styles.footer, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    <View style={styles.footerElement}/>

                    <TouchableOpacity style={[styles.footerButton, styles.footerElement]}
                                      onPress={() => this.checkSmsPermission()}>
                        {this.state.active ?
                            <Text style={[styles.footerButtonText]}>بعدی</Text>
                            :
                            <Loader animation={true} type="loader"/>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    login: {
        flex: 1,
    },
    body: {
        flex: 1,
        padding: 20,
    },
    title: {
        marginBottom: 10,
    },
    footer: {
        backgroundColor: '#f9f9f9',
        ...GlobalVariables.DefaultShadow,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        width: '45%',
    },
});
