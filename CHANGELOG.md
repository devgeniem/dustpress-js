# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.2.0] - 2020-02-28

### Added

- Run DustPress debugger update in a new execution queue to prevent it halting resolving the AJAX request.

## [4.1.1] - 2019-11-11

### Fixed

- Update plugin version texts.

## [4.1.0] - 2019-11-11

### Added

- Add back the data property for fetching data along with the rendered HTML.

### Changed

- NPM update.

## [4.0.1] - 2019-11-08

### Added
- DustPress Debugger integration

## [4.0.0] - 2019-10-25

### Added
- webpack compiling for dustpress.js
- js sourcemaps
- .eslintrc.json

### Changed
- Changed the format of dustpress.js to a class
- Use fetch instead of jquery
- Use same CSRF token for all requests in the same session

## [3.0.4] - 2018-08-09

### Fixed
- Fixed an error that can happen if the server doesn't respond anything

## [3.0.3] - 2018-08-08

### Fixed
- Changed the deprecated $.ajax.complete to $.ajax.always

## [3.0.2] - 2018-06-27

### Fixed
- A problem that was caused by the previous fix.

## [3.0.1] - 2018-06-27

### Fixed
- A problem that prevented partial rendering with DustPress.js.

## [3.0.0] - 2018-06-20

### Changed
- `bypassMainQuery` default value as `true`.

## [2.3.0] - 2018-06-20

### Added
- `bypassMainQuery` parameter to be able to bypass main WP_Query if it's not needed on the request.

## [2.2.0] - 2018-06-14

### Added
- Possibility to change the ajax endpoint url either on per-request basis or project-wise.

### Changed
- Default endpoint for the ajax call to be the home url instead of current page url.

## [2.1.2] - 2018-05-25

### Fixed
- A bug where two simultaneous DustPress.js calls would clash and cause unexpected behaviour.

## [2.1.1] - 2018-01-17

### Fixed
- A bug regarding the enqueueing of the script

## [2.1.0] - 2018-01-17

### Added
- Added a feature for getting both the data and the rendered output when using a Dust partial
- Added possibility to change the dependency setting of the DustPress.js library if, for example, jQuery is provided outside the WordPress enqueue system

## [2.0.2] - 2017-11-15

### Changed
- Fixed a bug that caused crashing in certain circumstances in the front-end
- Enhanced the documentation with better examples and fixed some typos

## [2.0.1] - 2017-11-10

### Changed
- Changed the enqueue call to use the plugin version for the script version

## [2.0.0] - 2017-10-20

### Changed
- Changed to using application/json so parameters keep their type. NOTE: this will break earlier functionality as dustpress model `get_args()` function returned an array but it will now return an object instead

## [1.1.3] - 2017-10-04

### Added
- Added a return to the default dp function so the ajax call can be handled
- Added a changelog
