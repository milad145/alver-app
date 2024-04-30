import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';

import {NavigationService} from '../../../Services/NavigationService';
import {UserService} from '../../../Services/UserService';
import {PostService} from '../../../Services/PostService';

import Icon from '../../../Components/Icon/Icon';
import AdvanceAlert from '../../../Components/Alert/AdvanceAlert';
import Map from '../../../Components/Map/Map';
import LightMap from '../../../Components/Map/LightMap';
import UploadProgressBar from '../../../Components/ProgressBar/UploadProgressBar';
import Loader from '../../../Components/Loader/Loader';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advanceAlertModalVisible: false,
            extraAlertButtons: [],
            mapModalVisible: false,
            isUploading: false,
        };
        this.selectMap = this.selectMap.bind(this);
    }

    componentDidMount() {
        const {post} = this.props.route.params;
        let newState = {post};
        if (post.location) {
            post.location = JSON.parse(JSON.stringify(post.location));
            newState.selectedLocation = {...post.location, latitudeDelta: 0.1, longitudeDelta: 0.1};
        }
        this.setState(newState);
        if (post.city) {
            this.setCity(post.city);
        } else {
            UserService.getCity()
                .then(city => {
                    this.setCity(city);
                })
                .catch(error => console.error(error));
        }

    }

    componentDidUpdate() {
        if (this.props.route.params.city && !_.isEqual(this.state.city, this.props.route.params.city)) {
            this.setCity(this.props.route.params.city);
        }
    }

    setCity(city) {
        let {longitude, latitude} = city;
        let locationCoordinate = {longitude, latitude, latitudeDelta: 0.1, longitudeDelta: 0.1};
        this.setState({city, locationCoordinate});
    }

    selectMap() {
        if (this.state.selectedLocation) {
            this.openMapEditor();
        } else {
            this.openMapModal();
        }
    }

    openMapModal() {
        this.setState({mapModalVisible: true, advanceAlertModalVisible: false});
    }

    openMapEditor() {
        let extraAlertButtons = [
            {
                message: 'حذف',
                iconName: 'trash-2',
                iconType: 'Feather',
                onPress: () => this.setState({selectedLocation: null, advanceAlertModalVisible: false}),
            }, {
                message: 'ویرایش',
                iconName: 'crop-rotate',
                iconType: 'MaterialCommunityIcons',
                onPress: () => this.openMapModal(),
            },
        ];
        this.setState({
            advanceAlertModalVisible: true,
            extraAlertButtons,
            advanceAlertTitle: 'محدوده روی نقشه',
        });
    }

    setMapLocation(selectedLocation) {
        this.setState({selectedLocation, mapModalVisible: false});
    }

    uploadPost() {
        if (!this.state.isUploading) {
            // this.setState({isUploading: true});
            let {city, selectedLocation} = this.state;
            let post = this.state.post;
            post.city = city;
            if (selectedLocation) {
                post.location = {
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                };
            } else {
                delete post.location;
            }
            if (post._id) {
                GlobalVariables.SetUploadStatus(true);
                PostService.edit(post, this.props.navigation);
                NavigationService.navigate(this.props.navigation, 'MyPosts', {});
            } else {
                GlobalVariables.SetUploadStatus(true);
                PostService.send(post, this.props.navigation);
                NavigationService.navigate(this.props.navigation, 'MyPosts', {});
            }
        }
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <ScrollView style={{paddingRight: 15, paddingLeft: 15}}>
                    <View style={[styles.separator, {borderBottomWidth: 0}]}/>
                    <View style={[styles.filedWrapper]}>
                        <TouchableOpacity style={styles.rowFlex}
                                          onPress={() => NavigationService.navigate(this.props.navigation, 'SelectCity', {
                                              back: true, screen: 'Contact', changeUserCity: false,
                                          })}>
                            <View style={styles.main}>
                                <Text
                                    style={[GlobalVariables.TextStyle('v', 'me1', 't')]}>
                                    نمایش آگهی در این شهر
                                </Text>
                            </View>
                            <Text
                                style={[GlobalVariables.TextStyle('m', 'me', 't'),{
                                    backgroundColor:'rgba(0,0,0,.1)',padding:10,borderRadius:5
                                }]}>
                                {this.state.city ? `${this.state.city.label} - ${this.state.city.parentLabel}` : ''}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={[GlobalVariables.TextStyle('l', 's', 't'), styles.catFieldName, styles.margin]}>
                        آگهی شما در بین آگهی‌های این شهر نمایش داده خواهد شد.
                    </Text>
                    <View style={styles.separator}/>
                    <View style={[styles.filedWrapper]}>
                        <Text
                            style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName, styles.margin]}>
                            انتخاب محدوده آگهی روی نقشه
                        </Text>
                        <Text
                            style={[GlobalVariables.TextStyle('l', 's', 't'), styles.catFieldName, styles.margin]}>
                            با انتخاب محدوده، آگهی شما با نقشه نمایش داده می‌شود.
                        </Text>
                        <TouchableOpacity onPress={this.selectMap}>
                            {this.state.selectedLocation ?
                                <View style={styles.locationView}>
                                    <LightMap selectedLocation={this.state.selectedLocation}/>
                                </View>
                                :
                                <View
                                    style={[styles.locationView, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'statusBar')}]}>
                                    <Icon style={GlobalVariables.TextStyle(null, null, 'p')}
                                          size={GlobalVariables.BiggestIconSize} type="MaterialIcons"
                                          name="edit-location"/>
                                    <Text
                                        style={[GlobalVariables.TextStyle('v', 'xxl', 'p')]}>افزودن
                                        محدوده روی نقشه</Text>
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View
                    style={[styles.footer, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    <UploadProgressBar/>
                    <View style={styles.footerButtons}>
                        <View style={styles.footerElement}/>
                        <TouchableOpacity style={[styles.footerButton, styles.footerElement]}
                                          onPress={() => this.uploadPost()}>
                            {this.state.isUploading ?
                                <Loader type="refresh"
                                        color={GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}/>
                                :
                                <Text style={[styles.footerButtonText]}>ثبت آگهی</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <AdvanceAlert extraAlertButtons={this.state.extraAlertButtons}
                              title={this.state.advanceAlertTitle}
                              visible={this.state.advanceAlertModalVisible}
                              closeModal={() => this.setState({advanceAlertModalVisible: false})}/>
                {
                    (this.state.locationCoordinate && this.state.locationCoordinate.latitude && this.state.locationCoordinate.longitude) ?
                        <Map visible={this.state.mapModalVisible}
                             setMapLocation={(selectedLocation) => this.setMapLocation(selectedLocation)}
                             selectedLocation={this.state.selectedLocation}
                             locationCoordinate={this.state.locationCoordinate}
                             closeModal={() => this.setState({mapModalVisible: false})}/>
                        : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    filedWrapper: {
        width: '100%',
        padding: 5,
        paddingTop: 0,
        paddingBottom: 0,
    },
    main: {
        flex: 1,
    },
    rowFlex: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    separator: {
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
    catFieldName: {flex: 1},
    margin: {
        marginTop: 8,
        marginBottom: 8,
    },
    addressInput: {
        flex: 1,
        height: '100%',
    },
    addressView: {
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationView: {
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    footer: {
        ...GlobalVariables.DefaultShadow,
        padding: 10,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        width: '45%',
    },
});
