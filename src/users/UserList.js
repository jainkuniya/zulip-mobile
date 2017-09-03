/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, SectionList } from 'react-native';

import { StyleObj, User } from '../types';
import { RawLabel, SearchEmptyState } from '../common';
import UserItem from './UserItem';
import { sortUserList, filterUserList, groupUsersByInitials } from '../selectors';

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  groupHeader: {
    fontWeight: 'bold',
    paddingLeft: 8,
    fontSize: 18,
  },
});

export default class UserList extends PureComponent {
  props: {
    style?: StyleObj,
    filter: string,
    users: User[],
    selected: User[],
    onPress: (email: string) => void,
  };

  static defaultProps = {
    selected: [],
  };

  render() {
    const { filter, style, users, selected, onPress } = this.props;
    const shownUsers = sortUserList(filterUserList(users, filter));
    const groupedUsers = groupUsersByInitials(shownUsers);
    const sections = Object.keys(groupedUsers).map(key => ({ key, data: groupedUsers[key] }));
    const noResults = shownUsers.length === 0;

    if (noResults) {
      return <SearchEmptyState text="No users found" />;
    }

    return (
      <SectionList
        style={[styles.list, style]}
        keyboardShouldPersistTaps="always"
        initialNumToRender={20}
        sections={sections}
        exraData={selected}
        keyExtractor={item => item.email}
        renderItem={({ item }) => (
          <UserItem
            key={item.email}
            fullName={item.fullName}
            avatarUrl={item.avatarUrl}
            email={item.email}
            onPress={onPress}
            isSelected={selected.find(x => x.email === item.email)}
            status={item.status}
          />
        )}
        renderSectionHeader={({ section }) => (
          <RawLabel style={styles.groupHeader} text={section.key} />
        )}
      />
    );
  }
}
