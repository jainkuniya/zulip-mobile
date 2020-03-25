/* @flow strict-local */
import React, { PureComponent } from 'react';
import type { Node as React$Node } from 'react';
import { Animated, Easing, View, Text } from 'react-native';

import type { Style } from '../types';

type Props = $ReadOnly<{|
  children: React$Node,
  visible: boolean,
  style?: Style,
|}>;

type State = {|
  visible: boolean,
|};

export default class AnimatedScaleComponent extends PureComponent<Props, State> {
  state = {
    visible: this.props.visible,
    animatedValue: new Animated.Value(0),
    widthAnimatedValue: new Animated.Value(0),
    minWidth: 0,
    minHeight: 0,
    maxHeight: 200,
    maxWidth: 10000,
  };

  setMaxHeight = event => {
    this.setState({
      maxHeight: event.nativeEvent.layout.height,
      maxWidth: event.nativeEvent.layout.width,
    });
  };

  toggle = visible => {
    const initialValue = visible
      ? this.state.maxHeight + this.state.minHeight
      : this.state.minHeight;
    const finalValue = visible ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

    this.setState({
      visible,
    });

    this.state.animatedValue.setValue(initialValue);
    Animated.timing(this.state.animatedValue, {
      toValue: finalValue,
      duration: 300,
    }).start();

    const initialValueW = visible ? this.state.maxWidth + this.state.maxWidth : this.state.minWidth;
    const finalValueW = visible ? this.state.minWidth : this.state.maxWidth + this.state.minWidth;

    this.state.widthAnimatedValue.setValue(initialValueW);
    Animated.timing(this.state.widthAnimatedValue, {
      toValue: finalValueW,
      duration: 300,
    }).start();
  };

  componentDidMount() {
    // this.toggle(true);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.toggle(nextProps.visible);
  }

  render() {
    const { children, style } = this.props;
    // const animatedStyle = {
    //   transform: [
    //     {
    //       scaleY: this.animatedValue.interpolate({
    //         inputRange: [0, 25, 50, 75, 100],
    //         outputRange: [-1, 0.5, 0.75, 0.9, 1],
    //       }),
    //     },
    //   ],
    //   // height: this.animatedValue,
    //   // opacity: this.animatedValue,
    //   // display: visible ? 'flex' : 'none',
    // };

    const animatedStyle = {
      height: this.state.animatedValue,
      width: this.state.widthAnimatedValue,
    };

    return (
      <Animated.View style={[style, animatedStyle]}>
        <View style={style} onLayout={this.setMaxHeight}>
          {children}
        </View>
      </Animated.View>
    );
  }
}
