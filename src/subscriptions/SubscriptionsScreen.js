import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';

import { Auth } from '../types';
import boundActions from '../boundActions';
import SearchScreen from '../search/SearchScreen';
import { subscriptionAdd, subscriptionRemove } from '../api';
import StreamList from '../streamlist/StreamList';
import { getAuth } from '../account/accountSelectors';


class SubscriptionsScreen extends React.Component {

  props: {
    auth: Auth,
    streams: [],
    subscriptions: [],
  };

  state: {
    filter: string,
  };

  constructor() {
    super();
    this.state = {
      filter: '',
    };
  }

  handleFilterChange = (filter: string) => this.setState({ filter });

  handleSwitchChange = (streamName: string, switchValue: boolean) => {
    const { auth } = this.props;

    if (switchValue) {
      subscriptionAdd(auth, [{ name: streamName }]);
    } else {
      subscriptionRemove(auth, [streamName]);
    }
  };

  render() {
    const { streams, subscriptions } = this.props;
    const { filter } = this.state;
    const filteredStreams = streams.filter(x => x.name.includes(filter));
    const subsAndStreams = filteredStreams.map(x => ({
      ...x,
      subscribed: subscriptions.some(s => s.stream_id === x.stream_id),
    }));

    return (
      <SearchScreen
        title="Subscriptions"
        searchBarOnChange={this.handleFilterChange}
        searchBar
        showCancelIcon={Platform.OS === 'android' && filter.length > 0}
      >
        <StreamList
          streams={subsAndStreams}
          showSwitch
          showDescriptions
          onNarrow={() => {}}
          onSwitch={this.handleSwitchChange}
        />
      </SearchScreen>
    );
  }
}

export default connect(
  (state) => ({
    auth: getAuth(state),
    streams: state.streams,
    subscriptions: state.subscriptions,
  }),
  boundActions,
)(SubscriptionsScreen);
