import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// import SplashScreen from "react-native-splash-screen";

import Footer from '../../Components/Footer/Footer';
import Header from './Body/Header';
import Body from './Body/Body';
import {EventRegister} from 'react-native-event-listeners';
import GlobalVariables from '../../Modules/GlobalVariables';

export default class CategoryScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('changedDarkMode', () => {
            this.setState({darkMode: GlobalVariables.GetDarkMode()});
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    }

    render() {
        return (
            <View style={[styles.mainView]}>
                <Header navigation={this.props.navigation} route={this.props.route}/>
                <Body navigation={this.props.navigation} route={this.props.route}/>
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
