import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import Icon from '../../Icon/Icon';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {NavigationService} from '../../../Services/NavigationService';


export default class CategoryHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {headerTitle: 'دسته‌بندی آگهی‌ها'};
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
                {this.state.back ?
                    <TouchableOpacity style={{height: '100%', justifyContent: 'center'}}
                                      onPress={() => NavigationService.goBack(this.props.navigation)}>
                        <Icon name="arrow-right" type="Feather"
                              style={{color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}
                              size={GlobalVariables.MediumIconSize}/>
                    </TouchableOpacity>
                    : null
                }
                <Text
                    style={[styles.titleText, GlobalVariables.TextStyle('b', 'xl', 't')]}>{this.state.headerTitle}</Text>
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
