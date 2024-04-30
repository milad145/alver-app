import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../Modules/GlobalVariables';


export default class RadioButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            value: {},
        };
    }

    componentDidMount() {
        let options = this.props.options;
        let value = _.find(options, {default: true});
        this.setState({options, value});
    }

    changeValue(value) {
        this.setState({value});
        this.props.onChangeValue(value);
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {/*style={[styles.body, {backgroundColor: 'red'}]}>*/}
                {this.state.options.map(o => {
                    return (
                        <TouchableOpacity onPress={() => this.changeValue(o)} key={o.name}
                                          style={[styles.buttons, this.state.value.name === o.name ? {backgroundColor: GlobalVariables.BrandColor()} : null]}>
                            <Text style={GlobalVariables.TextStyle('v', 's')}>{o.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
        borderColor: GlobalVariables.BrandColor(),
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    buttons: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
});
