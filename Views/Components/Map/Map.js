import React, {Component} from 'react';
import {View, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';


import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import GeoLocation from '@react-native-community/geolocation';
import _ from 'lodash';

import GlobalVariables from '../../Modules/GlobalVariables';

import Icon from '../../Components/Icon/Icon';

import {ToastService} from '../../Services/ToastService';

import MapNightStyle from '../../Assets/Data/MapNightStyle';
import MapDayStyle from '../../Assets/Data/MapDayStyle';

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }

    componentDidMount() {
        const {modalVisible} = this.props;
        this.setState({modalVisible});
        // this.getMyLocation();
    }

    getMyLocation() {
        GeoLocation.getCurrentPosition(info => {
            let {locationCoordinate} = this.state;
            if (locationCoordinate) {
                locationCoordinate = JSON.parse(JSON.stringify(locationCoordinate));
            } else {
                locationCoordinate = {};
            }
            locationCoordinate.latitude = info.coords.latitude;
            locationCoordinate.longitude = info.coords.longitude;
            locationCoordinate.longitudeDelta = 0.01;
            locationCoordinate.latitudeDelta = 0.01;
            this.setState({
                locationCoordinate,
                selectedLocation: locationCoordinate,
                myLocation: locationCoordinate,
            });
        }, error => {
            if (error.code === 2) {
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                    interval: 10000,
                    fastInterval: 5000,
                })
                    .catch(() => {
                        ToastService.show('لطفا GPS گوشی خود را روشن کنید.', 3000, 'c');
                        // The user has not accepted to enable the location services or something went wrong during the process
                        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
                        // codes :
                        //  - ERR00 : The user has clicked on Cancel button in the popup
                        //  - ERR01 : If the Settings change are unavailable
                        //  - ERR02 : If the popup has failed to open
                        //  - ERR03 : Internal error
                    });
            }

        });
    }

    componentDidUpdate() {
        if (this.props.visible !== this.state.modalVisible) {
            let update = {modalVisible: this.props.visible};
            if (this.props.selectedLocation) {
                update.locationCoordinate = this.props.selectedLocation;
            } else {
                update.selectedLocation = null;
                if (this.props.locationCoordinate) {
                    update.locationCoordinate = this.props.locationCoordinate;
                } else {
                    this.getMyLocation();
                }
            }
            this.setState(update);
        }
    }

    setMyLocation(e) {
        let {locationCoordinate} = this.state;
        locationCoordinate = JSON.parse(JSON.stringify(locationCoordinate));
        locationCoordinate.latitude = e.nativeEvent.coordinate.latitude;
        locationCoordinate.longitude = e.nativeEvent.coordinate.longitude;
        this.setState({selectedLocation: locationCoordinate});

    }

    closeModal() {
        this.props.closeModal();
    }

    setMapLocation() {
        if (this.state.selectedLocation) {
            let {latitude, longitude} = this.state.selectedLocation;
            this.props.setMapLocation({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } else {
            ToastService.show('لطفا موقعیت آگهی را مشخص کنید.', 3000, 'c');
        }
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.closeModal()}
            >
                <View
                    style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    <View style={[styles.header, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                        <TouchableOpacity style={{height: '100%', justifyContent: 'center', marginRight: 10}}
                                          onPress={() => this.closeModal()}>
                            <Icon name="arrow-right" type="Feather" style={GlobalVariables.TextStyle(null, null, 't')}
                                  size={GlobalVariables.DefaultIconSize}/>
                        </TouchableOpacity>
                        <Text
                            style={[GlobalVariables.TextStyle('b', 'xl', 't'), styles.headerTitleText]}>تعیین
                            موقعیت</Text>
                    </View>
                    <View style={styles.map}>
                        <MapView
                            customMapStyle={GlobalVariables.GetDarkMode() ? MapNightStyle : MapDayStyle}
                            style={{flex: 1}}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={false}
                            showsScale={false}
                            region={this.state.locationCoordinate}
                            onRegionChangeComplete={(locationCoordinate) => this.setState({locationCoordinate})}
                            onLongPress={(e) => this.setMyLocation(e)}
                            onPress={(e) => this.setMyLocation(e)}
                        >
                            {this.state.selectedLocation ?
                                <Marker draggable
                                        coordinate={this.state.selectedLocation}
                                        onDragEnd={(e) => this.setMyLocation(e)}
                                >
                                    <Icon style={{color: GlobalVariables.RedColor()}}
                                          size={GlobalVariables.BigIconSize * 1.5} type="MaterialIcons"
                                          name="location-pin"/>
                                </Marker> : null
                            }
                        </MapView>
                        <TouchableOpacity style={styles.myLocationButton}
                                          onPress={() => this.getMyLocation()}>
                            <Icon name="my-location" type="MaterialIcons" size={GlobalVariables.DefaultIconSize}/>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[styles.footer, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                        <TouchableOpacity style={[styles.footerButton, styles.footerElement]}
                                          onPress={() => this.setMapLocation()}>
                            <Text style={[styles.footerButtonText]}>ثبت موقعیت</Text>
                        </TouchableOpacity>
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
    },
    header: {
        height: GlobalVariables.HeaderHeight,
        ...GlobalVariables.DefaultShadow,
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: 'row',
    },
    headerTitleText: {
        marginLeft: 10,
        flex: 1,
    },
    map: {
        flex: 1,
    },
    footer: {
        ...GlobalVariables.DefaultShadow,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        width: '95%',
    },
    myLocationButton: {
        width: 30,
        aspectRatio: 1,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 10,
        left: 10, ...GlobalVariables.DefaultShadow,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
});
