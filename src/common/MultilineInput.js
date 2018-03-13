/* @flow */
import React, { PureComponent } from 'react';
import { TextInput } from 'react-native';

import type { LocalizableText, StyleObj } from '../types';
import { Input } from '../common';

type Props = {
  style?: StyleObj,
  placeholder?: LocalizableText,
  value: string,
  onChange?: (text: string) => void,
  onBlur?: () => void,
  onFocus?: () => void,
  onHeightChange?: (height: number) => void,
  onSelectionChange?: (event: Object) => void,
  textInputRef?: (component: any) => void,
};

export default class MultilineInput extends PureComponent<Props> {
  props: Props;

  static defaultProps = {
    placeholder: {},
  };

  textInput: TextInput;

  render() {
    const { onChange, ...restProps } = this.props;

    return (
      <Input
        multiline
        overScrollMode="never"
        bounces={false}
        underlineColorAndroid="transparent"
        onChangeText={onChange}
        {...restProps}
      />
    );
  }
}
