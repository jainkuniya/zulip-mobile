/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import AutoCompleteView from './AutoCompleteView';
import TopicAutocomplete from './TopicAutocomplete';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default class AutoCompleteViewWrapper extends PureComponent<Props> {
  render() {
    return <View />;
  }
}
