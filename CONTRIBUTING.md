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
- `npm run compile`, run compiler.
- `npm run build`, build SDK assets.
- `npm run test`, run unit tests.
- `npm run lint`, run linter.
- `npm run format`, run code formatter.


## Publishing a new version

1. Update `CHANGELOG.md` with any changes that need to be communicated to a
   user of the SDK. See https://keepachangelog.com/en/1.1.0/ for details on
   what and how content should be included.
2. Update the version in `package.json`, run `npm install` to update the
   lock file, and commit these changes.
3. [Publish new version to npm.](#publishing-to-npm)
4. Tag the commit create in the previous step with the version.


### Publishing to npm

You will need permission to publish to the [mxenabled][mxenabled_npm_org]
organization in npm before you can publish this package. Once you are able to
publish, log into npm with `npm login` then run `npm publish` to publish.
Running `npm publish` will automatically execute `npm run build:dist` for you,
so there is no need to do that manually.


[mxenabled_npm_org]: https://www.npmjs.com/org/mxenabled "mxenabled npm organization"
