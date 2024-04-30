import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList, Linking} from 'react-native';

import _ from 'lodash';

import appConfig from '../../../../config';

import GlobalVariables from '../../../Modules/GlobalVariables';

import Icon from '../../../Components/Icon/Icon';
import Post from '../../../Components/Post/NewPost';
import CircleCategory from '../../../Components/Categories/CircleCategory';
import Loader from '../../../Components/Loader/Loader';
import NetworkError from '../../../Components/NetworkError/NetworkError';
import NoPosts from '../../../Components/NoPosts/NoPosts';

import {NavigationService} from '../../../Services/NavigationService';
import {PostService} from '../../../Services/PostService';
import {ToastService} from '../../../Services/ToastService';
import {UserService} from '../../../Services/UserService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [], isRefreshing: false, categories: [], networkError: false, showLoader: true, requestLoaded: false,
            catsScrollPosition: 0, catsScrollWidth: 0, bodyWidth: 0,
        };
    }

    componentDidMount() {
        this.getPosts();
        this.getMyFeedBack();
        Linking.getInitialURL().then(url => {
            this.navigate(url);
        });
        Linking.addEventListener('url', this.handleOpenURL);
    }


    handleOpenURL = (event) => {
        this.navigate(event.url);
    };
    navigate = (url) => {
        if (url) {
            const route = url.replace(/.*?:\/\//g, '').split('/');
            const routeName = route[0];
            const element = route[1];
            if (routeName === appConfig.url.route && (element && element === 'p') && route[2]) {
                NavigationService.push(this.props.navigation, 'Post', {post: route[2]});
            }
        }
    };

    getPosts() {
        this.setState({showLoader: true, networkError: false, requestLoaded: false});
        let query = '?city=' + GlobalVariables.GetCity()._id;
        PostService.homePost(query, this.props.navigation)
            .then(payload => {
                let {posts, categories} = payload.data.result;
                this.setState({categories});
                this.renderReceivedPosts(posts, false);
            })
            .catch(this.renderError.bind(this));
    }

    getMyFeedBack() {
        UserService.getMyFeedBack()
            .then(payload => {
                console.log(payload)
                if (payload && payload === 'no') {
                    GlobalVariables.SetMyFeedBackStatus(false);
                } else {
                    GlobalVariables.SetMyFeedBackStatus(true);
                }
            });
    }

    onNextPage() {
        if (this.state.showLoader) {
            let query = '?city=' + GlobalVariables.GetCity()._id;
            if (this.state.lastId) {
                query += '&lastId=' + this.state.lastId;
            }
            PostService.filter(query, this.props.navigation)
                .then(payload => this.renderReceivedPosts(payload.data.result.posts))
                .catch(this.renderError.bind(this));
        }
    }

    renderReceivedPosts(posts, union = true) {
        let newState = {networkError: false, isRefreshing: false, requestLoaded: true};
        if (posts.length) {
            newState.lastId = posts[posts.length - 1]._id;
            newState.showLoader = true;
        } else {
            newState.showLoader = false;
        }
        if (union) {
            posts = _.unionBy(this.state.posts, posts, '_id');
        }
        newState.posts = posts;
        this.setState(newState);
    }

    renderError(error) {
        console.log(error);
        if (error.type === 'request') {
            this.setState({networkError: true, showLoader: true, isRefreshing: false});
        } else if (error.type === 'response') {
            this.setState({isRefreshing: false, showLoader: false});
            ToastService.show(error.data.message, 3000, 'c');
        }
    }


    showPosts(posts) {
        this.setState({posts, isRefreshing: false});
    }

    onRefresh() {
        this.setState({isRefreshing: true});
        this.getPosts();
    }

    onScrollCats(side) {
        let {catsScrollWidth, catsScrollPosition} = this.state;
        if (side === 'r' && catsScrollPosition < catsScrollWidth) {
            catsScrollPosition += this.state.bodyWidth;
            if (catsScrollPosition > catsScrollWidth) {
                catsScrollPosition = catsScrollWidth;
            }
        } else if (side === 'l' && catsScrollPosition > 0) {
            catsScrollPosition -= this.state.bodyWidth;
            if (catsScrollPosition < 0) {
                catsScrollPosition = 0;
            }
        }
        this.catsScroll.scrollTo({x: catsScrollPosition});
        this.setState({catsScrollPosition});
    }

    listHeader() {
        return (
            <View style={styles.header}>
                <View
                    style={[styles.header_sec1, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    <TouchableOpacity style={[GlobalVariables.DefaultButtons, styles.headerButtons]}
                                      onPress={() => NavigationService.navigate(this.props.navigation, 'Feed', {})}>
                        <Text style={[GlobalVariables.TextStyle('b', 'l', null), GlobalVariables.DefaultButtonsText]}>ثبت
                            رایگان آگهی</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.catsSection}>
                    <TouchableOpacity
                        style={[styles.catsNavigationArrow, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}, {left: 0}]}
                        onPress={() => this.onScrollCats('r')}>
                        <Icon style={GlobalVariables.TextStyle(null, null, 't')}
                              size={GlobalVariables.MediumIconSize} type="Feather" name="chevron-right"/>
                    </TouchableOpacity>
                    <View style={styles.catsScrollView}
                          onLayout={({nativeEvent}) => this.setState({bodyWidth: nativeEvent.layout.width})}>

                        {
                            this.state.categories && this.state.categories.length ?
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                                            ref={(ref) => this.catsScroll = ref}
                                            onContentSizeChange={(width) => {
                                                let catsScrollWidth = width - this.state.bodyWidth;
                                                if (catsScrollWidth < 0) {
                                                    catsScrollWidth *= -1;
                                                }
                                                this.setState({
                                                    catsScrollWidth,
                                                    catsScrollPosition: catsScrollWidth,
                                                });
                                            }}
                                            onMomentumScrollEnd={({nativeEvent}) => this.setState({catsScrollPosition: nativeEvent.contentOffset.x})}
                                            style={styles.catsScrollView}>
                                    {this.state.categories.map(c => {
                                        return (
                                            <CircleCategory navigation={this.props.navigation} route={this.props.route}
                                                            key={c._id + ''}
                                                            cat={c}/>);
                                    })}
                                </ScrollView>
                                : null
                        }
                    </View>
                    <TouchableOpacity
                        style={[styles.catsNavigationArrow, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}, {right: 0}]}
                        onPress={() => this.onScrollCats('l')}>
                        <Icon style={GlobalVariables.TextStyle(null, null, 't')}
                              size={GlobalVariables.MediumIconSize} type="Feather" name="chevron-left"/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {this.state.networkError ?
                    <NetworkError onPress={() => {
                        this.getMyFeedBack();
                        this.getPosts();
                    }}/>
                    :
                    <FlatList
                        ref={(ref) => this.ListView_Ref = ref}
                        onRefresh={this.onRefresh.bind(this)}
                        showsVerticalScrollIndicator={false}
                        data={this.state.posts}
                        keyExtractor={(item) => (item._id)}
                        refreshing={this.state.isRefreshing}
                        initialNumToRender={7}
                        style={{flex: 1}}
                        removeClippedSubviews={true}
                        renderItem={({item, index}) => (
                            <Post navigation={this.props.navigation} route={this.props.route} post={item}
                                  index={index}/>
                        )}

                        columnWrapperStyle={{justifyContent: 'space-between'}}
                        numColumns={2}
                        ListFooterComponent={() => (
                            this.state.showLoader ?
                                <View style={{height: GlobalVariables.FooterHeight}}>
                                    <Loader type="refresh" color="#888"/>
                                </View>
                                :
                                null
                        )}
                        ListHeaderComponent={this.listHeader()}
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
        paddingBottom: 5,
    },
    header_sec1: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        alignSelf: 'center',
        overflow: 'hidden',
        marginBottom: 5,
        flex: 1,
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        borderRadius: GlobalVariables.BorderRadius,
    },
    catsScrollView: {
        flexDirection: 'row',
        alignSelf: 'center',
        padding: 0,
        flex: 1,
    },
    headerButtons: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        flex: 1,
        borderWidth: 0,
    },
    separator: {
        borderRightWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        height: '100%',
    },
    location: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        flex: .1,
    },
    catsSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    catsNavigationArrow: {
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        borderRadius: GlobalVariables.BorderRadius,
    },
});
