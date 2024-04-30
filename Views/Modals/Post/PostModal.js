import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import Body from './Body/Body';
import SplashScreen from "react-native-splash-screen";

export default class PostModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {}
        }
    }


    componentDidMount() {

    }

    render() {
        return (
            <View style={[styles.mainView]}>
                <Body navigation={this.props.navigation} route={this.props.route} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    }
});
