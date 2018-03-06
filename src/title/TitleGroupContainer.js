/* @flow */
import connectWithActions from '../connectWithActions';
import { getRecipientsInGroupNarrow, getUsers } from '../selectors';
import TitleGroup from './TitleGroup';

export default connectWithActions((state, props) => ({
  recipients: getRecipientsInGroupNarrow(props.narrow, getUsers(state)),
}))(TitleGroup);
