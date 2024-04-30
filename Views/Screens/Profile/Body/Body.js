import React, {Component} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';

import ProfileBoxes from './ProfileBoxes';
import SupportBoxes from './SupportBoxes';
import GlobalVariables from '../../../Modules/GlobalVariables';
import LoginLogout from '../../../Components/LoginLogout/LoginLogout';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {isLogin, phoneNumber} = this.props;
        this.setState({isLogin, phoneNumber});
    }


    componentDidUpdate() {
        const {isLogin, phoneNumber} = this.props;
        if (isLogin !== this.state.isLogin) {
            this.setState({isLogin, phoneNumber});
        }
    }

    render() {
        return (
            <ScrollView
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <View style={{marginTop: 15}}/>
                <LoginLogout navigation={this.props.navigation} route={this.props.route}/>
                <ProfileBoxes isLogin={this.state.isLogin} navigation={this.props.navigation} route={this.props.route}/>
                <SupportBoxes isLogin={this.state.isLogin} navigation={this.props.navigation} route={this.props.route}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        padding: 15,
        paddingTop: 0,
    },
});
