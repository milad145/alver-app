import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import {PermissionService} from '../../Services/PermissionService';

import GlobalVariables from '../../Modules/GlobalVariables';
import {latinNumToPersianNum, SetTimeFormat} from '../../Modules/Assets';
import Icon from '../Icon/Icon';
import {EventRegister} from 'react-native-event-listeners';
import Lottie from 'lottie-react-native';

export default class AudioController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordSecs: 0,
            recordTime: '00:00:00',
            currentPositionSec: 0,
            currentDurationSec: 0,
            playTime: '00:00:00',
            duration: '00:00:00',
            hasPermission: false,
            uri: '',
            isRecordStart: false,
            isPlayStart: false,
        };
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
    }

    componentDidMount() {
        let {audio} = this.props;
        let uri = '', duration = '00:00';
        if (audio && audio.uri) {
            uri = audio.uri;
        }
        if (audio && audio.duration) {
            duration = SetTimeFormat(audio.duration);
        }
        this.setState({uri, duration});
        this.listener = EventRegister.addEventListener('onChangeState', () => {
            this.onChangeState();
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        this.onChangeState();
    }

    onChangeState() {
        this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.audioRecorderPlayer.stopPlayer();
        this.audioRecorderPlayer.removePlayBackListener();
        this.stopRecorder();
    }

    startRecording() {
        PermissionService.checkAndRequest('RECORD_AUDIO')
            .then(() => PermissionService.checkAndRequest('WRITE_EXTERNAL_STORAGE'))
            .then(() => PermissionService.checkAndRequest('READ_EXTERNAL_STORAGE'))
            .then(() => this.onStartRecord()).catch(error => console.log(error));
    }

    onStartRecord = async () => {
        this.setState({isRecordStart: true});
        const path = 'sdcard/myNewPost.m4a';
        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.medium,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        await this.audioRecorderPlayer.startRecorder(path, audioSet);
        this.audioRecorderPlayer.addRecordBackListener(({current_position}) => {
            if (current_position <= GlobalVariables.MaxAudioDuration) {
                let records = {
                    recordSecs: current_position,
                    recordTime: SetTimeFormat(Math.floor(current_position)),
                };
                this.setState(records);
            } else {
                this.onStopRecord();
            }
        });
    };

    onStopRecord = async () => {
        const uri = await this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.props.onStopAudioRecord({uri, duration: this.state.recordSecs});
        this.setState({uri, isRecordStart: false, recordSecs: 0, duration: this.state.recordTime});
    };

    stopRecorder() {
        this.setState({isRecordStart: false, recordSecs: 0, recordTime: SetTimeFormat(0), isPlayStart: false});
    }

    onPausePlay = async () => {
        this.setState({isPlayStart: false});
        await this.audioRecorderPlayer.pausePlayer();
    };

    onStartPlay = async () => {
        if (typeof this.state.uri === 'string' && this.state.uri.length) {
            this.setState({isPlayStart: true});
            await this.audioRecorderPlayer.startPlayer(this.state.uri);
            this.audioRecorderPlayer.setVolume(1.0);
            this.audioRecorderPlayer.addPlayBackListener((e) => {
                if (e.current_position < e.duration) {
                    this.setState({
                        currentPositionSec: e.current_position,
                        currentDurationSec: e.duration,
                        playTime: SetTimeFormat(Math.floor(e.current_position)),
                        duration: SetTimeFormat(Math.floor(e.duration)),
                    });
                } else {
                    this.onStopPlay();
                }
            });
        }
    };

    onStopPlay = async (e) => {
        this.audioRecorderPlayer.stopPlayer();
        this.audioRecorderPlayer.removePlayBackListener();
        this.setState({isPlayStart: false, playTime: SetTimeFormat(0)});
    };

    onDelete() {
        this.setState({uri: '', playTime: SetTimeFormat(0), duration: SetTimeFormat(0), recordTime: SetTimeFormat(0)});
        this.props.onStopAudioRecord({uri: '', duration: 0});
    }


    render() {
        return (
            <View style={styles.body}>
                {
                    (typeof this.state.uri === 'string' && this.state.uri.length) ?
                        <View style={[styles.audioElements]}>
                            <View style={[{flex: 1}, styles.audioElements, {justifyContent: 'flex-start'}]}>
                                <Text style={GlobalVariables.TextStyle('v', 'l', 't')}>
                                    {latinNumToPersianNum(this.state.playTime) + ' / ' + latinNumToPersianNum(this.state.duration)}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => this.onStopPlay()}
                                              style={[styles.recordButton]}>
                                <Icon type="MaterialIcons" name="stop"
                                      size={GlobalVariables.MediumIconSize}
                                      style={[GlobalVariables.TextStyle(null, null, 't')]}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.state.isPlayStart ? this.onPausePlay() : this.onStartPlay()}
                                style={[styles.recordButton]}>
                                <Icon type="MaterialIcons" name={this.state.isPlayStart ? 'pause' : 'play-arrow'}
                                      size={GlobalVariables.MediumIconSize}
                                      style={[GlobalVariables.TextStyle(null, null, 't')]}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onDelete()}
                                              style={[styles.recordButton, {marginRight: 20}]}>
                                <Icon type="MaterialIcons" name="delete"
                                      size={GlobalVariables.MediumIconSize}
                                      style={[GlobalVariables.TextStyle(null, null, 't')]}/>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.audioElements}>
                            <View style={[{flex: 1}, styles.audioElements, {justifyContent: 'flex-start'}]}>
                                <Text
                                    style={[GlobalVariables.TextStyle('v', 'l', 'dp')]}>
                                    {latinNumToPersianNum(this.state.recordTime)}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.state.isRecordStart ? this.onStopRecord() : this.startRecording()}
                                style={[styles.recordButton, styles.audioElements, {
                                    marginRight: 20,
                                    backgroundColor: '#e71e62',
                                    borderWidth: 0,
                                }]}>

                                <Lottie
                                    speed={this.state.isRecordStart ? 1 : 0}
                                    source={require('../../Assets/Animations/record')}
                                    style={{width: 90}}
                                    autoPlay={true} loop/>

                            </TouchableOpacity>
                        </View>
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    recordButton: {
        // padding: 10,
        margin: 2,
        borderRadius: GlobalVariables.BorderRadius,
        // ...GlobalVariables.DefaultShadow,
        width: GlobalVariables.ExtraBigIconSize,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    audioElements: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
