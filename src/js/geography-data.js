// Данные всплывашки собираются из конфига активной страны.
// Какая страна активна, решает псевдоним @country в vite.config.js — он зависит
// от режима сборки (vite build --mode kz). В бандл попадает только одна страна.
import country from '@country';
import assets from '@country-assets';

// В конфиге страны картинки записаны именами файлов, здесь подменяем их
// на настоящие адреса, которые выдал сборщик.
const resolveVacancy = (vacancy) => ({
  title: vacancy.title,
  salary: vacancy.salary,
  applicants: vacancy.avatars.map((name) => assets[name]).filter(Boolean),
  applicantsRest: vacancy.rest || 0,
});

// Город показывает столько карточек, сколько у него на бейдже. Откуда их брать,
// зависит от страны: в макете Казахстана и Узбекистана вакансии расписаны по
// городам, в макете России — общим пулом на всех. Пул перебирается по кругу,
// если городу нужно больше, чем в нём есть. Из общего пула каждый город
// начинает со своего смещения, чтобы у соседей списки не совпадали.
const vacanciesFor = (city, cityIndex) => {
  const pool = city.vacancies || country.vacancies || [];
  const offset = city.vacancies ? 0 : cityIndex;

  if (!pool.length) {
    return [];
  }

  return Array.from(
    {length: city.count},
    (_, step) => resolveVacancy(pool[(offset + step) % pool.length]),
  );
};

export const VACANCIES_BY_CITY = Object.fromEntries(
  country.cities.map((city, index) => [city.id, vacanciesFor(city, index)]),
);

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
