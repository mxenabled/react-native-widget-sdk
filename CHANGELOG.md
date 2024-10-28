# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [1.1.4] - 2024-10-18

### Fixed

- Ran npm audit fix to fix vulnerabilities

## [1.1.3] - 2024-10-11

### Changed

- Upgraded react-native from 0.70.3 to 0.75.3
- Upgrade @mxenabled/widget-post-message-definitions to 1.4.0
- Fixed the example app

## [1.1.1] - 2022-12-06

### Changed

- Ran npm audit fix on example app

## [1.1.0] - 2022-10-14

### Added

- Ability to style underlying WebView
- Prop to handle errors on the WebView

## [1.0.9] - 2022-09-20

### Added

- Sending SDK information to widget.

### Changed

- Updating @mxenabled/widget-post-message-definitions to v1.1.0.

### Fixed

- Updated setup script to support newer version of React Native that do not
  implement linking of dependencies.

## [1.0.8] - 2022-06-10

### Fixed

- Deeplinking: listening for URL events with expo-linking for Expo applications.

## [1.0.7] - 2022-06-09

### Changed

- Updating @mxenabled/widget-post-message-definitions to v1.0.5.
- Updating @mxenabled/widget-post-message-definitions to v1.0.10.

## [1.0.6] - 2022-05-23

### Changed

- Documentation for configuration and callback component props.
- Updating @mxenabled/widget-post-message-definitions to v1.0.9.
- Loading additional widgets in example application.

## [1.0.5] - 2022-03-09

### Changed

- Updating @mxenabled/widget-post-message-definitions to v1.0.5.

## [1.0.4] - 2022-03-08

### Changed

- Getting Post Message definitions from
  @mxenabled/widget-post-message-definitions.
- Conditionally using removeEventListener (which has been deprecated) in
  anticipation of removal.

## [1.0.3] - 2022-03-03

### Fixed

- Fix direct dependency and peer dependency specifications for multiple React
  Native and React versions can be supported.

## [1.0.2] - 2022-03-03

### Added

- OAuth flow support.
- Proxy server SSO URL loading strategy.
- Language setting component prop.
- Mini Pulse Carousel Widget component.
- Pulse Widget component.
- Accounts Widget component.
- Budgets Widget component.
- Connections Widget component.
- Debts Widget component.
- Finstrong Widget component.
- Goals Widget component.
- Help Widget component.
- Master Widget component.
- MiniBudgets Widget component.
- MiniFinstrong Widget component.
- MiniSpending Widget component.
- Settings Widget component.
- Spending Widget component.
- Transactions Widget component.
- Trends Widget component.

## [1.0.1] - 2022-02-14

### Added

- Connect Widget component.
- Example application loading the Connect Widget.
- README with getting started guide.
