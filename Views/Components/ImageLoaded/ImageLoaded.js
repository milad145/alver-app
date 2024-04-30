import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import GlobalVariables from '../../Modules/GlobalVariables';

export default class ImageLoaded extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.body}>
                <Text style={[GlobalVariables.TextStyle('v', 'me', 'dp')]}>
                    در حال بارگزاری تصویر
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
