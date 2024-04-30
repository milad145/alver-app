import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {NavigationService} from '../../../Services/NavigationService';

import Icon from '../../../Components/Icon/Icon';


export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={[styles.body, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                <TouchableOpacity style={{height: '100%', justifyContent: 'center'}}
                                  onPress={() => NavigationService.goBack(this.props.navigation)}>
                    <Icon name="arrow-right" type="Feather" size={GlobalVariables.MediumIconSize}
                          style={[GlobalVariables.TextStyle(null, null, 't')]}/>
                </TouchableOpacity>
                <Text style={[GlobalVariables.TextStyle('b', 'xl', 't'),styles.titleText]}>مشخصات آگهی</Text>
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
    },
});
