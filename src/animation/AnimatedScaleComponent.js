/* @flow */
import React, { PureComponent } from 'react';
import type { ChildrenArray } from 'react';
import { Animated, Easing } from 'react-native';

import type { StyleObj } from '../types';

type Props = {
  children: ChildrenArray<*>,
  visible: boolean,
  style?: StyleObj,
};

export default class AnimatedScaleComponent extends PureComponent<Props> {
  props: Props;

  state = {
    visible: this.props.visible,
  };

  animatedValue = new Animated.Value(this.props.visible ? 1 : 0);

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }
    Animated.timing(this.animatedValue, {
      toValue: nextProps.visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.elastic(),
    }).start((finished: boolean) => finished && this.setState({ visible: nextProps.visible }));
  }

  render() {
    const { children, style } = this.props;
    const { visible } = this.state;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
      opacity: this.animatedValue,
      display: visible ? 'flex' : 'none',
    };

    return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
  }
}
