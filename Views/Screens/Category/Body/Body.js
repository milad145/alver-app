import React, {Component} from 'react';

import CategoryBody from '../../../Components/Categories/CategoriesList/Body';

import {NavigationService} from '../../../Services/NavigationService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <CategoryBody navigation={this.props.navigation} route={this.props.route} showParent={true}
                          onPressParent={(cat) => {
                              NavigationService.push(this.props.navigation, 'Category', {
                                  cat,
                                  headerTitle: cat.title, back: true,
                              });
                          }}
                          onPressChild={(cat) => {
                              NavigationService.navigate(this.props.navigation, 'Filter', {
                                  cat,
                                  back: true,
                                  searchKey: '',
                              });
                          }}
            />
        );
    }
}
