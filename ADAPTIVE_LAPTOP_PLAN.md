# План адаптива WorkHere для ноутбуков

## Summary

Эталонный Figma-фрейм: `WorkHere - Желтый 1200`, node `186:3382`, ширина `1200px`.

Цель: вести ноутбучный адаптив строго поблочно, сверяясь с Figma и текущей структурой проекта. Основной рабочий диапазон: `$break_xlg` (`max-width: 1799.98px`). `$break_lg` (`max-width: 1399.98px`) использовать редко, только когда одного `xlg-block()` недостаточно для диапазона ближе к `1200-1400px`.

## Общие правила

- Двигаться по одному блоку за раз.
- Перед правками блока получить точный Figma context по его node id.
- Сравнить Figma с текущими `index.html` и `src/scss/blocks/_*.scss`.
- По возможности менять только SCSS соответствующего блока.
- DOM не менять, если блок можно адаптировать стилями.
- Любые будущие изменения HTML согласовывать отдельно.
- Адаптивные правила добавлять через существующие миксины из `src/scss/helpers/_media.scss`.
- Основной миксин: `@include xlg-block()`.
- `@include lg-block()` применять точечно и только при необходимости.
- Планшетные и мобильные диапазоны (`md`, `sm`, `xs`) в этом этапе не трогать.

## Порядок блоков

| Статус | Блок | Figma node | Код |
| --- | --- | --- | --- |
| Не начато | `header` | `186:3388` | `index.html`, `src/scss/blocks/_header.scss`, `_nav.scss`, `_logo.scss`, `_button.scss` |
| Не начато | `hero` | `186:3384`, контент `186:3402` | `index.html`, `src/scss/blocks/_hero.scss`, `_mascot.scss`, `_page.scss` |
| Не начато | `interface` | `186:3492` | `index.html`, `src/scss/blocks/_interface.scss`, `_page.scss` |
| Не начато | `trusted` | `186:3727` | `index.html`, `src/scss/blocks/_trusted.scss`, `_page.scss` |
| Не начато | `ai-stage` | `186:3739` | `index.html`, `src/scss/blocks/_ai-stage.scss`, `src/js/ai-stage-whirl.js` |
| Не начато | `workhere-ai` | `186:3755` | `index.html`, `src/scss/blocks/_workhere-ai.scss`, `src/js/workhere-ai*.js` |
| Не начато | `feature-section` customers | intro `186:3885`, section `186:3888` | `index.html`, `src/scss/blocks/_feature-section.scss`, `_feature-panel.scss` |
| Не начато | `feature-section` automation | intro `186:4019`, section `186:4022` | `index.html`, `src/scss/blocks/_feature-section.scss`, `_feature-panel.scss` |
| Не начато | `feature-section` analytics | intro `186:4066`, section `186:4069` | `index.html`, `src/scss/blocks/_feature-section.scss`, `_feature-panel.scss` |
| Не начато | `reviews` | `186:4211` | `index.html`, `src/scss/blocks/_reviews.scss`, `src/js/reviews-slider.js` |
| Не начато | `cases` | `186:4236` | `index.html`, `src/scss/blocks/_cases.scss`, `src/js/cases-slider.js` |
| Не начато | `premier` | `186:4271` | `index.html`, `src/scss/blocks/_premier.scss` |
| Не начато | `api-power` | `186:4320` | `index.html`, `src/scss/blocks/_api-power.scss` |
| Не начато | `security` | `186:4427` | `index.html`, `src/scss/blocks/_security.scss` |
| Не начато | `pricing` | `186:4473` | `index.html`, `src/scss/blocks/_pricing.scss` |
| Не начато | `demo-request` | `186:4574` | `index.html`, `src/scss/blocks/_demo-request.scss`, `src/js/email-forms-validation.js` |
| Не начато | `journal` | `186:4597` | `index.html`, `src/scss/blocks/_journal.scss` |
| Не начато | `footer` | `186:4627` | `index.html`, `src/scss/blocks/_footer.scss`, `_footer-menu.scss` |

## Целевые параметры Figma 1200

- Page width: `1200px`.
- Основной внешний отступ большинства секций: `40px` с каждой стороны.
- Частые контейнеры Figma:
  - `1120px` для секций внутри `1200px`.
  - `1040px` для внутреннего контента внутри секции.
  - `1100px` для интерфейсных сцен.
- Header: `1120px` ширина, `77px` высота, `top: 20px`, `x: 40px`.
- Hero: секция `1200x1008`, основной контент `1120px`, текстовый блок и mascot в две колонки.
- Interface после hero: `1200x758`, dashboard `1100x598`, смещение `x: 50px`, `y: 80px`.
- Feature sections: внешний контейнер `1120px`, внутренние панели около `1040px`, у каждой секции есть intro-frame и content-frame.
- Demo, journal и footer в Figma идут после pricing и используют `1120px`/`1040px` контейнеры.

## Workflow одного блока

1. Получить Figma context по node id блока.
2. Зафиксировать ключевые размеры: ширина секции, контейнер, внутренние grid/flex размеры, top/bottom отступы, размеры изображений.
3. Проверить текущую разметку и SCSS блока.
4. Описать пользователю предполагаемые изменения файла и дождаться подтверждения.
5. Внести только согласованные изменения.
6. Проверить блок на `1200px`.
7. При необходимости проверить `1400px` и `1799px`.
8. Убедиться, что нет горизонтального скролла.
9. Обновить статус блока в этом файле.

## Чеклист проверки блока

- Секция совпадает с Figma по общей ширине и расположению.
- Контейнеры соответствуют `1120px`, `1100px` или `1040px`, если это задано макетом.
- Текст не переполняет контейнеры.
- Изображения и декоративные элементы не создают горизонтальный скролл.
- Sticky/scroll-анимации сохраняют рабочее поведение.
- Swiper-блоки не ломают ширину страницы.
- Формы остаются интерактивными, поля и кнопки не сжимаются некорректно.
- На `1200px` страница не имеет горизонтального скролла.

## Общая проверка после группы блоков

- Запустить `npm run build`.
- Проверить страницу на ширинах `1799px`, `1400px`, `1200px`.
- Отдельно проверить:
  - header navigation;
  - hero mascot;
  - interface animations;
  - ai-stage sticky/scroll behavior;
  - workhere-ai scroll behavior;
  - feature-section tabs/progress;
  - reviews/cases sliders;
  - demo/journal forms;
  - footer layout.

## Assumptions

- Figma node `186:3382` является основным эталоном для ноутбучного адаптива.
- Этот этап не покрывает планшет и мобильные размеры.
- Основная реализация должна идти через `xlg-block()`.
- `lg-block()` допускается только как точечная корректировка для диапазона `1200-1400px`.
- HTML не меняется без отдельного явного согласования.
