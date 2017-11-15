# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.2] 2017-11-15

### Changed
- Fixed a bug that caused crashing in certain circumstances in the front-end
- Enhanced the documentation with better examples and fixed some typos

## [2.0.1] 2017-11-10

### Changed
- Changed the enqueue call to use the plugin version for the script version

## [2.0.0] 2017-10-20

### Changed
- Changed to using application/json so parameters keep their type. NOTE: this will break earlier functionality as dustpress model `get_args()` function returned an array but it will now return an object instead

## [1.1.3] 2017-10-04

### Added
- Added a return to the default dp function so the ajax call can be handled
- Added a changelog
