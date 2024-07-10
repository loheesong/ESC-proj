/**
 * Insert imports for the module you want to test here and replace the example code
 */

function sum(x,y) {
    return x + y;
}

describe('sum module', () => {
    test('adds 1 + 2 to equal 3', () => {
      expect(sum(1, 2)).toBe(3);
    });
});