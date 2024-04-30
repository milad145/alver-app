import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, TextInput} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';

import {PostService} from '../../../Services/PostService';
import {ToastService} from '../../../Services/ToastService';

import Post from '../../../Components/Post/Post';
import NetworkError from '../../../Components/NetworkError/NetworkError';
import Loader from '../../../Components/Loader/Loader';
import NoPosts from '../../../Components/NoPosts/NoPosts';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            isRefreshing: false,
            searchKey: '',
            requestLoaded: false,
            showLoader: true,
        };
    }

    componentDidMount() {
        let {cat, searchKey, city} = this.props.route.params;
        this.onLoadFilter(cat, searchKey, city);
    }

    componentDidUpdate() {
        let {cat, searchKey, city} = this.props.route.params;
        if (!_.isEqual(this.state.cat, cat) || !_.isEqual(this.state.city, city) || this.state.searchKey !== searchKey) {
            this.onLoadFilter(cat, searchKey, city);
        }
    }

    onLoadFilter(cat, searchKey = '', city) {
        let newState = {};
        newState.cat = cat;
        newState.searchKey = searchKey;
        newState.city = city;
        this.setState(newState);
        this.search(searchKey, cat, null, null, city);
    }

    search(searchKey, cat, fields, lastId, city) {
        this.setState({networkError: false, requestLoaded: false});
        let query = '?city=';
        if (city && city._id) {
            query += city._id;
        } else {
            query += GlobalVariables.GetCity()._id;
        }
        if (searchKey && searchKey.length) {
            query += `&key=${searchKey}`;
        }
        if (cat && cat._id) {
            query += `&cat=${cat._id}`;
        }
        if (lastId) {
            query += `&lastId=${lastId}`;
        }
        PostService.filter(query, this.props.navigation)
            .then(payload => {
                let {posts} = payload.data.result;
                let newState = {networkError: false, isRefreshing: false, requestLoaded: true};
                if (posts.length) {
                    newState.lastId = posts[posts.length - 1]._id;
                    newState.showLoader = true;
                } else {
                    newState.showLoader = false;
                }
                if (lastId) {
                    posts = _.unionBy(this.state.posts, posts, '_id');
                }
                newState.posts = posts;
                newState.searchKey = searchKey;
                this.setState(newState);
            })
            .catch(error => {
                if (error.type === 'request') {
                    this.setState({networkError: true, showLoader: true, isRefreshing: false});
                } else if (error.type === 'response') {
                    ToastService.show(error.data.message, 3000, 'c');
                }
            });
    }

    onNextPage() {
        if (this.state.showLoader) {
            this.search(this.state.searchKey, this.state.cat, this.state.fields, this.state.lastId, this.state.city);
        }
    }


    onRefresh() {
        this.setState({isRefreshing: true});
        this.search(this.state.searchKey, this.state.cat, this.state.fields, null, this.state.city);
    }

    clearSearch() {
        // this.setState({searchKey: ''});
        this.search('', this.state.cat, this.state.fields, null, this.state.city);
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {this.state.networkError ?
                    <NetworkError
                        onPress={() => this.search(this.state.searchKey, this.state.cat, this.state.fields, null, this.state.city)}/>
                    :
                    <FlatList
                        ref={(ref) => this.ListView_Ref = ref}
                        onRefresh={this.onRefresh.bind(this)}
                        showsVerticalScrollIndicator={false}
                        data={this.state.posts}
                        keyExtractor={(item) => (item._id)}
                        refreshing={this.state.isRefreshing}
                        initialNumToRender={3}
                        onEndReachedThreshold={1}
                        style={{flex: 1}}
                        removeClippedSubviews={true}
                        renderItem={({item, index}) => (
                            <Post navigation={this.props.navigation} route={this.props.route} post={item}
                                  index={index}/>
                        )}
                        ListFooterComponent={() => (
                            this.state.showLoader ?
                                <View style={{height: GlobalVariables.FooterHeight}}>
                                    <Loader type="refresh" color="#888"/>
                                </View>
                                :
                                null
                        )}
                        ListEmptyComponent={() => (<NoPosts requestLoaded={this.state.requestLoaded}/>)}
                        onEndReached={this.onNextPage.bind(this)}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    header: {
        paddingTop: 5,
    },
    header_sec1: {
        height: GlobalVariables.FooterHeight * 0.8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        width: '95%',
        alignSelf: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        // marginBottom: 5,
    },
    addPostText: {
        fontFamily: 'Vazir-Bold',
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
});
