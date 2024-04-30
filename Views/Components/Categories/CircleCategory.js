import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import GlobalVariables from '../../Modules/GlobalVariables';
import Icon from '../Icon/Icon';
import {NavigationService} from '../../Services/NavigationService';

export default class CircleCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setState({cat: this.props.cat});
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.body, GlobalVariables.GetDarkMode() ? {
                    borderWidth: 1,
                    borderColor: GlobalVariables.StyleMode(false, 'borderColor'),
                } : null]}
                onPress={() => NavigationService.navigate(this.props.navigation, 'Filter', {
                    cat: this.state.cat, back: true, searchKey: '',
                })}>
                <View style={{
                    width: '100%',
                    aspectRatio: 1,
                    borderRadius: GlobalVariables.BorderRadius,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    // padding: 2,
                }}>
                    {this.state.cat ?
                        <Icon style={{borderRadius: GlobalVariables.BorderRadius}} name={this.state.cat._id}
                              type="Category" imageType="jpg" size="100%"/>
                        : null}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        width: GlobalVariables.DeviceWidth / 5,
        aspectRatio: 1,
        borderWidth: 2,
        margin: 3,
        marginRight: 5,
        marginLeft: 5,
        borderRadius: GlobalVariables.BorderRadius,
        borderColor: "#009f00",
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    categoryImg: {
        width: '100%',
        aspectRatio: 1,
    },
});
