import React, {Component} from 'react';
import {View, StyleSheet, BackHandler, Animated, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import {EventRegister} from 'react-native-event-listeners';

import HomeHeader from './Body/HomeHeader';
import Body from './Body/Body';

import Footer from '../../Components/Footer/Footer';
import AdvanceAlert from '../../Components/Alert/AdvanceAlert';

import GlobalVariables from '../../Modules/GlobalVariables';

import {NavigationService} from '../../Services/NavigationService';
import {UserService} from '../../Services/UserService';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backClickCount: 0,
            advanceAlertModalVisible: false,
            advanceAlertModalTitle: '',
            advanceAlertModalMessage: '',
            extraAlertButtons: [],
        };
        this.springValue = new Animated.Value(100);
    }

    componentDidMount() {
        setTimeout(() => {
            SplashScreen.hide();
        }, 0);
        this.listener = EventRegister.addEventListener('changedDarkMode', () => {
            this.setState({darkMode: GlobalVariables.GetDarkMode()});
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    _spring() {
        this.setState({backClickCount: 1}, () => {
            Animated.sequence([
                Animated.spring(
                    this.springValue,
                    {
                        toValue: -50,
                        friction: 5,
                        duration: 300,
                        useNativeDriver: true,
                    },
                ),
                Animated.timing(
                    this.springValue,
                    {
                        toValue: 100,
                        duration: 300,
                        useNativeDriver: true,
                    },
                ),
            ]).start(() => {
                this.setState({backClickCount: 0});
            });
        });

    }


    handleBackButton = () => {
        let rootState = NavigationService.getState(this.props.route.params).index;
        let screenState = NavigationService.getState(this.props.navigation).index;
        if (rootState) {
            NavigationService.goBack(this.props.route.params);
        } else if (screenState) {
            NavigationService.goBack(this.props.navigation);
        } else {
            this.state.backClickCount === 1 ? this.checkFeedback() : this._spring();
        }
        return true;
    };

    checkFeedback = () => {
        if (GlobalVariables.GetMyFeedBackStatus()) {
            this.exitApp();
        } else {
            this.showFeedbackModal();
        }
    };
    exitApp = () => BackHandler.exitApp();

    showFeedbackModal() {
        let extraAlertButtons = [
            {
                message: 'بله',
                iconName: 'smileo',
                iconType: 'AntDesign',
                onPress: () => this.sendFeedback(true),
            }, {
                message: 'خیر',
                iconName: 'frowno',
                iconType: 'AntDesign',
                onPress: () => this.sendFeedback(false),
            },
        ];
        this.setState({
            advanceAlertModalVisible: true,
            extraAlertButtons,
        });
    }

    sendFeedback(feedback) {
        UserService.sendMyFeedBack(feedback)
            .then(() => this.exitApp())
            .catch(() => this.exitApp());
    }

    closeFeedbackModal() {
        this.setState({
            advanceAlertModalVisible: false,
            advanceAlertModalTitle: '',
            advanceAlertModalMessage: '',
            extraAlertButtons: [],
        });
    }


    render() {
        return (
            <View style={[styles.mainView]}>
                <HomeHeader navigation={this.props.navigation} route={this.props.route}/>
                <Body navigation={this.props.navigation} route={this.props.route}/>
                <Footer navigation={this.props.navigation} route={this.props.route}/>
                <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}]}]}>
                    <Text style={[GlobalVariables.TextStyle('v', null, 't'), styles.exitTitleText]}>برای خروج دوبار دکمه
                        بازگشت را بزنید!</Text>
                </Animated.View>
                <AdvanceAlert extraAlertButtons={this.state.extraAlertButtons}
                              customCancelButton={true}
                              title={this.state.advanceAlertModalTitle}
                    // message={this.state.advanceAlertModalMessage}
                              title={'آیا از برنامه آلور راضی هستید؟'}
                              visible={this.state.advanceAlertModalVisible}
                              closeModal={() => this.closeFeedbackModal()}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    animatedView: {
        elevation: 2,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        width: '100%',
    },
    exitTitleText: {
        backgroundColor: 'rgba(30,30,30,.7)',
        padding: 10,
        borderRadius: GlobalVariables.BorderRadius,
        color: 'white',
    },
    exitText: {
        color: '#e5933a',
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
});
