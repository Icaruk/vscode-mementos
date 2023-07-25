# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2023-07-26

### Added

- Inserting a memento can get context from the above or below lines.
  - This behavior is enabled by default and can be changed with `mementos.actions.insertMementoWithContext`.
  - Default title is `bm` and can be changed with `mementos.actions.defaultContextTitle`.
  - Examples:
	- Tries to get the above or below line
		```js
		// @mem:bm const name = "Mementos";
		const name = "Mementos";
		
		
		if (name.length > 0) {
		console.log(`My name is ${name}`);
		};
		```
		```js
		const name = "Mementos";
		// @mem:bm const name = "Mementos";
		
		if (name.length > 0) {
		console.log(`My name is ${name}`);
		};
		```
		```js
		const name = "Mementos";
		
		// @mem:bm if (name.length > 0) {
		if (name.length > 0) {
		console.log(`My name is ${name}`);
		};
		```
	- Below line takes priority if both are available.
		```js
		const name = "Mementos";
		// @mem:bm if (name.length > 0) {
		if (name.length > 0) {
			console.log(`My name is ${name}`);
		};
		```



## [1.0.1] - 2023-07-24

### Fixed

- Trying to delete a category leaded to an error



## [1.0.0] - 2023-07-24

- Initial release



## [0.0.1] - 2023-07-16

- Alpha relase