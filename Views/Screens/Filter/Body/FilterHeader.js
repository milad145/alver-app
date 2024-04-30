import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView, Text} from 'react-native';

import Modal, {ModalContent, SlideAnimation} from 'react-native-modals';
import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';

import {NavigationService} from '../../../Services/NavigationService';

import Icon from '../../../Components/Icon/Icon';
import HeaderSearchBar from '../../../Components/HeaderSearchBar/HeaderSearchBar';

export default class FilterHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            helpModal: false,
            city: GlobalVariables.GetCity(),
        };
    }

    componentDidMount() {
        const {searchKey, cat, city} = this.props.route.params;
        let newState = {};
        if (searchKey) {
            newState.searchKey = searchKey;
        }
        if (cat) {
            newState.cat = cat;
        }
        if (city) {
            newState.city = city;
        }
        this.setState(newState);
    }

    componentDidUpdate() {
        const {searchKey, cat, city} = this.props.route.params;
        let newState = {};
        if (this.state.searchKey !== searchKey) {
            newState.searchKey = searchKey;
        }
        if (!_.isEqual(this.state.cat, cat)) {
            newState.cat = cat;
        }
        if (!_.isEqual(this.state.city, city) && city) {
            newState.city = city;
        }
        if (Object.keys(newState).length) {
            this.setState(newState);
        }
    }

    closeModal() {
        this.setState({helpModal: false});
    }

    selectCategory() {
        this.closeModal();
        NavigationService.navigate(this.props.navigation, 'SelectCategory', {
            headerTitle: 'دسته آگهی را انتخاب کنید',
            back: true,
            type: 'Filter',
        });
    }

    selectCity() {
        this.closeModal();
        NavigationService.navigate(this.props.navigation, 'SelectCity', {
            back: true, screen: 'Filter', changeUserCity: false, selectProvinceAllCity: true,
        });
    }

    clearFilter() {
        this.closeModal();
        NavigationService.setParams(this.props.navigation, {cat: {}, city: GlobalVariables.GetCity()});
    }

    helpModal() {
        return (
            <Modal.BottomModal
                useNativeDriver={true}
                width={0.9}
                visible={this.state.helpModal}
                onTouchOutside={() => this.closeModal()}
                modalAnimation={new SlideAnimation({
                    initialValue: 0, // optional
                    useNativeDriver: true, // optional
                })}
                onHardwareBackPress={() => {
                    this.closeModal();
                    return true;
                }}
                modalTitle={
                    <View style={styles.deleteModal_header}>
                        <Text style={[GlobalVariables.TextStyle('v', 'l', 't')]}>
                            فیلتر کردن
                        </Text>
                        <TouchableOpacity onPress={() => this.clearFilter()}>
                            <Text
                                style={[GlobalVariables.TextStyle('v', 'l', 't'), {color: GlobalVariables.RedColor()}]}>
                                حذف فیلترها
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                modalStyle={{
                    backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor'),
                    borderWidth: 1,
                    borderColor: 'white',
                }}
                height={0.5}
                swipeDirection={['up', 'down']} // can be string or an array
                onSwipeOut={() => this.closeModal()}
            >
                <ModalContent>
                    <View style={styles.separator}/>
                    <ScrollView>
                        <TouchableOpacity onPress={() => this.selectCategory()}
                                          style={[styles.filedWrapper, styles.rowFlex]}>
                            <Text
                                style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName]}>
                                دسته بندی
                            </Text>
                            <Text
                                style={[GlobalVariables.TextStyle('v', 'me1', 'dp'), {
                                    backgroundColor: 'rgba(0,0,0,.1)', padding: 10, borderRadius: 5,
                                }]}>
                                {(this.state.cat && this.state.cat._id) ? this.state.cat.title : 'انتخاب کنید'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.filedWrapper, styles.rowFlex]}
                                          onPress={() => this.selectCity()}>
                            <Text
                                style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName]}>
                                انتخاب شهر
                            </Text>
                            <Text
                                style={[GlobalVariables.TextStyle('v', 'me1', 'dp'), {
                                    backgroundColor: 'rgba(0,0,0,.1)', padding: 10, borderRadius: 5,
                                }]}>
                                {this.state.city ? `${this.state.city.label} - ${this.state.city.parentLabel}` : 'انتخاب کنید'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </ModalContent>
            </Modal.BottomModal>
        );
    }

    render() {
        return (
            <View style={[styles.body, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                <View style={styles.logoParent}>
                    <TouchableOpacity style={styles.icons}
                                      onPress={() => NavigationService.goBack(this.props.navigation)}>
                        <Icon name="arrow-right" type="Feather" size={GlobalVariables.MediumIconSize}
                              style={{color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}/>
                    </TouchableOpacity>
                    <HeaderSearchBar cat={this.state.cat} title={this.state.searchKey}
                                     navigation={this.props.navigation}/>
                    <TouchableOpacity
                        style={[styles.icons, GlobalVariables.DefaultButtons, {paddingRight: 10, paddingLeft: 10}]}
                        onPress={() => this.setState({helpModal: true})}>
                        <Text
                            style={[GlobalVariables.DefaultButtonsText]}>فیلتر</Text>
                        {/*<Icon name="settings" size={GlobalVariables.MediumIconSize} type="Feather"*/}
                        {/*style={{color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}/>*/}
                    </TouchableOpacity>
                </View>
                {this.helpModal()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        height: GlobalVariables.HeaderHeight,
        ...GlobalVariables.DefaultShadow,
        justifyContent: 'center',
    },
    logoParent: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    icons: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    deleteModal_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    separator: {
        borderTopWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        marginBottom: 10,
    },
    searchBar: {
        flex: 1,
        height: '100%',
        borderWidth: 1,
        margin: 5,
    },
    filedWrapper: {
        width: '100%',
        padding: 5,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 10,
    },
    rowFlex: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    catFieldName: {flex: 1},
});
