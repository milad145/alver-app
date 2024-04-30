import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {NavigationService} from '../../../Services/NavigationService';
import Icon from '../../../Components/Icon/Icon';


export default class FeedHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {headerTitle: 'ثبت آگهی'};
    }

    componentDidMount() {
        let newState = {};
        const {headerTitle, back} = this.props.route.params;
        if (headerTitle) {
            newState.headerTitle = headerTitle;
        }
        if (back) {
            newState.back = true;
        }
        this.setState(newState);
    }

    render() {
        return (
            <View style={[styles.body, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                <Text
                    style={[GlobalVariables.TextStyle('b', 'xl', 't'), styles.titleText]}>{this.state.headerTitle}</Text>
                <TouchableOpacity style={{height: '100%', justifyContent: 'center', marginRight: 10}}
                                  onPress={() => {
                                      EventRegister.emit('renewPost');
                                      NavigationService.setParams(this.props.navigation, {
                                          cat: null,
                                          title: '',
                                          description: '',
                                          images: [],
                                      });
                                  }}>
                    <Icon style={{color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}
                          name="rotate-cw" type="Feather" size={GlobalVariables.DefaultIconSize}/>
                </TouchableOpacity>
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
        flex: 1,
    },
});
