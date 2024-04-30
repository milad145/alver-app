import React, {Component} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import Header from './Body/ConfirmHeader';
import Body from './Body/Body';

export default class ConfirmModal extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={[styles.mainView]}>
                <Header navigation={this.props.navigation} route={this.props.route}/>
                <Body navigation={this.props.navigation} route={this.props.route}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
});
