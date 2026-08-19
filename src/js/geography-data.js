// Демо-данные для всплывашки секции «Вся география вакансий на одной карте».
// Реальные данные заказчика подставляются сюда — разметка и логика не меняются.
//
// Название города и число вакансий берутся из разметки пина в index.html
// (data-geography-city / data-geography-count), здесь их дублировать не нужно.
// Ключ объекта = значение атрибута data-geography-pin у пина.

const AVATARS = {
  a1: '/src/assets/figma/geography/avatars/person-1.webp',
  a2: '/src/assets/figma/geography/avatars/person-2.webp',
  a3: '/src/assets/figma/geography/avatars/person-3.webp',
  a4: '/src/assets/figma/geography/avatars/person-4.webp',
  a5: '/src/assets/figma/geography/avatars/person-5.webp',
  a6: '/src/assets/figma/geography/avatars/person-6.webp',
  a7: '/src/assets/figma/geography/avatars/person-7.webp',
  a8: '/src/assets/figma/geography/avatars/person-8.webp',
};

const VACANCIES = {
  producer: {
    title: 'Креативный продюсер спецпроектов',
    salary: 'от 120 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a1, AVATARS.a2, AVATARS.a3, AVATARS.a4, AVATARS.a5],
    applicantsRest: 24,
  },
  frontend: {
    title: 'Senior Frontend Developer',
    salary: 'от 280 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a6, AVATARS.a2, AVATARS.a1],
    applicantsRest: 0,
  },
  vip: {
    title: 'Менеджер по работе с VIP клиентами',
    salary: 'от 180 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a7, AVATARS.a3, AVATARS.a5, AVATARS.a2],
    applicantsRest: 0,
  },
  designer: {
    title: 'UX/UI дизайнер',
    salary: 'от 170 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a4, AVATARS.a8, AVATARS.a6, AVATARS.a3, AVATARS.a1],
    applicantsRest: 24,
  },
  backend: {
    title: 'Backend-разработчик (Go/Python)',
    salary: 'от 240 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a6, AVATARS.a7, AVATARS.a8, AVATARS.a2],
    applicantsRest: 0,
  },
  marketing: {
    title: 'Маркетолог digital-проектов',
    salary: 'от 150 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a4, AVATARS.a7, AVATARS.a5],
    applicantsRest: 0,
  },
  sales: {
    title: 'Менеджер по продажам B2B',
    salary: 'от 95 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a8, AVATARS.a2, AVATARS.a7, AVATARS.a3, AVATARS.a6],
    applicantsRest: 24,
  },
  logist: {
    title: 'Логист транспортной компании',
    salary: 'от 90 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a1, AVATARS.a7, AVATARS.a6, AVATARS.a8, AVATARS.a4],
    applicantsRest: 0,
  },
  warehouse: {
    title: 'Руководитель склада',
    salary: 'от 110 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a3, AVATARS.a7, AVATARS.a5, AVATARS.a6],
    applicantsRest: 0,
  },
  projectManager: {
    title: 'Менеджер проектов / project manager EdTech',
    salary: 'от 65 000 ₽ за месяц, на руки',
    applicants: [AVATARS.a6, AVATARS.a7, AVATARS.a8],
    applicantsRest: 0,
  },
};

const pick = (...keys) => keys.map((key) => VACANCIES[key]);

export const VACANCIES_BY_CITY = {
  spb: pick('frontend', 'designer', 'marketing', 'projectManager'),
  moscow: pick('producer', 'projectManager', 'vip', 'backend'),
  perm: pick('logist', 'warehouse', 'sales', 'backend'),
  kazan: pick('sales', 'marketing', 'designer', 'warehouse'),
  rostov: pick('logist', 'sales', 'warehouse', 'vip'),
  ekb: pick('backend', 'frontend', 'designer', 'sales'),
  surgut: pick('warehouse', 'logist', 'vip', 'marketing'),
  yakutsk: pick('logist', 'warehouse', 'marketing', 'projectManager'),
  krasnoyarsk: pick('sales', 'backend', 'producer', 'logist'),
  novosibirsk: pick('frontend', 'backend', 'designer', 'vip'),
};

export function pluralizeVacancies(count) {
  const mod100 = count % 100;
  const mod10 = count % 10;

  if (mod100 >= 11 && mod100 <= 14) {
    return 'вакансий';
  }
  if (mod10 === 1) {
    return 'вакансия';
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'вакансии';
  }

  return 'вакансий';
}
