import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import GlobalVariables from '../../../Modules/GlobalVariables';

import LoginLogout from '../../../Components/LoginLogout/LoginLogout';
import AdvanceAlert from '../../../Components/Alert/AdvanceAlert';
import {PostService} from '../../../Services/PostService';
import {HistoryService} from '../../../Services/HistoryService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advanceAlertModalVisible: false,
            advanceAlertModalTitle: '',
            extraAlertButtons: [],
        };
    }

    componentDidMount() {

    }

    clearLastVisits() {
        let extraAlertButtons = [
            {
                message: 'بله، حذف کن',
                iconName: 'trash-2',
                iconType: 'Feather',
                onPress: () => {
                    PostService.clearLastVisits();
                    this.closeAdvanceAlert();
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
            advanceAlertModalTitle: 'آیا از حذف همه بازدیدهای اخیر مطمئن هستید؟',
            advanceAlertModalVisible: true,
            extraAlertButtons,
        });
    }

    clearSearchHistory() {
        let extraAlertButtons = [
            {
                message: 'بله، حذف کن',
                iconName: 'trash-2',
                iconType: 'Feather',
                onPress: () => {
                    HistoryService.clearSearchHistory();
                    this.closeAdvanceAlert();
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
            advanceAlertModalTitle: 'آیا از حذف تاریخچه جستجو مطمئن هستید؟',
            advanceAlertModalVisible: true,
            extraAlertButtons,
        });
    }

    closeAdvanceAlert() {
        this.setState({
            advanceAlertModalVisible: false,
            advanceAlertModalTitle: '',
            extraAlertButtons: [],
        });
    }


    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <View style={{paddingBottom: 0}}>
                    <LoginLogout navigation={this.props.navigation} route={this.props.route}/>
                </View>
                <TouchableOpacity style={styles.buttons} onPress={() => this.clearLastVisits()}>
                    <Text style={[GlobalVariables.TextStyle('v', 'me1', 'dp')]}>
                        حذف همه بازدید‌های اخیر
                    </Text>
                </TouchableOpacity>
                <View style={styles.separator}/>
                <TouchableOpacity style={styles.buttons} onPress={() => this.clearSearchHistory()}>
                    <Text style={[GlobalVariables.TextStyle('v', 'me1', 'dp')]}>
                        حذف تاریخچه جستجو
                    </Text>
                </TouchableOpacity>
                <View style={styles.separator}/>
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
        padding: 15,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
    buttons: {
        padding: 15,
    },
});
