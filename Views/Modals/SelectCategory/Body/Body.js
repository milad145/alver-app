import React, {Component} from 'react';

import CategoryBody from '../../../Components/Categories/CategoriesList/Body';

import {NavigationService} from '../../../Services/NavigationService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showParent: false,
        };
    }

    componentDidMount() {

    }

    onPressParent(cat) {
        let categories = this.props.route.params.categories || [];
        let type = this.props.route.params.type || 'Feed';
        categories.push(cat._id);
        NavigationService.push(this.props.navigation, 'SelectCategory', {
            cat, headerTitle: cat.title, back: true, categories, type,
        });
    }

    onPressChild(cat) {
        let categories = this.props.route.params.categories || [];
        categories.push(cat._id);
        NavigationService.navigate(this.props.navigation, this.props.route.params.type, {
            cat,
            categories,
        });
    }


    render() {
        let {type} = this.props.route.params;
        let showParent = type === 'Filter';
        return (
            <CategoryBody navigation={this.props.navigation} route={this.props.route} showParent={showParent}
                          onPressParent={(cat) => this.onPressParent(cat)}
                          onPressChild={(cat) => this.onPressChild(cat)}
            />
        );
    }
}
