# Contributing

## Reporting Bugs

When submitting a new bug report, please first
[search](https://github.com/mxenabled/react-native-widget-sdk/issues) for an
existing or similar report. If no duplicate exists, file the issue with the
following information:

1. OS version.
2. Steps to reproduce the issue.
3. Example code snippet that causes the issue.
4. Screenshots of the broken UI.

## Development

Clone this repo and install [Node v16](https://nodejs.org/en/download/). Below
are commands we use to perform various tasks:

- `npm install`, install dependencies.
- `npm run compile`, run compiler.
- `npm run build`, build SDK assets.
- `npm run test`, run unit tests.
- `npm run lint`, run linter.
- `npm run format`, run code formatter.

## Publishing a new version

Publishing of the npm package is handled by github actions. The `CHANGELOG.md` and `package.json` version need to be manually updated.
