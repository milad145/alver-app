import React, {Component} from 'react';
import {Text} from 'react-native';
import moment from 'moment';

import {timeAgoTranslate} from '../../Modules/Assets';

export default class TimeAgo extends Component {
    props: {
        time: string,
        interval?: number,
        hideAgo?: boolean
    };
    state: { timer: null | number } = {timer: null};

    static defaultProps = {
        hideAgo: false,
        interval: 60000,
    };

    componentDidMount() {
        this.createTimer();
    }

    createTimer = () => {
        this.setState({
            timer: setTimeout(() => {
                this.update();
            }, this.props.interval),
        });
    };

    componentWillUnmount() {
        clearTimeout(this.state.timer);
    }

    update = () => {
        this.forceUpdate();
        this.createTimer();
    };

    render() {
        const {time, hideAgo} = this.props;
        let showingTime;
        let daysAgo = Math.floor((new Date() - new Date(time)) / 1000 / 86400);
        showingTime = moment(time).fromNow(hideAgo);
        // if (daysAgo <= 7) {
        //     showingTime = moment(time).fromNow(hideAgo);
        // } else if (daysAgo > 7 && new Date().getFullYear() === new Date(time).getFullYear()) {
        //     showingTime = moment(time).format('DD MMMM');
        // } else {
        //     showingTime = moment(time).format('DD MMMM YYYY');
        // }
        return (
            <Text {...this.props}>
                {timeAgoTranslate(showingTime)}
            </Text>
        );
    }
}
