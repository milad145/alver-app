import React, {Component} from 'react';
import {TextInput, StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';

import _ from 'lodash';

import {NavigationService} from '../../Services/NavigationService';

import GlobalVariables from '../../Modules/GlobalVariables';
import {latinNumToPersianNum} from '../../Modules/Assets';

import GuideModal from './GuideModal';
import SelectImages from '../SelectImage/SelectImages';
import AudioController from '../AudioController/AudioController';
import AudioPlayer from '../AudioController/AudioPlayer';
import Icon from '../Icon/Icon';

export default class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [],
            guideModalStatus: false,
            params: {
                title: '',
                description: '',
                images: [],
                audio: {},
            },
            titleValidation: false,
            descriptionValidation: false,
            audioValidation: false,
            catValidation: false,
            startFill: false,
            categoryScrollPosition: 0,
            titleScrollPosition: 0,
            voiceScrollPosition: 0,
        };
    }

    componentDidMount() {
        this.setParams(this.props.post);
    }

    selectCategory() {
        NavigationService.navigate(this.props.navigation, 'SelectCategory', {
            headerTitle: 'دسته آگهی را انتخاب کنید',
            back: true,
            type: this.props.type,
        });
    }


    componentDidUpdate() {
        if (!_.isEqual(this.state.params, this.props.post)) {
            this.setParams(this.props.post);
        }
    }

    setParams(post) {
        this.setState({params: post, catValidation: false, startFill: true});
    }

    showGuideModal() {
        this.setState({guideModalStatus: true});
    }

    closeGuideModal() {
        this.setState({guideModalStatus: false});
    }

    fieldValidation(validation, text) {
        return (
            this.state[validation] ?
                <Text
                    style={[GlobalVariables.TextStyle('l', 'm'), {color: GlobalVariables.RedColor()}]}>{latinNumToPersianNum(text)}</Text>
                : null
        );
    }

    onChangeImages(images) {
        let params = this.state.params;
        if (!_.isEqual(params.images, images)) {
            params.images = images;
            this.setState({params});
        }
    }

    next() {
        const {cat, title, description, audio} = this.state.params;
        let titleValidation = true, audioValidation = false, /*descriptionValidation = true,*/ catValidation = true;
        if (cat && cat._id) {
            catValidation = false;
        }
        if (title && title.length >= 3) {
            titleValidation = false;
        }
        if (audio && audio.duration && audio.duration < GlobalVariables.MinAudioDuration) {
            audioValidation = true;
        }
        /*if (description && description.length >= 10) {
            descriptionValidation = false;
        }*/
        this.setState({titleValidation, catValidation, audioValidation}); //descriptionValidation
        if (!titleValidation && !catValidation && !audioValidation) { //!descriptionValidation
            // console.log(JSON.stringify(this.state.params))
            if (!this.state.params._id) {
                GlobalVariables.SetPost(this.state.params);
            }
            NavigationService.navigate(this.props.navigation, 'Fields', this.state.params);
        } else if (catValidation) {
            this.scrollRef.scrollTo({y: this.state.categoryScrollPosition, animated: true});
        } else if (titleValidation) {
            this.scrollRef.scrollTo({y: this.state.titleScrollPosition, animated: true});
        } else if (audioValidation) {
            this.scrollRef.scrollTo({y: this.state.voiceScrollPosition, animated: true});
        }
    }

    categorySection() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.selectCategory()} onLayout={(event) => {
                    this.setState({categoryScrollPosition: event.nativeEvent.layout.y});
                }} style={[styles.filedWrapper, styles.rowFlex]}>
                    <Text
                        style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName]}>
                        دسته بندی
                    </Text>
                    <Text
                        style={[GlobalVariables.TextStyle('v', 'me1', 'dp')]}>
                        {(this.state.params && this.state.params.cat) ? this.state.params.cat.title : 'انتخاب کنید'}
                    </Text>
                </TouchableOpacity>
                {this.fieldValidation('catValidation', 'این مورد را وارد کنید.')}
            </View>
        );
    }

    guideSection() {
        return (
            <View>
                {/*<TouchableOpacity onPress={() => this.showGuideModal()}>*/}
                {/*<View style={[styles.filedWrapper, styles.rowFlex]}>*/}
                {/*<Text*/}
                {/*style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName]}>*/}
                {/*راهنمای ثبت آگهی*/}
                {/*</Text>*/}
                {/*<Icon style={GlobalVariables.TextStyle(null, null, 'dp')} name="arrow-left" type="Feather"/>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
                <GuideModal visible={this.state.guideModalStatus} closeGuideModal={() => this.closeGuideModal()}/>
            </View>
        );
    }

    titleSection() {
        return (
            <View style={[styles.filedWrapper]} onLayout={(event) => {
                this.setState({titleScrollPosition: event.nativeEvent.layout.y});
            }}>
                <Text
                    style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName, styles.margin]}>
                    عنوان آگهی
                </Text>
                <Text
                    style={[GlobalVariables.TextStyle('l', 's', 't'), styles.catFieldName, styles.margin]}>
                    در عنوان آگهی به موارد مهم و چشمگیر اشاره کنید.
                </Text>
                <View
                    style={[styles.searchView, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor_circleIcon')}]}>
                    <TextInput
                        value={this.state.params.title}
                        keyboardType="default"
                        autoCorrect={false}
                        onChangeText={(key) => {
                            let params = this.state.params;
                            let titleValidation = false;
                            params.title = key;
                            if (key.length < 3) {
                                titleValidation = true;
                            }
                            this.setState({params, titleValidation});
                        }}
                        returnKeyType="next"
                        style={[styles.searchInput, GlobalVariables.TextStyle('v', 'xl')]}
                    />
                </View>
                {this.fieldValidation('titleValidation', 'این مورد را وارد کنید. (حداقل 3 حرف)')}
            </View>
        );
    }

    audioSection() {
        return (
            <View style={[styles.filedWrapper]} onLayout={(event) => {
                this.setState({voiceScrollPosition: event.nativeEvent.layout.y});
            }}>
                <Text
                    style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName, styles.margin]}>
                    توضیحات صوتی
                </Text>
                <Text
                    style={[GlobalVariables.TextStyle('l', 's', 't'), styles.catFieldName, styles.margin]}>
                    جزییات و نکات قابل توجه آگهی خود را به صورت کامل و دقیق و با زبانی ساده بگویید. حداکثر زمان برای
                    صحبت {latinNumToPersianNum(GlobalVariables.MaxAudioDurationByMin)} دقیقه می‌باشد.
                </Text>
                <View>
                    {this.state.params._id && this.state.params.audios.length ?
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{flex: 1}}>
                                <AudioPlayer type="server" audio={this.state.params.audios[0]}/>
                            </View>
                            <TouchableOpacity style={styles.deleteAudioButton} onPress={() => {
                                let {params} = this.state;
                                params.audios = [];
                                this.setState({params});
                            }}>
                                <Icon type="MaterialIcons" name="delete"
                                      style={[GlobalVariables.TextStyle(null, null, 't')]}/>
                            </TouchableOpacity>
                        </View>
                        :
                        <AudioController audio={this.state.params.audio} onStopAudioRecord={(audio) => {
                            let params = this.state.params;
                            params.audio = audio;
                            let audioValidation = false;
                            if (audio && audio.duration && audio.duration < GlobalVariables.MinAudioDuration) {
                                audioValidation = true;
                            }
                            this.setState({params, audioValidation});
                        }}/>
                    }
                </View>
                {this.fieldValidation('audioValidation', `توضیحات صوتی شما کمتر از ${GlobalVariables.MinAudioDurationBySec} ثانیه می‌باشد.`)}
            </View>
        );
    }

    descriptionSection() {
        return (
            <View style={[styles.filedWrapper]}>
                <Text
                    style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName, styles.margin]}>
                    توضیحات آگهی
                </Text>
                <Text
                    style={[GlobalVariables.TextStyle('l', 's', 't'), styles.catFieldName, styles.margin]}>
                    جزییات و نکات قابل توجه آگهی خود را کامل و دقیق بنویسید. درج شماره موبایل در متن آگهی مجاز
                    نیست.
                </Text>
                <View
                    style={[styles.searchView, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor_circleIcon')}]}>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        value={this.state.params.description}
                        keyboardType="default"
                        autoCorrect={false}
                        onChangeText={(key) => {
                            let params = this.state.params;
                            // let descriptionValidation = false;
                            params.description = key;
                            // if (key.length < 10) {
                            //     descriptionValidation = true;
                            // }
                            this.setState({params}); //descriptionValidation
                        }}
                        ref={(input) => {
                            this.descriptionInput = input;
                        }}
                        style={[styles.searchInput, GlobalVariables.TextStyle('v', 'xl')]}
                    />
                </View>
                {/*{this.fieldValidation('descriptionValidation', 'این مورد را وارد کنید. (حداقل 10 حرف)')}*/}
            </View>
        );
    }

    nextButtonSection() {
        return (
            <View style={styles.footer}>
                <TouchableOpacity style={[GlobalVariables.DefaultButtonsOutLine, styles.footerElement]}
                                  onPress={() => this.showGuideModal()}>
                    <Text style={[GlobalVariables.DefaultButtonsOutLineText]}>راهنمای ثبت آگهی</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.footerButton, styles.footerElement]}
                                  onPress={() => this.next()}>
                    <Text style={[styles.footerButtonText]}>ادامه</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {
                    this.state.startFill ?
                        <ScrollView ref={(ref) => this.scrollRef = ref} style={styles.scroll}
                                    showsVerticalScrollIndicator={true}>
                            <View style={[styles.separator, {borderBottomWidth: 0}]}/>
                            {this.guideSection()}
                            {/*<View style={styles.separator}/>*/}
                            {this.categorySection()}
                            <View style={styles.separator}/>
                            {this.titleSection()}
                            {this.audioSection()}
                            <SelectImages defaultImages={this.state.params.images} route={this.props.route}
                                          type={this.props.type}
                                          onChangeImages={(images) => this.onChangeImages(images)}/>
                            {this.descriptionSection()}
                            {this.nextButtonSection()}
                            <View style={[styles.separator, {borderBottomWidth: 0}]}/>
                        </ScrollView>
                        : null
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    scroll: {
        paddingLeft: 13,
        paddingRight: 13,
    },
    catFieldName: {flex: 1},
    catFieldValue: {color: '#555'},
    filedWrapper: {
        width: '100%',
        padding: 5,
        paddingTop: 10,
        paddingBottom: 10,
    },
    rowFlex: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    separator: {
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
    searchInput: {
        flex: 1,
        textAlignVertical: 'top',
    },
    searchView: {
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    margin: {
        marginTop: 8,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        flex: 0.48,
    },
    deleteAudioButton: {
        padding: 10,
        margin: 2,
        borderRadius: GlobalVariables.BorderRadius,
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
});
