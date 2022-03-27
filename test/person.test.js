import Person from '../src/Person.js';

describe('Person', () => {
  let person;
  beforeEach(() => {
    person = new Person('tester', 0);
    person.prays = ['기도하자'];
  });

  test('getName', () => {
    expect(person.name).toBe('tester');
  });

  test('getId', () => {
    expect(person.id).toBe(0);
  });

  test('getPrays', () => {
    expect(person.prays[0]).toBe('기도하자');
  });

  test('getText', () => {
    expect(person.text).toBe('tester\n - 기도하자');
  });
});
