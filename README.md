# Cloudboy — Personal Cloud Lab

> **Новый агент / разработчик:** сначала прочитай [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) и [AGENTS.md](AGENTS.md). Там зафиксированы цели, ограничения, дизайн и текущее состояние прототипа.

Статический прототип **личного инженерного журнала и лаборатории** об облачных технологиях и распределённых системах. Темы широкие; это не Kubernetes/WASM-сайт и не образовательная облачная платформа.

Сейчас есть одна работающая интерактивная модель (кворум). Остальные темы на главной — идеи будущих публикаций, а не готовые эксперименты.

## Публикация на GitHub Pages

1. Репозиторий `cloudboy-tech/cloudboy-tech.github.io` уже создан, сайт загружен в `main`.
2. Если Pages ещё не включён, в `Settings → Pages` выбрать **Deploy from a branch → main → /(root)** и сохранить.
3. Проверить фактическую публикацию на `https://cloudboy-tech.github.io/`; наличие репозитория само по себе не означает, что Pages уже включён.

Сайт автономен: весь CSS и JavaScript встроены в `index.html`, сборка, npm, Node.js, Jekyll и GitHub Actions не нужны.

## Свой домен cloudboy.tech

**Сначала** в `Settings → Pages → Custom domain` добавить `cloudboy.tech`. При публикации из ветки GitHub добавит файл `CNAME`.

После этого настроить в DNS:

- `A @ 185.199.108.153`
- `A @ 185.199.109.153`
- `A @ 185.199.110.153`
- `A @ 185.199.111.153`
- `CNAME www cloudboy-tech.github.io` (рекомендуется).

Не трогать MX и TXT записи почты. Дождаться успешной DNS-проверки в GitHub Pages и включить **Enforce HTTPS**.

Документация:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Разработка

Откройте `index.html` в браузере. В статье про кворум работает интерактивная модель без сервера.