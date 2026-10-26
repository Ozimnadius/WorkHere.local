// Адреса картинок страны. Отдельно от ru.js потому, что тот файл читает ещё и
// сборщик, а импорты картинок Node не понимает.
//
// Импортом, а не строкой пути: строку Vite не обрабатывает, и в собранном виде
// файла по такому адресу нет. Инлайн мелких аватарок в base64 отключён
// в vite.config.js — они нужны только при открытии всплывашки, а из бандла их
// пришлось бы качать всем и без кеширования.
import person1 from '../assets/figma/geography/avatars/ru/person-1.webp';
import person2 from '../assets/figma/geography/avatars/ru/person-2.webp';
import person3 from '../assets/figma/geography/avatars/ru/person-3.webp';
import person4 from '../assets/figma/geography/avatars/ru/person-4.webp';
import person5 from '../assets/figma/geography/avatars/ru/person-5.webp';
import person6 from '../assets/figma/geography/avatars/ru/person-6.webp';
import person7 from '../assets/figma/geography/avatars/ru/person-7.webp';
import person8 from '../assets/figma/geography/avatars/ru/person-8.webp';

export default {
  'person-1': person1,
  'person-2': person2,
  'person-3': person3,
  'person-4': person4,
  'person-5': person5,
  'person-6': person6,
  'person-7': person7,
  'person-8': person8,
};
