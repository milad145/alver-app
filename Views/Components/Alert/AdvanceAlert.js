import React, {Component} from 'react';
import {View, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../Modules/GlobalVariables';

import Icon from '../../Components/Icon/Icon';

export default class AdvanceAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            showIcon: false,
            extraAlertButtons: [],
        };
    }

    componentDidMount() {
        const {modalVisible, extraAlertButtons, title, message} = this.props;
        this.setState({modalVisible, extraAlertButtons, title, message});
    }

    componentDidUpdate() {
        if ((this.props.visible !== this.state.modalVisible) || (this.props.title !== this.state.title) || (this.props.message !== this.state.message) || !_.isEqual(this.state.extraAlertButtons, this.props.extraAlertButtons)) {
            this.setState({
                modalVisible: this.props.visible,
                extraAlertButtons: this.props.extraAlertButtons,
                title: this.props.title,
                message: this.props.message,
            });
        }
    }

    closeModal() {
        this.props.closeModal();
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.closeModal()}
            >
                <View style={styles.body}>
                    <TouchableOpacity onPress={() => this.closeModal()} style={styles.blur}/>
                    <View
                        style={[styles.main, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}, GlobalVariables.GetDarkMode() ? {
                            borderWidth: 1,
                            borderColor: GlobalVariables.StyleMode(true, 'color'),
                        } : null]}>
                        {this.state.title ?
                            <View>
                                <Text style={GlobalVariables.TextStyle('v', 'l', 'dp')}>{this.state.title}</Text>
                                <View style={styles.separator}/>
                            </View>
                            : null}
                        {this.state.message ?
                            <View>
                                <Text style={GlobalVariables.TextStyle('v', null, 'dp')}>{this.state.message}</Text>
                                <View style={styles.separator}/>
                            </View>
                            : null}
                        <View style={styles.separator}/>
                        {this.state.extraAlertButtons.map((a, k) => {
                            return (
                                <View key={k}>
                                    <TouchableOpacity style={styles.chooseOptions} onPress={() => a.onPress()}>
                                        <Icon type={a.iconType || 'Feather'}
                                              style={[GlobalVariables.TextStyle(null, null, 't'), a.style]}
                                              name={a.iconName || 'alert-triangle'}
                                              size={GlobalVariables.DefaultIconSize}/>
                                        <View style={{flex: 1}}>
                                            <Text
                                                style={[GlobalVariables.TextStyle('v', 'me', 't'), {marginLeft: 10}]}>
                                                {a.message}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.separator}/>
                                </View>
                            );
                        })}
                        {this.props.customCancelButton ? null :
                            <View style={styles.chooseOptions}>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity onPress={() => this.closeModal()} style={{
                                    backgroundColor: GlobalVariables.RedColor(),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 10,
                                    borderRadius: GlobalVariables.BorderRadius,
                                }}>
                                    <Text style={[GlobalVariables.TextStyle('v', 'me', 't'), {
                                        color:'white'
                                    }]}>
                                        انصراف
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        width: GlobalVariables.DeviceWidth,
        height: GlobalVariables.DeviceHeight,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        width: '80%',
        ...GlobalVariables.DefaultShadow,
        padding: 15,
    },
    separator: {
        height: 10,
    },
    blur: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: 'black',
        opacity: 0.1,
    },
    chooseOptions: {
        flexDirection: 'row',
        padding: 5,
    },
});
