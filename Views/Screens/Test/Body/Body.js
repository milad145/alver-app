/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import Post from '../../../Components/Post/NewPost';
import GlobalVariables from '../../../Modules/GlobalVariables';
import Loader from '../../../Components/Loader/Loader';
import NoPosts from '../../../Components/NoPosts/NoPosts';


export default class Home extends Component {
    state = {};

    componentDidMount() {

    }


    render() {
        let posts = [
            {
                '_id': '6078f020937ce553e7dfe66b',
                'cat': {'_id': '605c85f66f479c53f9befeed', 'title': 'گوسفند'},
                'city': {
                    '_id': '5fc3d7f2a59f916e189b8c55',
                    'label': 'بیله سوار',
                    'latitude': 39.37607956,
                    'longitude': 48.34270859,
                    'parent': {'_id': '5fc3d7f2a59f916e189b8bd4', 'label': 'اردبیل'},
                },
                'fieldsValue': {'price': {'v': 5000000, 'u': 'tooman'}},
                'title': 'گوسفند دامازدخگوسفند دامازدخگوسفند دامازدخگوسفند دامازدخگوسفند دامازدخگوسفند دامازدخ',
                'createdAt': '2021-04-16T02:02:08.187Z',
                'mainImage': '5fd49659a7295546a2de1f30_1618538528169_image-0e91327c-2582-42cd-a335-9f739b1096d1.jpg',
            }, {
                '_id': '6078f020937ce553e7dfe66ba',
                'cat': {'_id': '605c85f66f479c53f9befeed', 'title': 'گوسفند'},
                'city': {
                    '_id': '5fc3d7f2a59f916e189b8c55',
                    'label': 'بیله سوار',
                    'latitude': 39.37607956,
                    'longitude': 48.34270859,
                    'parent': {'_id': '5fc3d7f2a59f916e189b8bd4', 'label': 'اردبیل'},
                },
                'fieldsValue': {'price': {'v': 5000000, 'u': 'tooman'}},
                'title': 'گوسفند دامازدخ',
                'createdAt': '2021-04-16T02:02:08.187Z',
                'mainImage': '5fd49659a7295546a2de1f30_1618538528169_image-0e91327c-2582-42cd-a335-9f739b1096d1.jpg',
            }, {
                '_id': '6078f020937ce553e7dfe66bb',
                'cat': {'_id': '605c85f66f479c53f9befeed', 'title': 'گوسفند'},
                'city': {
                    '_id': '5fc3d7f2a59f916e189b8c55',
                    'label': 'بیله سوار',
                    'latitude': 39.37607956,
                    'longitude': 48.34270859,
                    'parent': {'_id': '5fc3d7f2a59f916e189b8bd4', 'label': 'اردبیل'},
                },
                'fieldsValue': {'price': {'v': 5000000, 'u': 'tooman'}},
                'title': 'گوسفند دامازدخ',
                'createdAt': '2021-04-16T02:02:08.187Z',
                'mainImage': '5fd49659a7295546a2de1f30_1618538528169_image-0e91327c-2582-42cd-a335-9f739b1096d1.jpg',
            }, {
                '_id': '6078f020937ce553e7dfe66bc',
                'cat': {'_id': '605c85f66f479c53f9befeed', 'title': 'گوسفند'},
                'city': {
                    '_id': '5fc3d7f2a59f916e189b8c55',
                    'label': 'بیله سوار',
                    'latitude': 39.37607956,
                    'longitude': 48.34270859,
                    'parent': {'_id': '5fc3d7f2a59f916e189b8bd4', 'label': 'اردبیل'},
                },
                'fieldsValue': {'price': {'v': 5000000, 'u': 'tooman'}},
                'title': 'گوسفند دامازدخ',
                'createdAt': '2021-04-16T02:02:08.187Z',
                'mainImage': '5fd49659a7295546a2de1f30_1618538528169_image-0e91327c-2582-42cd-a335-9f739b1096d1.jpg',
            }, {
                '_id': '6078f020937ce553e7dfe66bcdf',
                'cat': {'_id': '605c85f66f479c53f9befeed', 'title': 'گوسفند'},
                'city': {
                    '_id': '5fc3d7f2a59f916e189b8c55',
                    'label': 'بیله سوار',
                    'latitude': 39.37607956,
                    'longitude': 48.34270859,
                    'parent': {'_id': '5fc3d7f2a59f916e189b8bd4', 'label': 'اردبیل'},
                },
                'fieldsValue': {'price': {'v': 5000000, 'u': 'tooman'}},
                'title': 'گوسفند دامازدخ',
                'createdAt': '2021-04-16T02:02:08.187Z',
                'mainImage': '5fd49659a7295546a2de1f30_1618538528169_image-0e91327c-2582-42cd-a335-9f739b1096d1.jpg',
            },
        ];
        return (
            <FlatList
                ref={(ref) => this.ListView_Ref = ref}
                showsVerticalScrollIndicator={false}
                data={posts}
                keyExtractor={(item) => (item._id)}
                initialNumToRender={7}
                style={{flex: 1, width: GlobalVariables.DeviceWidth}}
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
                ListEmptyComponent={() => (<NoPosts requestLoaded={this.state.requestLoaded}/>)}
            />
        );
    }
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
