import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {listToTree} from '../../../Modules/Assets';

import Loader from '../../../Components/Loader/Loader';
import Icon from '../../../Components/Icon/Icon';
import NetworkError from '../../../Components/NetworkError/NetworkError';

import {CategoryService} from '../../../Services/CategoryService';
import {ToastService} from '../../../Services/ToastService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            showLoader: true,
            networkError: false,
        };
    }

    componentDidMount() {
        const {cat} = this.props.route.params;
        if (cat) {
            let {title, _id} = cat;
            let categories = [...cat.children];
            categories = categories.map(c => {
                c.parentTitle = title;
                return c;
            });
            if (this.props['showParent']) {
                categories.unshift({
                    _id, title: 'همه آگهی‌های ' + title,
                });
            }
            let showLoader = true;
            if (categories.length < 7) {
                showLoader = false;
            }
            this.setState({categories, showLoader});
        } else {
            this.downloadCategories();
        }
    }


    downloadCategories() {
        this.setState({showLoader: true, networkError: false});
        let categories = GlobalVariables.GetCategories();
        if (categories) {
            this.prepareCategories();
        } else {
            CategoryService.categoryList(this.props.navigation)
                .then(payload => {
                    GlobalVariables.SetCategories(payload.data.result);
                    this.prepareCategories();
                })
                .catch(error => {
                    if (error.type === 'request') {
                        this.setState({networkError: true, showLoader: false});
                    } else if (error.type === 'response') {
                        ToastService.show(error.data.message, 3000, 'c');
                    }
                });
        }
    }

    prepareCategories() {
        const categories = listToTree(GlobalVariables.GetCategories());
        let showLoader = true;
        if (categories.length < 7) {
            showLoader = false;
        }
        this.setState({categories, showLoader, networkError: false});
    }

    selectCat(cat) {
        if (cat.children && cat.children.length) {
            this.props.onPressParent(cat);
        } else {
            this.props.onPressChild(cat);
        }
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {this.state.networkError ?
                    <NetworkError onPress={() => this.downloadCategories()}/>
                    :
                    <FlatList
                        ref={(ref) => {
                            this.ListView_Ref = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        data={this.state.categories}
                        keyExtractor={(item) => (item._id + '')}
                        refreshing={this.state.isRefreshing}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => this.selectCat(item)} style={styles.categorySelector}>
                                <View style={styles.categoryWrapper}>
                                    {/*{*/}
                                        {/*GlobalVariables.GetDarkMode() ? null :*/}
                                            {/*<View style={styles.catIcon}>*/}
                                                {/*<Icon name={item._id} type="Category"*/}
                                                      {/*size={GlobalVariables.BigIconSize}/>*/}
                                            {/*</View>*/}
                                    {/*}*/}
                                    <View style={styles.catTextWrapper}>
                                        <Text
                                            style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catText]}>{item.title}</Text>
                                    </View>
                                    <View style={styles.catIcon}>
                                        {item.children && item.children.length ?
                                            <Icon style={GlobalVariables.TextStyle('l', null, 'dp')} name="arrow-left"
                                                  type="Feather"/>
                                            : null}
                                    </View>
                                </View>
                                {item.children && item.children.length ?
                                    <Text
                                        style={[GlobalVariables.TextStyle('l', 'm', 'dp')]}>{_.map(item.children, 'title').join('، ')}</Text>
                                    : null}
                            </TouchableOpacity>
                        )}
                        ListFooterComponent={() => (
                            this.state.showLoader ?
                                <View style={{height: GlobalVariables.FooterHeight}}>
                                    <Loader type="refresh" color="#888"/>
                                </View>
                                :
                                null
                        )}
                        onEndReached={() => this.setState({showLoader: false})}
                        ItemSeparatorComponent={() => <View style={styles.separator}/>}
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
    },
    catText: {
        marginLeft: 10,
    },
    catTextWrapper: {flex: 1},
    categoryWrapper: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    categorySelector: {
        padding: 10,
    },
    catIcon: {
        justifyContent: 'center',
        flex: 0.1,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
});
