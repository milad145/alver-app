import React, {Component} from 'react';
import {FlatList, StyleSheet, TextInput, TouchableOpacity, View, Text} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';

import {NavigationService} from '../../../Services/NavigationService';
import {HistoryService} from '../../../Services/HistoryService';

import Icon from '../../../Components/Icon/Icon';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchHistory: [],
            searchingSearchHistory: [],
            cat: {},
        };
    }

    componentDidMount() {
        let {searchKey, cat} = this.props.route.params;
        this.setState({cat});
        HistoryService.getSearchHistory()
            .then(searchHistory => {
                this.setState({searchHistory});
                this.onChangeSearchKey(searchKey);
            })
            .catch(() => this.onChangeSearchKey(searchKey));
    }

    pushSearchButton(searchKey = '', cat) {
        HistoryService.addToSearchHistory(searchKey, cat);
        NavigationService.navigate(this.props.navigation, 'Filter', {searchKey, cat: cat || {}});
    }

    onChangeSearchKey(searchKey) {
        let searchingSearchHistory = _.filter(this.state.searchHistory, function (sh) {
            return sh.searchKey.search(searchKey) > -1;
        });
        this.setState({searchKey, searchingSearchHistory});
    }

    deleteFromHistory(_id) {
        let {searchHistory} = this.state;
        HistoryService.deleteFromSearchHistory(_id);
        searchHistory = _.remove(searchHistory, (sh) => sh._id !== _id);
        this.setState({searchHistory});
        this.onChangeSearchKey(this.state.searchKey);
    }

    renderHeader() {
        return (
            <View style={[styles.header, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                <TouchableOpacity style={{height: '100%', justifyContent: 'center'}}
                                  onPress={() => NavigationService.goBack(this.props.navigation)}>
                    <Icon name="arrow-right" type="Feather" style={GlobalVariables.TextStyle(null, null, 't')}
                          size={GlobalVariables.MediumIconSize}/>
                </TouchableOpacity>
                <View style={styles.search}>
                    <View style={styles.searchBar}>
                        <TextInput
                            placeholder={'جستجو در آگهی‌ها'}
                            value={this.state.searchKey}
                            keyboardType="default"
                            autoCorrect={false}
                            autoFocus={true}
                            returnKeyType="search"
                            onChangeText={(searchKey) => this.onChangeSearchKey(searchKey)}
                            style={[styles.searchInput, GlobalVariables.TextStyle('v', 'me1', 't')]}
                            onSubmitEditing={() => this.pushSearchButton(this.state.searchKey, this.state.cat)}
                        />
                        {this.state.searchKey && this.state.searchKey !== '' ?
                            <TouchableOpacity style={styles.searchIcon}
                                              onPress={() => this.onChangeSearchKey('')}>
                                <Icon name="clear" type="MaterialIcons"
                                      style={GlobalVariables.TextStyle(null, null, 't')}
                                      size={GlobalVariables.MediumIconSize}/>
                            </TouchableOpacity>
                            : null}
                    </View>
                    <TouchableOpacity style={styles.searchIcon}
                                      onPress={() => this.pushSearchButton(this.state.searchKey, this.state.cat)}>
                        <Icon style={[GlobalVariables.TextStyle(null, null, 't'), {transform: [{rotateY: '180deg'}]}]}
                              name="search" type="MaterialIcons"
                              size={GlobalVariables.MediumIconSize}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderSearchHistory() {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.searchingSearchHistory}
                keyExtractor={(item) => (item._id)}
                style={{flex: 1, paddingLeft: 10, paddingRight: 10}}
                removeClippedSubviews={true}
                renderItem={({item}) => (
                    <View style={styles.separator}>
                        <View style={styles.searchHistory}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.pushSearchButton(item.searchKey, item.cat)}>
                                <Text
                                    style={GlobalVariables.TextStyle('v', 'me1', 't')}>{item.searchKey}</Text>
                                {item.cat && item.cat._id ?
                                    <Text
                                        style={GlobalVariables.TextStyle('v', 'me', 'p')}>{'در دسته‌بندی ' + item.cat.title}</Text>
                                    : null
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.deleteFromHistory(item._id)}>
                                <Icon style={GlobalVariables.TextStyle(null, null, 'p')} name="clear"
                                      type="MaterialIcons" size={GlobalVariables.MediumIconSize}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        );
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {this.renderHeader()}
                {this.renderSearchHistory()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    header: {
        height: GlobalVariables.HeaderHeight,
        ...GlobalVariables.DefaultShadow,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
    },
    search: {
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    searchBar: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    searchIcon: {
        paddingLeft: 10,
        paddingRight: 10,
        height: '100%', justifyContent: 'center', alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
    },
    searchHistory: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
});
