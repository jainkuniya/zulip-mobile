/* @flow strict-local */
import queueMarkAsRead, { resetAll } from '../queueMarkAsRead';
import * as messagesFlags from '../messages/messagesFlags';
import { sleep } from '../../utils/async';
import { eg } from '../../__tests__/exampleData';

messagesFlags.default = jest.fn(() => {});

describe('queueMarkAsRead', () => {
  beforeEach(() => {
    resetAll();
    jest.clearAllMocks();
  });

  test('should not call messagesFlags on consecutive calls of queueMarkAsRead', () => {
    queueMarkAsRead(eg.selfAuth, [1, 2, 3]);
    queueMarkAsRead(eg.selfAuth, [4, 5, 6]);
    queueMarkAsRead(eg.selfAuth, [7, 8, 9]);
    queueMarkAsRead(eg.selfAuth, [10, 11, 12]);

    expect(messagesFlags.default).toHaveBeenCalledTimes(1);
  });

  test('should call messagesFlags, if calls to queueMarkAsRead are 2s apart', async () => {
    queueMarkAsRead(eg.selfAuth, [13, 14, 15]);
    await sleep(3000);
    queueMarkAsRead(eg.selfAuth, [16, 17, 18]);

    expect(messagesFlags.default).toHaveBeenCalledTimes(2);
  });
});
