import { holidaysInRange } from './holidays';

test('1970 - 1972', () => {
  expect(holidaysInRange(1970, 1972)).toStrictEqual([
    {
      valentinesDay: 'Saturday, 14.02.1970',
      easter: 'Sunday, 29.03.1970',
      christmas: 'Friday, 25.12.1970',
    },
    {
      valentinesDay: 'Sunday, 14.02.1971',
      easter: 'Sunday, 11.04.1971',
      christmas: 'Saturday, 25.12.1971',
    },
    {
      valentinesDay: 'Monday, 14.02.1972',
      easter: 'Sunday, 02.04.1972',
      christmas: 'Monday, 25.12.1972',
    }
  ]);
});

test('1970 - 1972', () => {
  expect(holidaysInRange(1970, 1972)).toStrictEqual([
    {
      valentinesDay: 'Saturday, 14.02.1970',
      easter: 'Sunday, 29.03.1970',
      christmas: 'Friday, 25.12.1970',
    },
    {
      valentinesDay: 'Sunday, 14.02.1971',
      easter: 'Sunday, 11.04.1971',
      christmas: 'Saturday, 25.12.1971',
    },
    {
      valentinesDay: 'Monday, 14.02.1972',
      easter: 'Sunday, 02.04.1972',
      christmas: 'Monday, 25.12.1972',
    }
  ]);
});

test('Invalid start year', () => {
  expect(holidaysInRange(100, 200)).toStrictEqual([]);
});

test('Start year greater than end year', () => {
  expect(holidaysInRange(2022, 2020)).toStrictEqual([]);
});

test('2000 - 2002', () => {
  expect(holidaysInRange(2000, 2002)).toStrictEqual([
    {
      valentinesDay: 'Monday, 14.02.2000',
      easter: 'Sunday, 23.04.2000',
      christmas: 'Monday, 25.12.2000',
    },
    {
      valentinesDay: 'Wednesday, 14.02.2001',
      easter: 'Sunday, 15.04.2001',
      christmas: 'Tuesday, 25.12.2001',
    },
    {
      valentinesDay: 'Thursday, 14.02.2002',
      easter: 'Sunday, 31.03.2002',
      christmas: 'Wednesday, 25.12.2002',
    }
  ]);
});

test('2023 - 2025', () => {
  expect(holidaysInRange(2023, 2025)).toStrictEqual([
    {
      valentinesDay: 'Tuesday, 14.02.2023',
      easter: 'Sunday, 09.04.2023',
      christmas: 'Monday, 25.12.2023',
    },
    {
      valentinesDay: 'Wednesday, 14.02.2024',
      easter: 'Sunday, 31.03.2024',
      christmas: 'Wednesday, 25.12.2024',
    },
    {
      valentinesDay: 'Friday, 14.02.2025',
      easter: 'Sunday, 20.04.2025',
      christmas: 'Thursday, 25.12.2025',
    }
  ]);
});

