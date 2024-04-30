import React, {Component} from 'react';
import {View, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';

import GlobalVariables from '../../Modules/GlobalVariables';

import Icon from '../../Components/Icon/Icon';

export default class Alert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            showIcon: false,
        };
    }

    componentDidMount() {
        const {modalVisible, iconType, iconName} = this.props;
        this.setState({modalVisible, iconType, iconName, showIcon: true});
    }

    componentDidUpdate() {
        if (this.props.visible !== this.state.modalVisible) {
            this.setState({modalVisible: this.props.visible});
        }
    }

    closeModal() {
        // this.setState({modalVisible: false})
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
                        <View style={styles.chooseOptions}>
                            <Icon type={this.props.iconType || 'Feather'} name={this.props.iconName || 'alert-triangle'}
                                  size={GlobalVariables.MediumIconSize}
                                  style={GlobalVariables.TextStyle(null, null, 't')}/>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={styles.separator}/>
                        <Text style={[GlobalVariables.TextStyle('v', 'me', 't'), {marginLeft: 10}]}>
                            {this.props.message}
                        </Text>
                        <View style={styles.separator}/>
                        <View style={styles.chooseOptions}>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity onPress={() => this.closeModal()}>
                                <Text style={[GlobalVariables.TextStyle('v', 'me', 't'), {
                                    marginRight: 10,
                                }]}>
                                    باشه
                                </Text>
                            </TouchableOpacity>
                        </View>
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
