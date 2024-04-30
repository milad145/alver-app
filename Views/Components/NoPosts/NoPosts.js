import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import GlobalVariables from '../../Modules/GlobalVariables';
import {EventRegister} from 'react-native-event-listeners';

export default class NoPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestLoaded: false,
        };
    }

    componentDidMount() {
        this.setState({requestLoaded: this.props.requestLoaded});
    }

    componentDidUpdate() {
        if (this.state.requestLoaded !== this.props.requestLoaded) {
            this.setState({requestLoaded: this.props.requestLoaded});
        }
    }

    render() {
        return (
            this.state.requestLoaded ?
                <View
                    style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    <Text style={[GlobalVariables.TextStyle('b', 'xl', 'dp'), {textAlign: 'center'}]}>
                        هیچ آگهی در این قسمت موجود نمی‌باشد.
                        {'\n'}
                    </Text>
                </View>
                : null
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 50,
    },
});
