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

- `npm install`, install depedencies.
- `npm run build`, run compiler, does not generate assets in `dist` directory.
- `npm run build:dist`, run compile and save assets to `dist` directory.
- `npm run test`, run unit tests.
- `npm run open:coverage`, open code coverage report.


### Publishing to npm

You will need permission to publish to the [mxenabled][mxenabled_npm_org]
organization in npm before you can publish this package. **Before you
publish**, make sure to update CHANGELOG.md. Once you are able to publish, log
into npm with `npm login` then run `npm publish` to publish. Running `npm
publish` will automatically execute `npm run build:dist` for you, so there is
no need to do that manually.


[mxenabled_npm_org]: https://www.npmjs.com/org/mxenabled "mxenabled npm organization"
