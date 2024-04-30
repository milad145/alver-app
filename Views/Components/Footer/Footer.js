import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

import GlobalVariables from '../../Modules/GlobalVariables';
import {NavigationService} from '../../Services/NavigationService';
import Icon from '../Icon/Icon';
import UploadProgressBar from '../ProgressBar/UploadProgressBar';

export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setState({screen: this.props.route.name});
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <UploadProgressBar/>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.pack}
                                      onPress={() => NavigationService.navigate(this.props.navigation, 'Home', {})}>
                        <View style={styles.packContent}>
                            <Icon
                                style={{color: this.state.screen === 'Home' ? GlobalVariables.BrandColor() : GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}
                                name="home" type="AntDesign" size={GlobalVariables.DefaultIconSize}/>
                            <Text
                                style={[styles.footerText, GlobalVariables.TextStyle('v', 's', 't'), this.state.screen === 'Home' ? {color: GlobalVariables.BrandColor()} : null]}
                                numberOfLines={1}>
                                {GlobalVariables.GetCity().label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pack}
                                      onPress={() => NavigationService.navigate(this.props.navigation, 'Category')}>
                        <View style={styles.packContent}>
                            <Icon
                                style={{
                                    color: this.state.screen === 'Category' ? GlobalVariables.BrandColor() : GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color'),
                                }}
                                name="menu" type="Feather" size={GlobalVariables.DefaultIconSize}/>
                            <Text
                                style={[styles.footerText, GlobalVariables.TextStyle('v', 's', 't'), this.state.screen === 'Category' ? {color: GlobalVariables.BrandColor()} : null]}
                                numberOfLines={1}>دسته‌ها</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pack}
                                      onPress={() => NavigationService.navigate(this.props.navigation, 'Feed', {'refresh': false})}
                        // onPress={() => NavigationService.navigate(this.props.navigation, 'Post', {
                        //     'refresh': false,
                        //     'post': {
                        //         'description': 'Mahd2179',
                        //         'fieldsValue': {
                        //             'price': {'v': 530000000, 'u': 'تومان', 'title': 'قیمت'},
                        //             'exchange': {'v': true, 'title': 'معاوضه'},
                        //             'weight': {'v': 8, 'u': 'کیلو', 'title': 'وزن'},
                        //         },
                        //         'images': [],
                        //         'title': 'عنوان',
                        //         'city': {
                        //             '_id': '5fc3d7f2a59f916e189b8d1f',
                        //             'label': 'تهران',
                        //             'latitude': 35.70290756,
                        //             'longitude': 51.34975815,
                        //             'parentId': '5fc3d7f2a59f916e189b8bd9',
                        //             'parentLabel': 'تهران',
                        //         },
                        //         'categories': [{
                        //             '_id': '5fc2b5c97add484f885c657e',
                        //             'title': 'گوسفند',
                        //             'parent': '5fc2b3e37add484f885c655c',
                        //             'children': [],
                        //         }],
                        //     },
                        //     // post: {
                        //     //     'description': 'این محلی برای تست \nاین محلی برای تست \nاین محلی برای تست \nاین محلی برای تست \nاین محلی برای تست \nاین محلی برای تست \n',
                        //     //     'fieldsValue': {'gender': 'm', 'old': 25, 'price': 2500000, 'exchange': true},
                        //     //     'images': [{
                        //     //         'fileSize': 39528,
                        //     //         'type': 'image/jpeg',
                        //     //         'isVertical': true,
                        //     //         'height': 379,
                        //     //         'path': '/storage/emulated/0/Pictures/image-26276083-32a4-4b1a-9485-83caec81d492.jpg',
                        //     //         'width': 674,
                        //     //         'originalRotation': 0,
                        //     //         'uri': 'file:///data/user/0/com.alver/cache/react-native-image-crop-picker/d54994c4-17c6-4152-be6f-629ad2e92a72.jpg',
                        //     //         'fileName': 'image-26276083-32a4-4b1a-9485-83caec81d492.jpg',
                        //     //         'timestamp': '2020-10-12T17:36:04Z',
                        //     //         'size': 39528,
                        //     //         'mainImage': true,
                        //     //     }, {
                        //     //         'fileName': 'image-fc45202c-b6cf-485a-bfd6-f9aa12d4a20a.jpg',
                        //     //         'fileSize': 100118,
                        //     //         'width': 783,
                        //     //         'originalRotation': 0,
                        //     //         'uri': 'file:///data/user/0/com.alver/cache/react-native-image-crop-picker/70c126bd-b778-4f11-a8ec-4b057c2ee4b3.jpg',
                        //     //         'type': 'image/jpeg',
                        //     //         'isVertical': true,
                        //     //         'height': 1024,
                        //     //         'path': '/storage/emulated/0/Pictures/image-fc45202c-b6cf-485a-bfd6-f9aa12d4a20a.jpg',
                        //     //         'size': 100118,
                        //     //     }, {
                        //     //         'fileName': 'image-0500341c-9a83-4889-b7d2-8d27751eb4b0.jpg',
                        //     //         'fileSize': 166921,
                        //     //         'width': 1019,
                        //     //         'originalRotation': 0,
                        //     //         'uri': 'file:///data/user/0/com.alver/cache/react-native-image-crop-picker/ecee57cf-50c0-42cb-a102-25ac098c66f7.jpg',
                        //     //         'type': 'image/jpeg',
                        //     //         'isVertical': true,
                        //     //         'height': 1024,
                        //     //         'path': '/storage/emulated/0/Pictures/image-0500341c-9a83-4889-b7d2-8d27751eb4b0.jpg',
                        //     //         'size': 166921,
                        //     //     }],
                        //     //     'title': 'عنوان',
                        //     //     'city': {
                        //     //         '_id': '8013',
                        //     //         'label': 'تهران',
                        //     //         'latitude': 35.70290756,
                        //     //         'longitude': 51.34975815,
                        //     //         'parentId': '8',
                        //     //         'parentLabel': 'تهران',
                        //     //     },
                        //     //     'categories': [{
                        //     //         '_id': '101',
                        //     //         'name': 'horse',
                        //     //         'title': 'اسب',
                        //     //         'parent': '1',
                        //     //         'children': [],
                        //     //     }],
                        //     // },
                        // })}
                    >
                        <View style={styles.packContent}>
                            <Icon
                                style={{color: this.state.screen === 'Feed' ? GlobalVariables.BrandColor() : GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}
                                name="addfile" type="AntDesign" size={GlobalVariables.DefaultIconSize}/>
                            <Text
                                style={[styles.footerText, GlobalVariables.TextStyle('v', 's', 't'), this.state.screen === 'Feed' ? {color: GlobalVariables.BrandColor()} : null]}
                                numberOfLines={1}>ثبت آگهی</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pack}
                                      onPress={() => NavigationService.navigate(this.props.navigation, 'Profile', {})}>
                        <View style={styles.packContent}>
                            <Icon
                                style={{color: this.state.screen === 'Profile' ? GlobalVariables.BrandColor() : GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}
                                name="person-outline" type="Ionicons" size={GlobalVariables.DefaultIconSize}/>
                            <Text
                                style={[styles.footerText, GlobalVariables.TextStyle('v', 's', 't'), this.state.screen === 'Profile' ? {color: GlobalVariables.BrandColor()} : null]}
                                numberOfLines={1}>صفحه من</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        height: GlobalVariables.FooterHeight,
        borderTopWidth: 1,
        borderColor: '#CFCFCF',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    footerText: {
        padding: 1,
        paddingRight: 4,
        paddingLeft: 4,
    },
    pack: {
        flex: 1,
    },
    packContent: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    active: {
        color: GlobalVariables.BrandColor(),
    },
});
