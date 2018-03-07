/* @flow */
import { createSelector } from 'reselect';

import { BRAND_COLOR } from '../styles';
import { getSubscriptions } from '../directSelectors';
import { getCurrentRoute } from '../baseSelectors';
import { foregroundColorFromBackground } from '../utils/color';
import { isStreamNarrow, isTopicNarrow } from '../utils/narrow';
import { NULL_SUBSCRIPTION } from '../nullObjects';

export const getIsInTopicOrStreamNarrow = (narrow: Narrow) =>
  createSelector(
    getCurrentRoute,
    route => (route === 'chat' ? isStreamNarrow(narrow) || isTopicNarrow(narrow) : false),
  );

export const getTitleBackgroundColor = (narrow: Narrow) =>
  createSelector(
    getSubscriptions,
    getIsInTopicOrStreamNarrow(narrow),
    (subscriptions, isInTopicOrStreamNarrow) =>
      isInTopicOrStreamNarrow
        ? (subscriptions.find(sub => narrow[0].operand === sub.name) || NULL_SUBSCRIPTION).color
        : 'transparent',
  );

export const getTitleTextColor = (narrow: Narrow) =>
  createSelector(
    getTitleBackgroundColor(narrow),
    getIsInTopicOrStreamNarrow(narrow),
    (backgroundColor, isInTopicOrStreamNarrow) =>
      backgroundColor && isInTopicOrStreamNarrow
        ? foregroundColorFromBackground(backgroundColor)
        : BRAND_COLOR,
  );
