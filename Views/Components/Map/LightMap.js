import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import _ from 'lodash';

import Icon from '../Icon/Icon';

import GlobalVariables from '../../Modules/GlobalVariables';

import MapDayStyle from '../../Assets/Data/MapDayStyle';
import MapNightStyle from '../../Assets/Data/MapNightStyle';

export default class LightMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: {
                latitude: 1,
                longitude: 1,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            },
            propLocation: {},
        };
    }

    componentDidMount() {
        this.setLocation(this.props.selectedLocation);
    }

    componentDidUpdate() {
        if (!_.isEqual(this.state.propLocation, this.props.selectedLocation) && this.props.selectedLocation) {
            this.setLocation(this.props.selectedLocation);
        }
    }


    setLocation(newLocation) {
        let {latitude, longitude, latitudeDelta, longitudeDelta} = newLocation;
        let {selectedLocation} = this.state;
        selectedLocation = JSON.parse(JSON.stringify(selectedLocation));
        selectedLocation.latitude = latitude;
        selectedLocation.longitude = longitude;
        if (latitudeDelta) {
            selectedLocation.latitudeDelta = latitudeDelta;
        }
        if (longitudeDelta) {
            selectedLocation.latitudeDelta = longitudeDelta;
        }

        this.setState({propLocation: newLocation, selectedLocation});
    }

    render() {
        return (
            <View style={styles.body}>
                {/*<Text>{this.state.selectedLocation.latitude}</Text>*/}
                <MapView
                    liteMode={true}
                    style={{flex: 1}}
                    customMapStyle={GlobalVariables.GetDarkMode() ? MapNightStyle : MapDayStyle}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={false}
                    region={this.state.selectedLocation}
                >
                    {this.state.selectedLocation ?
                        <Marker coordinate={this.state.selectedLocation}>
                            <Icon style={{color: GlobalVariables.RedColor()}}
                                  size={GlobalVariables.BigIconSize * 1.5} type="MaterialIcons" name="location-pin"/>
                        </Marker>
                        : null}
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        width: '100%', height: '100%',
    },
});
