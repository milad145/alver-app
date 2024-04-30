import React, {Component} from 'react';
import {View, StyleSheet, TextInput, Animated} from 'react-native';

import GlobalVariables from '../../Modules/GlobalVariables';
import {mobileNumberValidation} from '../../Modules/Assets';

export default class PhoneNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            validationOpacity: new Animated.Value(0),
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
    }

    componentDidMount() {
        this.setState({phoneNumber: this.props.phoneNumber});
    }

    componentDidUpdate() {
        if ((this.state.phoneNumber !== this.props.phoneNumber)) {
            this.setState({phoneNumber: this.props.phoneNumber});
        }
    }

    onChangeText(phoneNumber) {
        const validation = mobileNumberValidation(phoneNumber);
        this.props.onChangeText(phoneNumber, validation);
        Animated.timing(
            this.state.validationOpacity,
            {toValue: validation ? 0 : 1, useNativeDriver: true},
        ).start();
    }

    onSubmitEditing() {
        this.props.onSubmitEditing();
    }

    render() {
        return (
            <View
                style={[styles.body]}>
                <View
                    style={[{backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor_circleIcon')}, styles.phoneInput]}>
                    <TextInput
                        value={this.state.phoneNumber}
                        keyboardType="numeric"
                        autoCorrect={false}
                        onChangeText={this.onChangeText}
                        returnKeyType={this.props.returnKeyType || 'next'}
                        onSubmitEditing={this.onSubmitEditing}
                        autoFocus={this.props.autoFocus || false}
                        blurOnSubmit={false}
                        style={GlobalVariables.TextStyle('v', 'xl', null)}
                        editable={typeof this.props.editable !== 'undefined' ? this.props.editable : true}
                    />
                </View>
                <Animated.Text
                    style={[GlobalVariables.TextStyle('l'), styles.validation, {opacity: this.state.validationOpacity}]}>شماره
                    موبایل نامعتبر
                    است.</Animated.Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    phoneInput: {
        borderWidth: 1,
        borderColor: GlobalVariables.BrandColor(),
        borderRadius: 5,
        marginTop: 20,
    },
    validation: {
        marginTop: 5,
        color: GlobalVariables.RedColor(),
    },
});
