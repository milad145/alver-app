import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import GlobalVariables from '../../Modules/GlobalVariables';

import DropDownPicker from '../../Components/Picker/Picker';

import Data from '../../Assets/Data/Data';

export default class PickCities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            items: [],
            disabled: true,
            isVisible: false,
            key: Math.floor(Math.random() * 100) + '_dropDown',
        };
    }

    componentDidMount() {
        this.updateItems();
        this.listener = EventRegister.addEventListener('dropDown', (data) => {
            this.setState({isVisible: false});
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    }

    componentDidUpdate() {
        const {defaultValue} = this.props;
        if (defaultValue !== this.state.defaultValue) {
            this.updateItems();
        }
    }

    updateItems() {
        const {defaultValue} = this.props;
        let cities = Data.cities.filter((i) => i.parent === defaultValue);
        let items = cities;
        let disabled = true;
        if (cities.length) {
            items = [{'label': 'انتخاب همه شهرها', 'value': 0}, ...items];
            disabled = false;
        }
        this.setState({cities, items, defaultValue, city: null, disabled});
    }

    render() {
        return (
            <View style={styles.body}>
                <DropDownPicker
                    searchable={true}
                    items={this.state.items}
                    defaultValue={this.state.city}
                    containerStyle={{height: 50}}
                    dropDownMaxHeight={250}
                    style={{backgroundColor: '#fafafa'}}
                    itemStyle={{
                        justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{backgroundColor: 'white'}}
                    onChangeItem={item => {
                        this.setState({
                            city: item.value,
                        });
                        this.props.onChange(item.value);
                    }}
                    placeholder="انتخاب شهر"
                    searchablePlaceholder="جستجوی شهر"
                    placeholderStyle={[GlobalVariables.TextStyle('v', 'l')]}
                    labelStyle={[GlobalVariables.TextStyle('v', 'l'), {paddingRight: 20}]}
                    activeItemStyle={{backgroundColor: '#f0f0f0'}}
                    activeLabelStyle={[GlobalVariables.TextStyle('b')]}
                    searchableStyle={[GlobalVariables.TextStyle('v')]}
                    searchableError={() => <Text style={[GlobalVariables.TextStyle('v')]}>یافت نشد</Text>}
                    disabled={this.state.disabled}
                    isVisible={this.state.isVisible}
                    onOpen={() => EventRegister.emit('dropDown', this.state.key)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {}
});
