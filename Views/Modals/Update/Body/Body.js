import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Linking} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

import appConfig from '../../../../config';

import Loader from '../../../Components/Loader/Loader';
import NetworkError from '../../../Components/NetworkError/NetworkError';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {convertVersion, latinNumToPersianNum, SetFileSize} from '../../../Modules/Assets';

import {DeviceService} from '../../../Services/DeviceService';
import {ToastService} from '../../../Services/ToastService';
import {PermissionService} from '../../../Services/PermissionService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            networkError: false,
            requestDone: false,
            appStatus: false,
            lastChanges: [],
            myVersion: GlobalVariables.Version,
            lastChangesLineNumber: 2,
            defaultLineNumber: 2,
            showMoreButton: false,
            total: 0,
            received: 0,
            canceledUpdate: false,
            downloadStarted: false,
            downloadProgress: 0,
            appSource: GlobalVariables.GetAppSource(),
            error: false,
        };
        this.downloadTask = null;
    }

    componentDidMount() {
        this.getVersion();
    }

    componentWillUnmount() {
        this.cancelDownload();
    }

    getVersion() {
        this.setState({networkError: false, requestDone: false});
        DeviceService.getVersion(this.props.navigation)
            .then(result => {
                let {lastChanges} = result.data;
                let {lastSupportedVersion, lastVersion} = result.data.versions;
                // lastVersion = '1.1.0';
                // lastSupportedVersion = '1.1.0';
                let appStatus = convertVersion(this.state.myVersion, lastVersion, lastSupportedVersion);
                this.setState({
                    networkError: false,
                    requestDone: true,
                    appStatus,
                    lastVersion,
                    lastSupportedVersion,
                    lastChanges,
                });
            })
            .catch(error => {
                if (error.type === 'request') {
                    this.setState({networkError: true});
                } else if (error.type === 'response') {
                    ToastService.show(error.data.message, 3000, 'c');
                }
            });
    }

    startDownload(url, name) {
        PermissionService.checkAndRequest('READ_EXTERNAL_STORAGE')
            .then(() => PermissionService.checkAndRequest('WRITE_EXTERNAL_STORAGE'))
            .then(() => this.downloadApp(url, name)).catch(error => console.log(error));
    }


    downloadApp(url, name) {
        this.setState({canceledUpdate: false, downloadStarted: true, error: false});
        if (this.downloadTask) {
            this.cancelDownload();
        } else {
            url += name;
            this.downloadTask = new RNFetchBlob.config({
                fileCache: true,
                path: `${RNFetchBlob.fs.dirs.DownloadDir}/` + name,
                // addAndroidDownloads: {
                //     useDownloadManager: true,
                //     title: name,
                //     description: 'An APK that will be installed',
                //     mime: 'application/vnd.android.package-archive',
                //     mediaScannable: true,
                //     notification: true,
                // },
            }).fetch('GET', url, {/*some headers ..*/});

            this.downloadTask
                .progress((received, total) => {
                    this.setState({received, total, downloadProgress: parseFloat((received / total) * 100).toFixed(2)});
                })
                .then((res) => {
                    this.downloadTask = null;
                    this.setState({downloadStarted: false, total: 0, downloadProgress: 0});
                    if (res.respInfo.status === 200) {
                        if (!this.state.canceledUpdate) {
                            GlobalVariables.SetAppSource(res.path());
                            this.setState({appSource: res.path()});
                            return this.installUpdate(res.path());
                        } else {
                            GlobalVariables.SetAppSource(null);
                            this.setState({appSource: null});
                        }
                    } else {
                        this.setState({error: true});
                    }
                })
                .catch(() => {
                    this.setState({downloadStarted: false});
                    this.downloadTask = null;
                });
        }
    }

    installUpdate(source) {
        return RNFetchBlob.android.actionViewIntent(source, 'application/vnd.android.package-archive')
            .catch(error => console.log(error));
    }

    cancelDownload() {
        this.setState({canceledUpdate: true});
        if (this.downloadTask) {
            this.downloadTask.cancel();
        }
    }


    lastVersionAddress() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                {
                    this.state.error ?
                        <Text
                            style={[GlobalVariables.TextStyle('v', 'm', 't'), {color: GlobalVariables.RedColor()}]}>
                            مشکلی در سرور رخ داده است. لطفا بعدا دوباره امتحان کنید.
                        </Text>
                        :
                        null
                }
                {
                    this.state.downloadStarted ?
                        <View style={styles.downloadProgressWrapper}>
                            <Text style={GlobalVariables.TextStyle('v', 'm', 't')}>
                                {this.state.total ? latinNumToPersianNum(SetFileSize(this.state.received) + ' / ' + SetFileSize(this.state.total)) : null}
                            </Text>
                            <View style={styles.progressBarWrapper}>
                                <View style={{
                                    backgroundColor: 'blue',
                                    height: 5,
                                    width: this.state.downloadProgress + '%',
                                }}/>
                            </View>
                        </View>
                        :
                        null
                }
                {
                    this.state.downloadStarted ?
                        <TouchableOpacity
                            style={[styles.downloadButtons, {backgroundColor: GlobalVariables.RedColor()}]}
                            onPress={() => this.cancelDownload()}>
                            <Text style={GlobalVariables.DefaultButtonsText}>کنسل</Text>
                        </TouchableOpacity>
                        :
                        <View style={styles.downloadButtonsBox}>
                            <Text style={[GlobalVariables.TextStyle('l', 'me', 'p'), {margin: 5}]}>لطفا از فروشگاه گوگل
                                استفاده کنید.</Text>
                            <TouchableOpacity style={[styles.downloadButtons, {borderColor: 'red', borderWidth: 3}]}
                                              onPress={() => Linking.openURL('market://details?id=com.alver')}>
                                <Text style={GlobalVariables.DefaultButtonsText}>فروشگاه گوگل</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.downloadButtons}
                                              onPress={() => this.startDownload(appConfig.url.api + 'apk/', 'alver_v' + this.state.lastVersion + '.apk')}>
                                <Text style={GlobalVariables.DefaultButtonsText}>لینک مستقیم</Text>
                            </TouchableOpacity>
                        </View>
                }
                {
                    this.state.appSource ?
                        <TouchableOpacity
                            style={[styles.downloadButtons, {backgroundColor: GlobalVariables.BlueColor()}]}
                            onPress={() => this.installUpdate(this.state.appSource)}>
                            <Text style={GlobalVariables.DefaultButtonsText}>نصب برنامه</Text>
                        </TouchableOpacity>
                        : null
                }
            </View>
        );
    }

    renderSameVersion() {
        return (
            <View>
                <Text
                    style={[GlobalVariables.TextStyle('v', 'xl', 't'), {color: GlobalVariables.BrandColor()}]}>
                    شما در حال حاضر از آخرین نسخه برنامه استفاده می‌کنید.
                </Text>
                {this.renderLastVersionFeatures()}
            </View>
        );
    }

    renderOldVersion() {
        return (
            <View>
                <Text
                    style={[GlobalVariables.TextStyle('v', 'xl', 't')]}>
                    برای استفاده از تمامی امکانات آلور لطفا از طریق لینک زیر برنامه را به‌روز رسانی کنید.
                </Text>
                {this.renderLastVersionFeatures()}
                {this.lastVersionAddress()}
            </View>
        );
    }

    renderTrashVersion() {
        return (
            <View>
                <Text style={[GlobalVariables.TextStyle('v', 'xl', 't'), {color: GlobalVariables.RedColor()}]}>
                    نسخه شما توسط آلور پشتیبانی نمی‌شود. برای استفاده از امکانات آلور لطفا از طریق لینک
                    زیر برنامه را به‌روز رسانی کنید.
                </Text>
                {this.renderLastVersionFeatures()}
                {this.lastVersionAddress()}
            </View>
        );
    }

    renderLastVersionFeatures() {
        return (
            <View style={{marginTop: 10}}>
                <Text style={[GlobalVariables.TextStyle('v', 'l', 't')]}>
                    تغییرات آخرین نسخه
                </Text>
                <Text style={[GlobalVariables.TextStyle('l', 'me', 't'), {padding: 10}]}
                      numberOfLines={this.state.defaultLineNumber} ellipsizeMode='tail'
                      onTextLayout={({nativeEvent: {lines}}) =>
                          this.setState({
                              showMoreButton: lines.length !== this.state.defaultLineNumber,
                              lastChangesLineNumber: lines.length,
                          })
                      }
                >
                    {this.state.lastChanges.map((c, k) => {
                        return latinNumToPersianNum((k + 1) + '. ' + c) + '\n';
                    })}
                </Text>
                {this.state.showMoreButton ?
                    <Text onPress={() => this.setState({defaultLineNumber: this.state.lastChangesLineNumber})}
                          style={[GlobalVariables.TextStyle('l', 'm', 't'), {
                              paddingRight: 10,
                              paddingLeft: 10,
                              color: GlobalVariables.BlueColor(),
                          }]}>
                        نمایش بیشتر
                    </Text>
                    : null
                }
            </View>
        );
    }


    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {
                    this.state.networkError ?
                        <NetworkError onPress={() => this.getVersion()}/>
                        :
                        this.state.requestDone ?
                            <ScrollView showsVerticalScrollIndicator={false}
                                        style={{
                                            width: '100%',
                                            padding: 5,
                                            paddingBottom: 0,
                                        }}>
                                <View style={styles.logoWrapper}>
                                    <Image style={styles.logo}
                                           source={require('../../../Assets/Images/logo.png')}/>
                                    <View style={styles.versionsWrapper}>
                                        <View>
                                            <Text style={[GlobalVariables.TextStyle('v', 'l', 't')]}>
                                                {'آخرین نسخه : ' + latinNumToPersianNum(this.state.lastVersion)}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={[GlobalVariables.TextStyle('v', 'l', 't')]}>
                                                {'نسخه شما : ' + latinNumToPersianNum(this.state.myVersion)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    this.state.appStatus ?
                                        this.state.appStatus === 'same' ?
                                            this.renderSameVersion()
                                            : this.state.appStatus === 'old' ?
                                            this.renderOldVersion()
                                            : this.renderTrashVersion()
                                        :
                                        null
                                }
                                <View style={{marginBottom: 20}}/>
                            </ScrollView>
                            :
                            <View style={styles.loaderWrapper}>
                                <Loader type="refresh" color="#888"/>
                            </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 100,
        aspectRatio: 1,
    },
    versionsWrapper: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    downloadProgressWrapper: {
        width: '100%',
        // flexDirection: 'row',
        flex: 1,
        padding: 0,
        paddingBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    downloadButtonsBox: {
        padding: 10,
        // borderRadius: 5,
        width: '100%',
        marginBottom: 5,
        ...GlobalVariables.DefaultShadow,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadButtons: {
        ...GlobalVariables.DefaultButtons,
        padding: 10,
        // borderRadius: 5,
        width: '50%',
        marginBottom: 5,
        ...GlobalVariables.DefaultShadow,
    },
    progressBarWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: 'gray',
    },
});
