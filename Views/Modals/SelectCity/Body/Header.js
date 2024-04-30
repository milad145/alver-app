import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import Modal, {ModalContent, ScaleAnimation} from 'react-native-modals';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {NavigationService} from '../../../Services/NavigationService';
import Icon from '../../../Components/Icon/Icon';


export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {back: false, helpModal: false};
    }

    componentDidMount() {
        let newState = {};
        const {back, province} = this.props.route.params;
        if (back) {
            newState.back = true;
        }
        if (province) {
            newState.province = province;
        }
        this.setState(newState);
    }

    closeModal() {
        this.setState({helpModal: false});
    }

    helpModal() {
        return (
            <Modal
                useNativeDriver={true}
                width={0.9}
                visible={this.state.helpModal}
                onTouchOutside={() => this.closeModal()}
                modalAnimation={new ScaleAnimation({
                    initialValue: 0, // optional
                    useNativeDriver: true, // optional
                })}
                onHardwareBackPress={() => {
                    this.closeModal();
                    return true;
                }}
                modalStyle={{
                    backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor'),
                    borderWidth: 1,
                    borderColor: 'white',
                }}
                modalTitle={
                    <View style={styles.deleteModal_header}>
                        <Text style={[GlobalVariables.TextStyle('v', 'l', 't')]}>
                            اگر شهر مورد نظر شما در فهرست وجود ندارد، یکی از شهرهای نزدیک را انتخاب کنید.
                        </Text>
                    </View>
                }
            >
                <ModalContent>
                    <View style={styles.separator}/>
                    <TouchableOpacity style={GlobalVariables.DefaultButtonsOutLine} onPress={() => this.closeModal()}>
                        <Text style={GlobalVariables.DefaultButtonsOutLineText}>باشه</Text>
                    </TouchableOpacity>
                </ModalContent>
            </Modal>
        );
    }

    render() {
        return (
            <View style={[styles.body, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                {
                    this.state.back ?
                        <TouchableOpacity style={styles.icons}
                                          onPress={() => NavigationService.goBack(this.props.navigation)}>
                            <Icon size={GlobalVariables.MediumIconSize}
                                  style={GlobalVariables.TextStyle(null, null, 't')} name="arrow-right" type="Feather"/>
                        </TouchableOpacity>
                        :
                        null
                }
                <Text numberOfLines={1}
                      style={[GlobalVariables.TextStyle('b', 'xl', 't'), styles.titleText]}>{this.state.province ? 'شهر' : 'استان'} خود
                    را انتخاب کنید{this.state.province ? `(${this.state.province.label})` : ''}</Text>
                <TouchableOpacity style={styles.icons}
                                  onPress={() => this.setState({helpModal: true})}>
                    <Icon size={GlobalVariables.MediumIconSize}
                          style={GlobalVariables.TextStyle(null, null, 't')} name="infocirlceo" type="AntDesign"/>
                </TouchableOpacity>
                {this.helpModal()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        height: GlobalVariables.HeaderHeight,
        ...GlobalVariables.DefaultShadow,
        alignItems: 'center',
        flexDirection: 'row',
    },
    titleText: {
        flex: 1,
        padding: 10,
    },
    icons: {
        height: '100%', justifyContent: 'center', padding: 10,
    },
    deleteModal_header: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    separator: {
        borderTopWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        marginBottom: 10,
    },
});
