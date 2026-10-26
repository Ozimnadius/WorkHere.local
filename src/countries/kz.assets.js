// Адреса картинок страны. Отдельно от kz.js потому, что тот файл читает ещё и
// сборщик, а импорты картинок Node не понимает.
//
// Импортом, а не строкой пути: строку Vite не обрабатывает, и в собранном виде
// файла по такому адресу нет. Инлайн мелких аватарок в base64 отключён
// в vite.config.js — они нужны только при открытии всплывашки, а из бандла их
// пришлось бы качать всем и без кеширования.
import person1 from '../assets/figma/geography/avatars/kz/person-1.webp';
import person2 from '../assets/figma/geography/avatars/kz/person-2.webp';
import person3 from '../assets/figma/geography/avatars/kz/person-3.webp';
import person4 from '../assets/figma/geography/avatars/kz/person-4.webp';
import person5 from '../assets/figma/geography/avatars/kz/person-5.webp';
import person6 from '../assets/figma/geography/avatars/kz/person-6.webp';
import person7 from '../assets/figma/geography/avatars/kz/person-7.webp';
import person8 from '../assets/figma/geography/avatars/kz/person-8.webp';
import person9 from '../assets/figma/geography/avatars/kz/person-9.webp';
import person10 from '../assets/figma/geography/avatars/kz/person-10.webp';
import person11 from '../assets/figma/geography/avatars/kz/person-11.webp';
import person12 from '../assets/figma/geography/avatars/kz/person-12.webp';
import person13 from '../assets/figma/geography/avatars/kz/person-13.webp';
import person14 from '../assets/figma/geography/avatars/kz/person-14.webp';
import person15 from '../assets/figma/geography/avatars/kz/person-15.webp';
import person16 from '../assets/figma/geography/avatars/kz/person-16.webp';
import person17 from '../assets/figma/geography/avatars/kz/person-17.webp';
import person18 from '../assets/figma/geography/avatars/kz/person-18.webp';
import person19 from '../assets/figma/geography/avatars/kz/person-19.webp';
import person20 from '../assets/figma/geography/avatars/kz/person-20.webp';
import person21 from '../assets/figma/geography/avatars/kz/person-21.webp';
import person22 from '../assets/figma/geography/avatars/kz/person-22.webp';
import person23 from '../assets/figma/geography/avatars/kz/person-23.webp';
import person24 from '../assets/figma/geography/avatars/kz/person-24.webp';
import person25 from '../assets/figma/geography/avatars/kz/person-25.webp';
import person26 from '../assets/figma/geography/avatars/kz/person-26.webp';
import person27 from '../assets/figma/geography/avatars/kz/person-27.webp';
import person28 from '../assets/figma/geography/avatars/kz/person-28.webp';
import person29 from '../assets/figma/geography/avatars/kz/person-29.webp';
import person30 from '../assets/figma/geography/avatars/kz/person-30.webp';
import person31 from '../assets/figma/geography/avatars/kz/person-31.webp';
import person32 from '../assets/figma/geography/avatars/kz/person-32.webp';
import person33 from '../assets/figma/geography/avatars/kz/person-33.webp';
import person34 from '../assets/figma/geography/avatars/kz/person-34.webp';

export default {
  'person-1': person1,
  'person-2': person2,
  'person-3': person3,
  'person-4': person4,
  'person-5': person5,
  'person-6': person6,
  'person-7': person7,
  'person-8': person8,
  'person-9': person9,
  'person-10': person10,
  'person-11': person11,
  'person-12': person12,
  'person-13': person13,
  'person-14': person14,
  'person-15': person15,
  'person-16': person16,
  'person-17': person17,
  'person-18': person18,
  'person-19': person19,
  'person-20': person20,
  'person-21': person21,
  'person-22': person22,
  'person-23': person23,
  'person-24': person24,
  'person-25': person25,
  'person-26': person26,
  'person-27': person27,
  'person-28': person28,
  'person-29': person29,
  'person-30': person30,
  'person-31': person31,
  'person-32': person32,
  'person-33': person33,
  'person-34': person34,
};
