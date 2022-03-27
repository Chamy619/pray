import People from '../src/People.js';

describe('people', () => {
  let people;
  beforeEach(() => {
    people = new People();
  });

  test('addPerson', () => {
    people.addPerson('채훈');
    expect(people.people[0].name).toBe('채훈');
  });

  test('removePerson', () => {
    people.addPerson('채훈');
    people.addPerson('지수');
    people.addPerson('소연');
    people.addPerson('의형');
    people.addPerson('예진');
    people.addPerson('정민');
    people.addPerson('지호');
    people.addPerson('유나');
    people.removePerson(7);
    expect(people.getPerson(7)).toBe(undefined);
  });
});
