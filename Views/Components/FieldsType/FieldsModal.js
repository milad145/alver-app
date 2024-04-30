import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput} from 'react-native';

import _ from 'lodash';
import Modal, {ModalContent, SlideAnimation, ScaleAnimation} from 'react-native-modals';

import GlobalVariables from '../../Modules/GlobalVariables';
import {
    latinNumToPersianNum,
    DivideNumber3Digits,
    Concat3DigitsNumber,
} from '../../Modules/Assets';
import RadioButtons from '../RadioButtons/RadioButtons';


export default class FieldsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            fieldsValue: {},
            unitValue: {},
        };
    }

    componentDidMount() {
        this.setState({modalVisible: this.props.visible});
    }

    componentDidUpdate() {
        if ((this.props.visible !== this.state.modalVisible) || (!_.isEqual(this.state.field, this.props.field))) {
            let unitValue = {};
            if (this.props.field.unit) {
                if (this.props.field.unit.length > 1) {
                    unitValue = _.find(this.props.field.unit, {default: true});
                } else if (this.props.field.unit.length) {
                    unitValue = this.props.field.unit[0];
                }
            }
            this.setState({
                modalVisible: this.props.visible,
                field: this.props.field,
                inputValue: this.props.fieldsValue ? this.props.fieldsValue.value : '',
                unitValue,
            });
        }
    }

    closeModal() {
        this.props.closeFieldsModal();
    }

    selectValue(type, value, title, name, unit) {
        this.props.setField({type, value, title, name, unit});
    }

    submitNumber() {
        this.selectValue('number', parseInt(Concat3DigitsNumber(this.state.inputValue)), latinNumToPersianNum(this.state.inputValue), this.state.field.name, this.state.unitValue);
    }

    renderModalTitle() {
        let title = '';
        if (this.state.field) {
            switch (this.state.field.name) {
                case 'gender':
                    title = `جنسیت را انتخاب کنید`;
                    break;
                case 'old':
                    title = `سن را وارد کنید (${this.state.unitValue.title} || '')`;
                    break;
                case 'price':
                    title = `قیمت را وارد کنید (${this.state.field.unit[0].title})`;
                    break;
                case 'weight':
                    title = `وزن را وارد کنید (${this.state.unitValue.title || ''})`;
                    break;
            }
        }
        return (
            <View style={styles.modal_header}>
                <Text style={[GlobalVariables.TextStyle('v', 'l', 't')]}>
                    {title}
                </Text>
                {this.state.field.unit && this.state.field.unit.length > 1 ?
                    <RadioButtons onChangeValue={(unitValue) => this.setState({unitValue})}
                                  options={this.state.field.unit}/>
                    : null}
            </View>
        );
    }

    renderModalContent() {
        return (
            <ModalContent>
                {
                    this.state.field.type === 'select' ?
                        <ScrollView style={{paddingRight: 0, paddingLeft: 0}}>
                            <View style={[styles.separator, {borderBottomWidth: 0}]}/>

                            {this.state.field.options.map(o => {
                                return (
                                    <View style={[styles.filedWrapper]} key={o.value}>
                                        <TouchableOpacity
                                            onPress={() => this.selectValue('select', o.value, o.title, this.state.field.name)}
                                            style={styles.rowFlex}>
                                            <Text
                                                style={[GlobalVariables.TextStyle('v', 'me1', 't')]}>
                                                {o.title}
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={[styles.separator, {borderBottomWidth: 0}]}/>
                                    </View>
                                );
                            })}
                            <View style={[styles.separator, {borderBottomWidth: 0}]}/>
                        </ScrollView>
                        :
                        <View style={[styles.filedWrapper]}>
                            <View
                                style={[styles.searchView, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor_circleIcon')}]}>
                                <TextInput
                                    value={DivideNumber3Digits(Concat3DigitsNumber(this.state.inputValue))}
                                    keyboardType="numeric"
                                    autoCorrect={false}
                                    onChangeText={(inputValue) => this.setState({inputValue: DivideNumber3Digits(Concat3DigitsNumber(inputValue))})}
                                    autoFocus={true}
                                    returnKeyType="go"
                                    style={GlobalVariables.TextStyle('v', 'xl')}
                                    onSubmitEditing={() => this.submitNumber()}
                                />
                            </View>
                            <View style={styles.footer}>
                                <TouchableOpacity style={[GlobalVariables.DefaultButtonsOutLine, styles.footerElement]}
                                                  onPress={() => this.closeModal()}>
                                    <Text style={[GlobalVariables.DefaultButtonsOutLineText]}>انصراف</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.footerButton, styles.footerElement]}
                                                  onPress={() => this.submitNumber()}>
                                    <Text style={[styles.footerButtonText]}>ثبت</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </ModalContent>
        );
    }

    render() {
        return (
            this.state.field ?
                this.state.field.type === 'select' ?
                    <Modal.BottomModal
                        useNativeDriver={true}
                        width={1}
                        visible={this.state.modalVisible}
                        onTouchOutside={() => this.closeModal()}
                        modalAnimation={new SlideAnimation({
                            initialValue: 0, // optional
                            useNativeDriver: true, // optional
                        })}
                        onHardwareBackPress={() => {
                            this.closeModal();
                            return true;
                        }}
                        swipeDirection={['up', 'down']} // can be string or an array
                        onSwipeOut={() => this.closeModal()}
                        modalTitle={this.renderModalTitle()}
                        modalStyle={{
                            backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor'),
                            borderWidth: 1,
                            borderColor: 'white',
                        }}
                    >
                        {this.renderModalContent()}
                    </Modal.BottomModal>
                    :
                    <Modal
                        useNativeDriver={true}
                        width={0.9}
                        visible={this.state.modalVisible}
                        onTouchOutside={() => this.closeModal()}
                        modalAnimation={new ScaleAnimation({
                            initialValue: 0, // optional
                            useNativeDriver: true, // optional
                        })}
                        onHardwareBackPress={() => {
                            this.closeModal();
                            return true;
                        }}
                        modalTitle={this.renderModalTitle()}
                        modalStyle={{
                            backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor'),
                            borderWidth: 1,
                            borderColor: 'white',
                        }}
                    >
                        {this.renderModalContent()}
                    </Modal>
                :
                null
        );
    }
}


const styles = StyleSheet.create({
    body: {
        width: '100%',
    },
    main: {
        flex: 1,
    },
    separator: {
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
    rowFlex: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    filedWrapper: {
        width: '100%',
        padding: 5,
        paddingTop: 0,
        paddingBottom: 0,
    },
    modal_header: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        width: '95%',
        alignSelf: 'center',
    },
    searchInput: {
        flex: 1,
        height: '100%',
    },
    searchView: {
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        flex: 0.4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 5,
    },
});
