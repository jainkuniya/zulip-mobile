/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import type { InputSelectionType } from '../types';
import AutoCompleteView from './AutoCompleteView';
import TopicAutocomplete from './TopicAutocomplete';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

type Props = {
  marginBottom: number,
  isTopicFocused: boolean,
  topicText: string,
  onTopicAutocomplete: () => void,
  composeText: string,
  onMessageAutocomplete: () => void,
  messageSelection: InputSelectionType,
};

export default class AutoCompleteViewWrapper extends PureComponent<Props> {
  render() {
    const {
      marginBottom,
      isTopicFocused,
      topicText,
      onTopicAutocomplete,
      composeText,
      onMessageAutocomplete,
      messageSelection,
    } = this.props;
    return (
      <View style={[styles.wrapper, { marginBottom }]}>
        <TopicAutocomplete
          isFocused={isTopicFocused}
          text={topicText}
          onAutocomplete={onTopicAutocomplete}
        />
        <AutoCompleteView
          text={composeText}
          onAutocomplete={onMessageAutocomplete}
          selection={messageSelection}
        />
      </View>
    );
  }
}
