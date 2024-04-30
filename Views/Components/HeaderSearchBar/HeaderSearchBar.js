import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import _ from 'lodash';

import {NavigationService} from '../../Services/NavigationService';

import GlobalVariables from '../../Modules/GlobalVariables';

import Icon from '../Icon/Icon';

export default class HeaderSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
        };
    }

    componentDidMount() {
        const {title, cat} = this.props;
        let newState = {};
        if (title) {
            newState.title = title;
        }
        if (cat) {
            newState.cat = cat;
        }
        if (Object.keys(newState).length) {
            this.setState(newState);
        }
    }

    componentDidUpdate() {
        const {title, cat} = this.props;
        let newState = {};
        if (this.state.title !== title) {
            newState.title = title;
        }
        if (!_.isEqual(this.state.cat, cat)) {
            newState.cat = cat;
        }
        if (Object.keys(newState).length) {
            this.setState(newState);
        }
    }

    search() {
        NavigationService.navigate(this.props.navigation, 'Search', {
            searchKey: this.state.title,
            cat: this.state.cat,
        });
    }

    render() {
        return (
            <View style={styles.search}>

                <TouchableOpacity style={styles.searchBar}
                                  onPress={() => this.search()}>
                    {this.state.title && this.state.title.length ?
                        <Text style={GlobalVariables.TextStyle('v', 'l', 't')}>{this.state.title}</Text>
                        :
                        <Text style={GlobalVariables.TextStyle('m', 'm1', 'p')}>جستجو در همه آگهی‌ها</Text>
                    }
                </TouchableOpacity>
                <View style={styles.iconWrapper}>
                    <TouchableOpacity
                        onPress={() => this.search()}>
                        <Icon style={{
                            transform: [{rotateY: '180deg'}],
                            color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color'),
                        }} name="search" type="MaterialIcons"
                              size={28}/>
                    </TouchableOpacity>
                    {this.props.location ?
                        <TouchableOpacity
                            onPress={() => NavigationService.navigate(this.props.navigation, 'SelectCity', {
                                back: true, changeUserCity: true,
                            })}>
                            <Icon style={{
                                transform: [{rotateY: '180deg'}],
                                color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color'),
                            }} name="location-pin" type="MaterialIcons" size={GlobalVariables.MediumIconSize}/>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    search: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        borderColor: GlobalVariables.BorderColor,
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: GlobalVariables.BorderRadius,
    },
    searchBar: {
        height: '100%',
        justifyContent: 'center',
        flex: 1,
    },
    iconWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
