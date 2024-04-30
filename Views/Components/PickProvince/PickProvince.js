import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import GlobalVariables from '../../Modules/GlobalVariables';

import DropDownPicker from '../../Components/Picker/Picker';

import Data from '../../Assets/Data/Data';

export default class PickProvince extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: Data.provinces,
            isVisible: false,
            key: Math.floor(Math.random() * 100) + '_dropDown',
        };
    }

    componentDidMount() {
        const {defaultValue} = this.props;
        if (typeof defaultValue !== 'undefined') {
            this.setState({province: defaultValue});
        }
        this.listener = EventRegister.addEventListener('dropDown', (data) => {
            this.setState({isVisible: false});
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    }

    render() {
        return (
            <View style={styles.body}>
                <Text onPress={() => this.setState({isVisible: false})}>block</Text>
                <DropDownPicker
                    searchable={true}
                    items={this.state.items}
                    defaultValue={this.state.province}
                    containerStyle={{height: 50}}
                    dropDownMaxHeight={250}
                    style={{backgroundColor: '#fafafa'}}
                    itemStyle={{
                        justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{backgroundColor: 'white'}}
                    onChangeItem={item => {
                        this.setState({
                            province: item.value,
                        });
                        this.props.onChange(item.value);
                    }}
                    placeholder="انتخاب استان"
                    searchablePlaceholder="جستجوی استان"
                    placeholderStyle={[GlobalVariables.TextStyle('v', 'l')]}
                    labelStyle={[GlobalVariables.TextStyle('v', 'l'), {paddingRight: 20}]}
                    activeItemStyle={{backgroundColor: '#f0f0f0'}}
                    activeLabelStyle={[GlobalVariables.TextStyle('b')]}
                    searchableStyle={[GlobalVariables.TextStyle('v')]}
                    searchableError={() => <Text style={[GlobalVariables.TextStyle('v')]}>یافت نشد</Text>}
                    isVisible={this.state.isVisible}
                    onOpen={() => EventRegister.emit('dropDown', this.state.key)}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {},
});
