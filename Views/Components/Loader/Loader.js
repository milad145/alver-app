import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';

import Lottie from 'lottie-react-native';

export default class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let source = '';
        switch (this.props.type) {
            case 'loader':
                source = require('../../Assets/Animations/loader');
                break;
            case 'upload':
                source = require('../../Assets/Animations/upload');
                break;
            default:
                source = require('../../Assets/Animations/loader');
        }
        return (
            this.props.animation ?
                <Lottie source={source} autoPlay loop/>
                :
                <ActivityIndicator size={this.props.size || 'large'} color={this.props.color || '#fff'}/>

        );
    }
}

const styles = StyleSheet.create({
    body: {},
});
