import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';
// import SmsListener from 'react-native-android-sms-listener';

import Loader from '../../../Components/Loader/Loader';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {latinNumToPersianNum, SetTimeFormat} from '../../../Modules/Assets';

import {NavigationService} from '../../../Services/NavigationService';
import {UserService} from '../../../Services/UserService';
import {ToastService} from '../../../Services/ToastService';
import RNOtpVerify from 'react-native-otp-verify';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            active: true,
            timer: null,
            duration: GlobalVariables.requestDurationPeriod,
            validationOpacity: new Animated.Value(0),
        };
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        console.log(this.props.route.params);
        const {phoneNumber, screen, smsText} = this.props.route.params;
        let obj = {phoneNumber};
        if (screen) {
            obj.screen = screen;
        }
        this.setState(obj);
        RNOtpVerify.getOtp()
            .then(() => RNOtpVerify.addListener(messages => {
                let verificationCodeRegex = new RegExp(smsText);
                if (verificationCodeRegex.test(messages)) {
                    let activeCode = messages.match(verificationCodeRegex)[1];
                    console.log(activeCode);
                    this.assignActiveCode(activeCode);
                }
            }))
            .catch(p => console.log(p));
        this.startTimer();
    }

    requestNewCode() {
        UserService.getActiveCode(this.state.phoneNumber)
            .then(() => this.startTimer())
            .catch(error => {
                if (error.type === 'request') {
                    ToastService.show(error.message, 3000, 'c');
                } else if (error.type === 'response') {
                    ToastService.show(error.data.message, 3000, 'c');
                }
            });

    }

    assignActiveCode(activeCode) {
        this.setState({
            activeCode,
        });
        this.login();
    }

    startTimer() {
        this.setState({
            canRequestNewCode: false,
            timer: setInterval(this.tick, 1000),
        });
    }

    componentWillUnmount() {
        this.stopTick();
        // this.subscription.remove();
    }

    login() {
        if (this.state.active) {
            Animated.timing(this.state.validationOpacity, {toValue: 0, useNativeDriver: true}).start();
            this.setState({active: false});
            UserService.Login(this.state.phoneNumber, this.state.activeCode)
                .then(() => {
                    this.stopTick();
                    EventRegister.emit('login');
                    NavigationService.navigate(this.props.navigation, this.state.screen || 'Profile', {refresh: true});
                })
                .catch(error => {
                    this.setState({active: true});
                    if (error.type === 'request') {
                        ToastService.show(error.message, 1000, 'c');
                    } else if (error.type === 'response' && error.data && error.data['messageCode'] && error.data['messageCode'] === 2004) {
                        Animated.timing(this.state.validationOpacity, {toValue: 1, useNativeDriver: true}).start();
                    } else if (error.type === 'response') {
                        ToastService.show(error.data.message, 3000, 'c');
                    }
                });
        }
    }

    tick() {
        let {duration} = this.state;
        if (duration > 0) {
            this.setState({duration: duration - 1});
        } else {
            this.stopTick();
        }
    }

    stopTick() {
        clearInterval(this.state.timer);
        this.setState({duration: GlobalVariables.requestDurationPeriod, canRequestNewCode: true});
    }

    render() {
        return (
            <View style={styles.login}>
                <ScrollView
                    style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    <Text style={[styles.title, GlobalVariables.TextStyle('b', 'xl', 't')]}>کد تأیید را وارد کنید</Text>
                    <Text style={[GlobalVariables.TextStyle('l', 's', 't')]}>
                        لطفا کد تأییدی را که به شماره
                        {' ' + latinNumToPersianNum(this.state.phoneNumber) + ' '}
                        پیامک شده وارد کنید.
                    </Text>
                    <View
                        style={[{backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor_circleIcon')}, styles.phoneInput]}>
                        <TextInput
                            value={this.state.activeCode}
                            keyboardType="numeric"
                            autoCorrect={false}
                            onChangeText={(activeCode) => this.setState({activeCode})}
                            returnKeyType="next"
                            onSubmitEditing={() => this.login()}
                            autoFocus={true}
                            blurOnSubmit={false}
                            style={GlobalVariables.TextStyle('v', 'xl', null)}
                            editable={this.state.active}
                        />
                    </View>
                    <Animated.Text
                        style={[GlobalVariables.TextStyle('l'), styles.validation, {opacity: this.state.validationOpacity}]}>
                        کد تایید نادرست است.
                    </Animated.Text>
                </ScrollView>

                <View
                    style={[styles.footer, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    {typeof this.state.canRequestNewCode !== 'undefined' ?
                        this.state.canRequestNewCode ?
                            <TouchableOpacity style={[styles.newCodeButton, styles.footerElement]}
                                              onPress={() => this.requestNewCode()}>
                                <Text style={[styles.newCodeButtonText]}>درخواست کد</Text>
                            </TouchableOpacity>
                            :
                            <View style={styles.footerElement}>
                                <Text style={[GlobalVariables.TextStyle('l', null, 't')]}>
                                    درخواست مجدد
                                    ({latinNumToPersianNum(SetTimeFormat(this.state.duration * 1000, false))})
                                </Text>
                            </View>
                        :
                        <View style={styles.footerElement}/>
                    }
                    <TouchableOpacity style={[styles.footerButton, styles.footerElement]} onPress={() => this.login()}>
                        {this.state.active ?
                            <Text style={[styles.footerButtonText]}>ورود</Text>
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
    bodyText: {},
    phoneInput: {
        borderWidth: 1,
        borderColor: GlobalVariables.BrandColor(),
        borderRadius: 5,
        marginTop: 20,
    },
    footer: {
        backgroundColor: '#f9f9f9',
        ...GlobalVariables.DefaultShadow,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    newCodeButtonText: GlobalVariables.DefaultButtonsOutLineText,
    footerButton: GlobalVariables.DefaultButtons,
    newCodeButton: GlobalVariables.DefaultButtonsOutLine,
    footerElement: {
        width: '45%',
        justifyContent: 'center',
    },
    validation: {
        marginTop: 5,
        color: GlobalVariables.RedColor(),
    },
});
