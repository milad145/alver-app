import React, {Component} from 'react';
import {View, StyleSheet, PanResponder, TouchableOpacity, Text} from 'react-native';

import Video from 'react-native-video';

import appConfig from '../../../config';

import {latinNumToPersianNum, SetTimeFormat, SetFileSize} from '../../Modules/Assets';
import GlobalVariables from '../../Modules/GlobalVariables';

import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';

export default class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMedia: false,
            uri: '',
            pause: true,
            isLoaded: false,
            isStartDownloading: false,
            duration: 0,
            currentTime: 0,
            canPlay: false,
            size: 0,
        };
        this.events = {
            togglePlayPause: this._togglePlayPause.bind(this),
            onLoad: this._onLoad.bind(this),
            onLoadStart: this._onLoadStart.bind(this),
            onProgress: this._onProgress.bind(this),
            onError: this._onError.bind(this),
            startDownloading: this._startDownloading.bind(this),
            onEnd: this._onEnd.bind(this),
            stopPlay: this._stopPlay.bind(this),
        };
        this.player = {
            controlTimeoutDelay: 15000,
            volumePanResponder: PanResponder,
            seekPanResponder: PanResponder,
            controlTimeout: null,
            volumeWidth: 150,
            iconOffset: 0,
            seekerWidth: 0,
            ref: Video,
        };
    }

    componentDidMount() {
        let {uri, size, time} = this.props.audio;
        let type = this.props.type;
        if (typeof uri === 'string' && uri.length && typeof size === 'number' && typeof time === 'number' && size > 0 && time > 0) {
            if (type === 'server') {
                uri = appConfig.url.api + 'audio/' + uri;
            }
            this.setState({uri, duration: time, size, canPlay: true, type});
        }
    }

    _onLoadStart() {
        this.setState({isStartDownloading: true});
    }

    _onLoad(data = {}) {
        this.setState({pause: false, duration: (data.duration * 1000), isLoaded: true});
    }

    _onProgress(data = {}) {
        this.setState({startPlaying: true, currentTime: (data.currentTime * 1000)});
    }


    _onEnd() {
        this._stopPlay();
    }

    _togglePlayPause() {
        this.setState({pause: !this.state.pause});
    }

    _onError() {
        this.setState({error: true});
        this._stopPlay();
    }

    _startDownloading() {
        if (this.state.canPlay) {
            this.setState({loadMedia: true});
        }
    }

    _stopPlay() {
        this.player.ref.seek(0);
        this.setState({pause: true, currentTime: 0});
    }

    renderMedia() {
        if (this.state.loadMedia) {
            return (
                <Video style={{width: 0, height: 0}}
                       onLoad={this.events.onLoad}
                       onLoadStart={this.events.onLoadStart}
                       onProgress={this.events.onProgress}
                       onError={this.events.onError}
                       ref={videoPlayer => this.player.ref = videoPlayer}
                       paused={this.state.pause}
                       onEnd={this.events.onEnd}
                       source={{uri: this.state.uri}}
                       minLoadRetryCount={1}
                       playInBackground={true}
                />
            );
        }
    }

    render() {
        return (
            <View style={styles.body}>
                {this.renderMedia()}
                <View style={[{flex: 1}, styles.audioElements, {justifyContent: 'flex-start'}]}>
                    <Text
                        style={[GlobalVariables.TextStyle('v', 'me', 'dp')]}>
                        {latinNumToPersianNum(SetTimeFormat(this.state.currentTime) + ' / ' + SetTimeFormat(this.state.duration)) + '   '}
                        {/*<Text*/}
                        {/*style={[GlobalVariables.TextStyle('v', 'm', 'dp')]}>*/}
                        {/*( {latinNumToPersianNum(SetFileSize(this.state.size))} )*/}
                        {/*</Text>*/}
                    </Text>
                </View>
                {
                    !this.state.isStartDownloading ?
                        <TouchableOpacity onPress={this.events.startDownloading}
                                          style={[styles.recordButton, styles.audioElements]}>
                            <Icon type="MaterialIcons" name={this.state.pause ? 'play-arrow' : 'pause'}
                                  style={GlobalVariables.TextStyle(null, null, 't')}/>
                        </TouchableOpacity>
                        : this.state.isLoaded ?
                        <View style={styles.audioElements}>
                            <TouchableOpacity onPress={this.events.stopPlay}
                                              style={[styles.recordButton, styles.audioElements]}>
                                <Icon type="MaterialIcons" name='stop'
                                      style={GlobalVariables.TextStyle(null, null, 't')}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.events.togglePlayPause}
                                              style={[styles.recordButton, styles.audioElements]}>
                                <Icon type="MaterialIcons" name={this.state.pause ? 'play-arrow' : 'pause'}
                                      style={GlobalVariables.TextStyle(null, null, 't')}/>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.recordButton}>
                            <Loader type="refresh" color="#888" size="small"/>
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    recordButton: {
        padding: 10,
        margin: 2,
        borderRadius: GlobalVariables.BorderRadius,
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        // ...GlobalVariables.DefaultShadow
    },
    audioElements: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
