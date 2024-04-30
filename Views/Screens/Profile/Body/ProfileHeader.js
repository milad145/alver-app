import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {NavigationService} from '../../../Services/NavigationService';


export default class ProfileHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {title: 'صفحه من'};
    }

    componentDidMount() {
        let newState = {};
        const {title, back} = this.props.route.params;
        if (title) {
            newState.title = title;
        }
        if (back) {
            newState.back = true;
        }
        this.setState(newState);
    }

    render() {
        return (
            <View style={[styles.body, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                <Text style={[styles.titleText,GlobalVariables.TextStyle('b','xl','t')]}>{this.state.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        height: GlobalVariables.HeaderHeight,
        ...GlobalVariables.DefaultShadow,
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: 'row',
    },
    titleText: {
        marginLeft: 10,
        flex: 1
    }
});
