import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';

import _ from 'lodash';
import CheckBox from '@react-native-community/checkbox';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {DivideNumber3Digits, latinNumToPersianNum} from '../../../Modules/Assets';

import {NavigationService} from '../../../Services/NavigationService';

import Data from '../../../Assets/Data/Data';

import FieldsModal from '../../../Components/FieldsType/FieldsModal';
import {FieldService} from '../../../Services/FieldService';
import {ToastService} from '../../../Services/ToastService';
import NetworkError from '../../../Components/NetworkError/NetworkError';
import Loader from '../../../Components/Loader/Loader';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true,
            fields: [],
            params: {},
            fieldsValue: {},
            fieldsModalsVisible: false,
            currentField: {},
            networkError: false,
            showLoader: true,
        };
    }

    componentDidMount() {
        let newState = {params: this.props.route.params};
        this.setState(newState);
        this.getFields(this.props.route.params.cat);
    }

    updateFields() {
        let {fieldsValue: values} = this.state.params;
        let {fields} = this.state;
        if (values) {
            let fieldsValue = {};
            fields.map(f => {
                if (values[f.name]) {
                    let value = {value: values[f.name].v, unit: null, title: null};
                    switch (f.type) {
                        case 'number':
                            if (f.unit) {
                                if (f.unit.length > 1) {
                                    value.unit = _.find(f.unit, {name: values[f.name].u});
                                } else if (f.unit.length) {
                                    value.unit = f.unit[0];
                                }
                            }
                            value.title = latinNumToPersianNum(DivideNumber3Digits(value.value));
                            break;
                        case 'select':
                            value.title = _.find(f.options, {value: value.value}).title;
                            break;
                    }
                    fieldsValue[f.name] = value;
                }
            });
            this.setState({fieldsValue});
        }
    }

    getFields(cat) {
        this.setState({showLoader: true, networkError: false});
        FieldService.catFields(cat._id, this.props.navigation)
            .then(payload => {
                let fields = payload.data.result;
                this.setState({fields, networkError: false, showLoader: false});
                this.updateFields();
            })
            .catch(error => {
                if (error.type === 'request') {
                    this.setState({networkError: true, showLoader: false});
                } else if (error.type === 'response') {
                    ToastService.show(error.data.message, 3000, 'c');
                }
            });
    }

    showFieldsModal(currentField) {
        this.setState({fieldsModalsVisible: true, currentField});
    }

    closeFieldsModal() {
        this.setState({fieldsModalsVisible: false});
    }

    setField(field) {
        let value = {value: null, title: null};
        let fieldsValue = this.state.fieldsValue;
        switch (field.type) {
            case 'boolean':
                value = {value: fieldsValue[field.name] ? !(fieldsValue[field.name].value) : true};
                break;
            case 'select':
            case 'number':
                value = {value: field.value, title: field.title, unit: field.unit};
                this.closeFieldsModal();
                break;
        }
        if (value.value) {
            fieldsValue[field.name] = value;
        } else {
            delete fieldsValue[field.name];
        }
        this.setState({fieldsValue});
    }

    fillField(field) {
        switch (field.type) {
            case 'boolean':
                this.setField(field);
                break;
            case 'select':
            case 'number':
                this.showFieldsModal(field);
                break;
        }
    }

    next() {
        let {params, fieldsValue} = this.state;
        params.fieldsValue = {};
        Object.keys(fieldsValue).map(f => {
            let obj = {v: fieldsValue[f].value};
            if (fieldsValue[f].unit) {
                obj.u = fieldsValue[f].unit.name;
            }
            params.fieldsValue[f] = obj;
        });
        if (!params._id) {
            GlobalVariables.SetPost(params);
        }
        NavigationService.navigate(this.props.navigation, 'Contact', {post: params});
    }


    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {this.state.networkError ? <NetworkError onPress={() => this.getFields(this.state.params.cat)}/>
                    :
                    this.state.showLoader ?
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Loader type="refresh" color="#888"/>
                        </View>
                        :
                        < ScrollView style={{paddingRight: 15, paddingLeft: 15}}>
                            <View style={{minHeight: GlobalVariables.DeviceHeight * 0.5}}>
                                <View style={[styles.separator, {borderBottomWidth: 0}]}/>
                                {this.state.fields.map(f => {
                                    return (
                                        <View style={[styles.filedWrapper]} key={f._id}>
                                            <TouchableOpacity onPress={() => this.fillField(f)} style={styles.rowFlex}>
                                                <View style={styles.main}>
                                                    <Text
                                                        style={[GlobalVariables.TextStyle('v', 'me', 't')]}>
                                                        {f.title}
                                                    </Text>
                                                </View>
                                                {['boolean'].includes(f.type) ?
                                                    <CheckBox
                                                        value={this.state.fieldsValue[f.name] ? this.state.fieldsValue[f.name].value : false}
                                                        onValueChange={() => this.fillField(f)}
                                                        tintColors={{true: GlobalVariables.BrandColor()}}
                                                    />
                                                    :
                                                    (this.state.fieldsValue[f.name] && !_.isNull(this.state.fieldsValue[f.name].value)) ?
                                                        <Text
                                                            style={[GlobalVariables.TextStyle('m', 'l', 't')]}>
                                                            {f.type === 'number' && this.state.fieldsValue[f.name].value ?
                                                                latinNumToPersianNum(DivideNumber3Digits(this.state.fieldsValue[f.name].value)) + (f.unit ? f.unit.length > 1 ? ' ' + this.state.fieldsValue[f.name].unit.title : ' ' + f.unit[0].title : '')
                                                                : f.type === 'number' ?
                                                                    <Text
                                                                        style={[GlobalVariables.TextStyle('l', 'me', 'p')]}>
                                                                        {f.placeholder}
                                                                    </Text>
                                                                    : this.state.fieldsValue[f.name].title
                                                            }
                                                        </Text>
                                                        :
                                                        <Text
                                                            style={[GlobalVariables.TextStyle('l', 'me1', 'p')]}>
                                                            {f.placeholder}
                                                        </Text>
                                                }
                                            </TouchableOpacity>
                                            <View style={styles.separator}/>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={styles.footer}>
                                <View style={styles.footerElement}/>

                                <TouchableOpacity style={[styles.footerButton, styles.footerElement]}
                                                  onPress={() => this.next()}>
                                    <Text style={[styles.footerButtonText]}>ادامه</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.separator, {borderBottomWidth: 0}]}/>
                        </ScrollView>
                }
                <FieldsModal fieldsValue={this.state.fieldsValue[this.state.currentField.name]}
                             setField={(field) => this.setField(field)}
                             field={this.state.currentField}
                             visible={this.state.fieldsModalsVisible}
                             closeFieldsModal={() => this.closeFieldsModal()}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
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
    filedWrapper: {
        width: '100%',
        padding: 5,
        paddingTop: 10,
        paddingBottom: 10,
    },
    rowFlex: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        flex: 1,
    },
});
