/* @flow */
import connectWithActions from '../connectWithActions';
import { getUsers } from '../selectors';
import TitlePrivate from './TitlePrivate';
import { NULL_USER } from '../nullObjects';

export default connectWithActions((state, props) => ({
  user: getUsers(state).find(x => x.email === props.narrow[0].operand) || NULL_USER,
}))(TitlePrivate);
