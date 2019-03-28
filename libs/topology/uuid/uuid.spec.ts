import { s4, s8, s12 } from './uuid';

describe('UUID', () => {
  it('s4', function() {
    const arr = [];
    for (let i = 0; i < 1000; ++i) {
      arr.push(s4());
    }

    const s = new Set(arr);
    expect(arr.length).toEqual(1000);
    expect(s.size < arr.length).toEqual(true);
  });

  it('s8', function() {
    const arr = [];
    for (let i = 0; i < 20000; ++i) {
      arr.push(s8());
    }

    const s = new Set(arr);
    expect(arr.length).toEqual(20000);
    expect(s.size).toEqual(20000);
  });

  it('s12', function() {
    const arr = [];
    // It can be bigger.
    for (let i = 0; i < 1000000; ++i) {
      arr.push(s12());
    }

    const s = new Set(arr);
    expect(arr.length).toEqual(1000000);
    expect(s.size).toEqual(1000000);
  });
});
