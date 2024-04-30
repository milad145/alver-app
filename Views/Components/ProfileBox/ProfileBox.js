import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import GlobalVariables from '../../Modules/GlobalVariables';
import {EventRegister} from 'react-native-event-listeners';
import Icon from '../Icon/Icon';

export default class ProfileBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {title, icon} = this.props;
        this.setState({title, icon});
    }


    componentDidUpdate() {
        if (!_.isEqual(this.state.icon, this.props.icon) || this.state.title !== this.props.title) {
            this.setState({title: this.props.title, icon: this.props.icon});
        }
    }

    render() {
        return (
            this.state.icon ?
                <TouchableOpacity style={[styles.body, {
                    backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor'),
                }, GlobalVariables.GetDarkMode() ? {
                    borderWidth: 1,
                    borderColor: GlobalVariables.StyleMode(false, 'borderColor'),
                } : null]}
                                  onPress={this.props.onPress}>
                    <View style={styles.boxElement}>
                        <Icon style={{color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}
                              name={this.state.icon.name} size={GlobalVariables.MediumIconSize}
                              type={this.state.icon.type}/>
                    </View>
                    <View style={styles.boxElement}>
                        <Text numberOfLines={2}
                              style={[GlobalVariables.TextStyle('v', 'm1', 't'),{textAlign:'center'}]}>{this.state.title}</Text>
                    </View>
                </TouchableOpacity>
                :
                null
        );
    }
}

const styles = StyleSheet.create({
    body: {
        width: '31%',
        // aspectRatio: 1,
        ...GlobalVariables.DefaultShadow,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
        height: (GlobalVariables.DeviceWidth * 0.3),
        marginRight: '2%',
        elevation: 5,
    },
    boxElement: {
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 10,
        // marginBottom: 10
    },
});
