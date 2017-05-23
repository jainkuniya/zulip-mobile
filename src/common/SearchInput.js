import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../common';
import { IconCancel } from '../common/Icons';
import { BRAND_COLOR } from '../styles';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 0,
    // color: BRAND_COLOR,
  },
  icon: {
    margin: 6,
  }
});

export default class SearchInput extends Component {

  props: {
    onChange: (text: string) => void,
  };

  handleClear = () => {
    this.textInput.clear();
    this.props.onChange('');
  }

  render() {
    const { onChange, showCancelIcon } = this.props;

    return (
      <View style={styles.wrapper}>
        <Input
          textInputRef={component => { this.textInput = component; }}
          style={styles.input}
          autoCorrect={false}
          enablesReturnKeyAutomatically
          selectTextOnFocus
          underlineColorAndroid="transparent"
          clearButtonMode="always"
          autoCapitalize="none"
          placeholder="Search"
          returnKeyType="search"
          onChangeText={onChange}
          autoFocus
        />
        { showCancelIcon &&
          <IconCancel
            style={styles.icon}
            size={20}
            color={BRAND_COLOR}
            onPress={this.handleClear}
          />
        }
      </View>
    );
  }
}
