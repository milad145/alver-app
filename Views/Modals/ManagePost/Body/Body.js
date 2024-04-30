import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {latinNumToPersianNum} from '../../../Modules/Assets';

import TimeAgo from '../../../Components/Time/TimeAgo';
import Icon from '../../../Components/Icon/Icon';
import AdvanceAlert from '../../../Components/Alert/AdvanceAlert';
import NetworkError from '../../../Components/NetworkError/NetworkError';
import Loader from '../../../Components/Loader/Loader';

import {NavigationService} from '../../../Services/NavigationService';
import {ToastService} from '../../../Services/ToastService';
import {PostService} from '../../../Services/PostService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advanceAlertModalVisible: false,
            advanceAlertModalTitle: '',
            extraAlertButtons: [],
            networkError: false,
        };
    }

    componentDidMount() {
        this.setState({post: this.props.route.params.post});
    }

    previewPost(post) {
        PostService.addToLastVisits(post);
        NavigationService.navigate(this.props.navigation, 'Post', {post: post._id});
    }

    editPost(post) {
        NavigationService.navigate(this.props.navigation, 'EditPost', {post: post._id});
    }

    onDeletePost(post) {
        let extraAlertButtons = [
            {
                message: 'بله، حذف کن',
                iconName: 'trash-2',
                iconType: 'Feather',
                onPress: () => {
                    this.closeAdvanceAlert();
                    this.deletePost(post);
                },
            },
            {
                message: 'خیر',
                iconName: 'cancel',
                iconType: 'MaterialIcons',
                onPress: () => this.closeAdvanceAlert(),
            },
        ];
        this.setState({
            advanceAlertModalTitle: 'آیا از حذف این آگهی مطمئن هستید؟',
            advanceAlertModalVisible: true,
            extraAlertButtons,
        });
    }

    deletePost(post) {
        this.setState({networkError: false, post: null});
        PostService.deleteMyPost(post._id, this.props.navigation)
            .then(() => {
                EventRegister.emit('postDeleted', post._id);
                NavigationService.goBack(this.props.navigation);
            })
            .catch(error => {
                this.setState({post});
                if (error.type === 'request') {
                    this.setState({networkError: true});
                } else if (error.type === 'response') {
                    ToastService.show(error.data.message, 3000, 'c');
                }
            });
    }

    closeAdvanceAlert() {
        this.setState({
            advanceAlertModalVisible: false,
            advanceAlertModalTitle: '',
            extraAlertButtons: [],
        });
    }

    renderPostStatus(post) {
        let postStatus = '', color = GlobalVariables.BrandColor(), statusText = '';
        if (typeof post.status === 'number') {
            switch (post.status) {
                case 1:
                    postStatus = 'منتشر شده';
                    statusText = `این آگهی ثبت و منتشر شده است. تاریخ انتشار آگهی : `;
                    break;
                case -1:
                    postStatus = 'حذف شده';
                    color = GlobalVariables.RedColor();
                    statusText = '';
                    break;
                case -2:
                    postStatus = 'منقضی شده';
                    color = GlobalVariables.RedColor();
                    statusText = '';
                    break;
                case 0:
                    postStatus = 'در صف انتشار';
                    statusText = '';
                    color = GlobalVariables.BrandSuccess;
                    break;
            }
        }
        return (
            <View style={styles.status}>
                <Text style={[GlobalVariables.TextStyle('b', 'xxl', 't'), {color}]}>{postStatus}</Text>
                <Text style={GlobalVariables.TextStyle('v', null, 't')}>
                    {statusText}
                    <TimeAgo time={post.createdAt} interval={20000}/>
                </Text>
                {
                    post.updateCount ?
                        <Text style={GlobalVariables.TextStyle('v', null, 't')}>
                            تعداد ویرایش پست : {latinNumToPersianNum(' ' + post.updateCount)} بار
                            {'\n'}
                            تاریخ آخرین ویرایش : {' '}
                            <TimeAgo time={post.updatedAt} interval={20000}/>
                        </Text>
                        :
                        null
                }
            </View>
        );
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {this.state.networkError ?
                    <NetworkError onPress={() => this.deletePost(this.state.post)}/>
                    : this.state.post ?
                        <ScrollView style={styles.scroll}>
                            {this.renderPostStatus(this.state.post)}

                            <TouchableOpacity style={styles.buttons} onPress={() => this.previewPost(this.state.post)}>
                                <Icon name='remove-red-eye' type='MaterialIcons'
                                      style={[styles.icon, {color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}]}/>
                                <Text style={[GlobalVariables.TextStyle('v', 'me1', 'dp'), {flex: 1}]}>
                                    پیش نمایش
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.separator}/>
                            <TouchableOpacity style={styles.buttons} onPress={() => this.editPost(this.state.post)}>
                                <Icon name='edit' type='MaterialIcons'
                                      style={[styles.icon, {color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}]}/>
                                <Text style={[GlobalVariables.TextStyle('v', 'me1', 'dp'), {flex: 1}]}>
                                    ویرایش
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.separator}/>
                            <TouchableOpacity style={styles.buttons} onPress={() => this.onDeletePost(this.state.post)}>
                                <Icon name='delete' type='MaterialIcons'
                                      style={[styles.icon, {color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}]}/>
                                <Text style={[GlobalVariables.TextStyle('v', 'me1', 'dp'), {flex: 1}]}>
                                    حذف
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.separator}/>
                        </ScrollView>
                        :
                        < View style={styles.loaderWrapper}>
                            <Loader type='refresh' color='#888'/>
                        </View>
                }
                <AdvanceAlert extraAlertButtons={this.state.extraAlertButtons}
                              customCancelButton={true}
                              title={this.state.advanceAlertModalTitle}
                              visible={this.state.advanceAlertModalVisible}
                              closeModal={() => this.closeAdvanceAlert()}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    scroll: {
        paddingRight: 15,
        paddingLeft: 15,
    },
    status: {
        marginTop: 15,
        marginBottom: 15,
    },

    separator: {
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
    buttons: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 15,
    },
});
