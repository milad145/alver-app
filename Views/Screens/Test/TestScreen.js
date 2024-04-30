import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import SplashScreen from "react-native-splash-screen";

// import Header from '../../Components/Header/Header';
// import Footer from '../../Components/Footer/Footer';
import Body from './Body/Body';

export default class TestScreen extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        setTimeout(() => {
            SplashScreen.hide();
        }, 500)
    }

    render() {
        return (
            <View style={[styles.mainView]}>
                {/*<Header navigation={this.props.navigation}/>*/}
                <Body navigation={this.props.navigation}/>
                {/*<Footer navigation={this.props.navigation}/>*/}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    }
});