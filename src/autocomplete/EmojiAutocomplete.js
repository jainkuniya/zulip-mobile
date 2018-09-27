/* @flow */
import { connect } from 'react-redux';

import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';

import { Popup } from '../common';
import EmojiRow from '../emoji/EmojiRow';
import getFilteredEmojiList from '../emoji/getFilteredEmojiList';
import type { GlobalState, RealmEmojiState } from '../types';
import { getActiveRealmEmojiById } from '../selectors';

type Props = {
  filter: string,
  realmEmoji: RealmEmojiState,
  onAutocomplete: (name: string) => void,
};

const MAX_CHOICES = 30;

class EmojiAutocomplete extends PureComponent<Props> {
  props: Props;

  render() {
    const { filter, realmEmoji, onAutocomplete } = this.props;

    if (filter.length === 0) {
      return null;
    }

    const emojis = getFilteredEmojiList(filter, realmEmoji);

    if (emojis.length === 0) {
      return null;
    }

    return (
      <Popup>
        <FlatList
          keyboardShouldPersistTaps="always"
          initialNumToRender={12}
          data={emojis.slice(0, MAX_CHOICES)}
          keyExtractor={item => item}
          renderItem={({ item }) => <EmojiRow name={item} onPress={() => onAutocomplete(item)} />}
        />
      </Popup>
    );
  }
}

export default connect((state: GlobalState) => ({
  realmEmoji: getActiveRealmEmojiById(state),
}))(EmojiAutocomplete);
