// Плагин подставляет в index.html данные активной страны: адрес и размеры
// карты и разметку пинов. Делает это на этапе сборки, поэтому в готовом файле
// лежит обычный статичный HTML — пины не рендерятся в браузере.
//
// order: 'pre' важен. Так подстановка происходит до того, как Vite разберёт
// адреса картинок в HTML, и карта проходит обычную обработку — попадает
// в сборку с хешем в имени.
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

import {pluralizeVacancies} from '../src/countries/plural.js';

const MAP_DIR = '/src/assets/figma/geography';
const PIN_INDENT = ' '.repeat(16);

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Разметка повторяет ту, что была написана руками: бокс пина равен кружку,
// плашка лежит абсолютом, сторону её раскрытия выбирает geography.js.
const renderPin = (city) => {
  const name = escapeHtml(city.name);
  const label = `${city.count} ${pluralizeVacancies(city.count)}`;
  const lines = [
    '<button class="geography__pin"',
    '        type="button"',
    `        style="--pin-x: ${city.x}%; --pin-y: ${city.y}%;"`,
    `        data-geography-pin="${escapeHtml(city.id)}"`,
    `        data-geography-city="${name}"`,
    `        data-geography-count="${city.count}"`,
    '        aria-expanded="false"',
    `        aria-label="${name}, ${label}"`,
    '>',
    '  <span class="geography__pin-marker">',
    '    <span class="geography__pin-badge"',
    '          aria-hidden="true"',
    `    >${city.count}</span>`,
    '    <img class="geography__pin-tail"',
    `         src="${MAP_DIR}/pin-tail.svg"`,
    '         width="16"',
    '         height="11"',
    '         alt=""',
    '         aria-hidden="true"',
    '    >',
    '  </span>',
    '  <span class="geography__pin-plate"',
    '        aria-hidden="true"',
    '  >',
    `    <span class="geography__pin-city">${name}</span>`,
    `    <span class="geography__pin-count">${label}</span>`,
    '  </span>',
    '</button>',
  ];

  return lines.map((line) => PIN_INDENT + line).join('\n');
};

// Вертикальная раскладка страны одной строкой стилей. Кнопку держим под самым
// нижним пином: его позиция и так есть в списке городов, в макете остаётся
// только зазор. Так при смене набора городов кнопка не наедет на плашку.
const renderLayout = (layout, cities) => {
  if (!layout) {
    return '';
  }

  const bottom = Math.max(...cities.map((city) => city.y));

  return [
    `--mascot-top: ${layout.mascotTop}px`,
    `--features-top: ${layout.featuresTop}px`,
    `--cta-anchor: ${bottom}%`,
    `--cta-gap: ${layout.ctaGap}px`,
  ].join('; ');
};

export default function geographyCountry(countryId) {
  let country = null;

  return {
    name: 'geography-country',

    async buildStart() {
      const file = resolve(process.cwd(), 'src/countries', `${countryId}.js`);
      const module = await import(pathToFileURL(file).href);

      country = module.default;
    },

    transformIndexHtml: {
      order: 'pre',

      async handler(html) {
        if (!country) {
          const file = resolve(process.cwd(), 'src/countries', `${countryId}.js`);

          country = (await import(pathToFileURL(file).href)).default;
        }

        const {map, cities, layout} = country;

        return html
          .replaceAll('%GEOGRAPHY_MAP%', `${MAP_DIR}/${map.file}`)
          .replaceAll('%GEOGRAPHY_MAP_WIDTH%', String(map.width))
          .replaceAll('%GEOGRAPHY_MAP_HEIGHT%', String(map.height))
          .replaceAll('%GEOGRAPHY_MAP_RATIO%', `${map.width} / ${map.height}`)
          .replaceAll('%GEOGRAPHY_LAYOUT%', renderLayout(layout, cities))
          .replace('<!--geography-pins-->', cities.map(renderPin).join('\n').trimStart());
      },
    },
  };
}
