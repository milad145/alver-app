import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {listToTree} from '../../../Modules/Assets';

import {NavigationService} from '../../../Services/NavigationService';
import {UserService} from '../../../Services/UserService';

import Loader from '../../../Components/Loader/Loader';
import Icon from '../../../Components/Icon/Icon';
import {ToastService} from '../../../Services/ToastService';
import {CityService} from '../../../Services/CityService';
import NetworkError from '../../../Components/NetworkError/NetworkError';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: '',
            locationData: [],
            allLocations: [],
            list: {key: 0, items: []},
            getOnReachEnd: true,
            networkError: false,
        };
    }

    componentDidMount() {
        UserService.getCity()
            .then(payload => {
                this.setState({city: payload});
                this.setAllPlaces(this.props.route.params.province);
            })
            .catch(() => this.setAllPlaces(this.props.route.params.province));
    }

    setAllPlaces(province = null) {
        if (province) {
            let allLocations = _.sortBy(province.children, 'label');
            const locationType = 'city';
            const myProvince = {_id: province._id, label: province.label};
            let {selectProvinceAllCity} = this.props.route.params;
            if (selectProvinceAllCity) {
                allLocations = [{
                    '_id': province._id,
                    'label': 'همه شهرها',
                    'latitude': province.latitude,
                    'longitude': province.longitude,
                    'parent': province._id,
                    'children': [],
                }, ...allLocations];
            }
            this.setState({allLocations, locationType, myProvince});
            this.search('');
        } else {
            this.downloadCities();
        }
    }

    downloadCities(key = '') {
        this.setState({getOnReachEnd: true, networkError: false});
        CityService.cityList(this.props.navigation)
            .then(payload => {
                const allLocations = _.sortBy(listToTree(payload.data.result), 'label');
                const locationType = 'province';
                this.setState({allLocations, locationType, networkError: false, getOnReachEnd: true});
                this.search(key);
            })
            .catch(error => {
                if (error.type === 'request') {
                    this.setState({networkError: true, getOnReachEnd: false});
                } else if (error.type === 'response') {
                    ToastService.show(error.data.message, 3000, 'c');
                }
            });
    }

    search(key = '') {
        if (this.state.networkError) {
            this.downloadCities(key);
        } else {
            let getOnReachEnd = true;
            this.setState({key, getOnReachEnd: true});
            let locationData = _.filter(this.state.allLocations, function (o) {
                return o.label.search(key) > -1;
            });
            locationData = _.chunk(locationData, 10);
            if (!locationData[0]) {
                getOnReachEnd = false;
            }
            this.setState({locationData, getOnReachEnd, list: {key: 1, items: locationData[0]}});
        }
    }

    onReachEnd() {
        if (this.state.getOnReachEnd) {
            let list = this.state.list;
            if (this.state.locationData[list.key]) {
                list.items = _.unionBy(list.items, this.state.locationData[list.key], '_id');
                list.key += 1;
                this.setState({list});
            } else {
                this.setState({getOnReachEnd: false});
            }
        }
    }

    selectPlace(place) {
        if (this.state.locationType === 'province') {
            NavigationService.push(this.props.navigation, 'SelectCity', {
                back: true,
                province: place, ...this.props.route.params,
            });
        } else {
            let city = {
                _id: place._id,
                label: place.label,
                latitude: place.latitude,
                longitude: place.longitude,
                parentId: this.state.myProvince._id,
                parentLabel: this.state.myProvince.label,
            };
            if (this.props.route.params.changeUserCity) {
                UserService.setCity(city)
                    .then(() => {
                        //todo : send only city value
                        GlobalVariables.SetCity(city);
                        NavigationService.reset(this.props.navigation, 'Main', {city});
                    });
            } else {
                NavigationService.navigate(this.props.navigation, this.props.route.params.screen, {city});
            }
        }
    }

    clearSearch() {
        this.search();
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <View
                    style={[styles.searchView, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor_circleIcon')}]}>
                    <TextInput
                        placeholder={this.state.locationType === 'city' ? 'جستجوی شهر' : 'جستجوی استان'}
                        value={this.state.key}
                        keyboardType="default"
                        autoCorrect={false}
                        onChangeText={(key) => this.search(key)}
                        returnKeyType="search"
                        style={[styles.searchInput, GlobalVariables.TextStyle('v', 'xl')]}
                    />
                    <TouchableOpacity onPress={() => this.clearSearch()}>
                        <Icon name={this.state.key === '' ? 'search' : 'clear'} style={{padding: 10}}
                              size={GlobalVariables.MediumIconSize} type="MaterialIcons"/>
                    </TouchableOpacity>
                </View>
                {this.state.networkError ?
                    <NetworkError onPress={() => this.downloadCities()}/>
                    :
                    <FlatList
                        ref={(ref) => this.ListView_Ref = ref}
                        showsVerticalScrollIndicator={false}
                        data={this.state.list.items}
                        keyExtractor={(item) => (item._id + '' + Math.random())}
                        removeClippedSubviews={true}
                        initialNumToRender={7}
                        onEndReached={this.onReachEnd.bind(this)}
                        renderItem={({item}) => (
                            item.type === 'header' ?
                                <Text
                                    style={[GlobalVariables.TextStyle('b', 'xxl', 't'), styles.title]}>
                                    {item.text}
                                </Text>
                                :
                                <TouchableOpacity onPress={() => this.selectPlace(item)}
                                                  style={[styles.citySelector, this.state.city && ((this.state.locationType === 'city' && this.state.city._id === item._id) || (this.state.locationType === 'province' && this.state.city.parentId === item._id)) ? {
                                                      backgroundColor: GlobalVariables.BrandColor(),
                                                      paddingLeft: 20,
                                                  } : null]}>
                                    <Text
                                        style={[GlobalVariables.TextStyle('v', 'l', 't'), styles.cityText, this.state.city && ((this.state.locationType === 'city' && this.state.city._id === item._id) || (this.state.locationType === 'province' && this.state.city.parentId === item._id)) ? {
                                            color: 'white',
                                        } : null]}>{item.label}</Text>
                                    {/*<View style={styles.cityIcon}>*/}
                                    {/*{this.state.city && [this.state.city._id, this.state.city.parentId].includes(item._id) ?*/}
                                    {/*<Icon name="my-location" type="MaterialIcons"/>*/}
                                    {/*: null}*/}
                                    {/*</View>*/}
                                </TouchableOpacity>
                        )}
                        ListFooterComponent={() => (
                            this.state.getOnReachEnd ?
                                <View style={{height: GlobalVariables.FooterHeight}}>
                                    <Loader type="refresh" color="#888"/>
                                </View>
                                :
                                null
                        )}
                        // ItemSeparatorComponent={() => <View style={styles.separator}/>}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    cityText: {
        flex: 1,
    },
    title: {
        marginBottom: 10,
        marginTop: 10,
    },
    citySelector: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: GlobalVariables.BorderRadius,
    },
    cityIcon: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInput: {
        flex: 1,
        height: '100%',
    },
    searchView: {
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        borderRadius: GlobalVariables.BorderRadius,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
});
