import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


import GlobalVariables from '../../Modules/GlobalVariables';

import appConfig from '../../../config';

export default class Icon extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {name, size, type, imageType} = this.props;
        this.setState({name, size, type, imageType});
    }

    componentDidUpdate() {
        const {name} = this.props;
        if (name !== this.state.name) {
            this.setState({name});
        }
    }

    render() {
        return (
            this.state.type === 'MaterialIcons' ?
                <MaterialIcons style={this.props.style} name={this.state.name}
                               size={this.state.size || GlobalVariables.DefaultIconSize}/>
                : this.state.type === 'FontAwesome5' ?
                <FontAwesome5 style={this.props.style} name={this.state.name}
                              size={this.state.size || GlobalVariables.DefaultIconSize}/>
                : this.state.type === 'Ionicons' ?
                    <Ionicons style={this.props.style} name={this.state.name}
                              size={this.state.size || GlobalVariables.DefaultIconSize}/>
                    : this.state.type === 'MaterialCommunityIcons' ?
                        <MaterialCommunityIcons style={this.props.style} name={this.state.name}
                                                size={this.state.size || GlobalVariables.DefaultIconSize}/>
                        : this.state.type === 'Feather' ?
                            <Feather style={this.props.style} name={this.state.name}
                                     size={this.state.size || GlobalVariables.DefaultIconSize}/>
                            : this.state.type === 'AntDesign' ?
                                <AntDesign style={this.props.style} name={this.state.name}
                                           size={this.state.size || GlobalVariables.DefaultIconSize}/>
                                : this.state.type === 'Entypo' ?
                                    <Entypo style={this.props.style} name={this.state.name}
                                            size={this.state.size || GlobalVariables.DefaultIconSize}/>
                                    : this.state.type === 'SimpleLineIcons' ?
                                        <SimpleLineIcons style={this.props.style} name={this.state.name}
                                                         size={this.state.size || GlobalVariables.DefaultIconSize}/>
                                        : this.state.type === 'FontAwesome' ?
                                            <FontAwesome style={this.props.style} name={this.state.name}
                                                         size={this.state.size || GlobalVariables.DefaultIconSize}/>
                                            : this.state.type === 'Category' ?
                                                <Image
                                                    style={{
                                                        height: this.state.size || GlobalVariables.DefaultIconSize,
                                                        aspectRatio: 1, ...this.props.style,
                                                    }}
                                                    source={{uri: appConfig.url.api + 'category/' + this.state.name + (this.state.imageType === 'jpg' ? '.jpg' : '.png')}}/>
                                                :
                                                null
        );
    }
}
const styles = StyleSheet.create({});
