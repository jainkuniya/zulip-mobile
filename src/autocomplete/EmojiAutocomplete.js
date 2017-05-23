import React, { Component } from 'react';

import { Popup } from '../common';
import EmojiRow from '../emoji/EmojiRow';
import getFilteredEmojiList from '../emoji/getFilteredEmojiList';

export default class EmojiAutocomplete extends Component {

  props: {
    filter: string;
    onAutocomplete: (name: string) => {},
  };

  render() {
    const { filter, onAutocomplete } = this.props;
    const emojis = getFilteredEmojiList(filter);
    const itemCount = emojis.length;

    if (itemCount === 0) return null;

    return (
      <Popup
        height={(itemCount > 5) ? 190 : itemCount * 38}
      >
        {emojis.map(x => (
          <EmojiRow
            key={x}
            name={x}
            onPress={() => onAutocomplete(x)}
          />
        ))}
      </Popup>
    );
  }
}
