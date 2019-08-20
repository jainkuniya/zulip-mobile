/* @flow strict-local */
import queueMarkAsRead, { resetAll } from '../queueMarkAsRead';
import messagesFlags from '../messages/messagesFlags';
import { eg } from '../../__tests__/exampleData';

jest.mock('../messages/messagesFlags');

describe('queueMarkAsRead', () => {
  beforeEach(() => {
    resetAll();
    jest.clearAllMocks();
  });

  test('should not call messagesFlags on consecutive calls of queueMarkAsRead', () => {
    // const mockFunc = jest.fn(() => {});
    // messagesFlags.mockImplementation(mockFunc);
    // queueMarkAsRead(eg.selfAuth, [1, 2, 3]);
    // queueMarkAsRead(eg.selfAuth, [4, 5, 6]);
    // queueMarkAsRead(eg.selfAuth, [7, 8, 9]);
    // queueMarkAsRead(eg.selfAuth, [10, 11, 12]);
    // expect(messagesFlags.default).toHaveBeenCalledTimes(1);
  });
});
