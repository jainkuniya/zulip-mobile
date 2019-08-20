jest.mock('../foo'); // this happens automatically with automocking
const foo = require('../foo');

// foo is a mock function
foo.mockImplementation(() => 42);

describe('foo', () => {
  test('testing mocking function', () => {
    console.log(foo());
  });
});
