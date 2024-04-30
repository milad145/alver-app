import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import Icon from '../../../Components/Icon/Icon';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {NavigationService} from '../../../Services/NavigationService';


export default class AboutUsHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={[styles.body, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                {this.props.route.params.force ? null :
                    <TouchableOpacity style={{height: '100%', justifyContent: 'center'}}
                                      onPress={() => NavigationService.goBack(this.props.navigation)}>
                        <Icon name="arrow-right" type="Feather" style={GlobalVariables.TextStyle(null, null, 't')}
                              size={GlobalVariables.MediumIconSize}/>
                    </TouchableOpacity>
                }
                <Text style={[GlobalVariables.TextStyle('b', 'xl', 't'), styles.titleText]}>درباره ما</Text>
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
