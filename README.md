<p align="center"><a href="https://craftycram.net" target="_blank" rel="noopener noreferrer"><img width="100" src="https://marcrufeis.de/repo/logo-let-s-hassel.png" alt="Let's Hassel Logo"></a></p>
<h1 align="center">Let's Hassel - VS Code Extension</h1>

## Description

A extension which allows you to hustle (hassel) more efficient by adding snippets for a bunch of programming languages. Used in the programming classes at HfG Schwäbisch Gmünd.

##### Table of Contents  
* [Requirements](#requirements)
* [Installation](#installation)  
* [Features](#features)
  * [Programming Languages & File Types](#supported-programming-languages--file-types)
    * [JavaScript](#javascript)
    * [HTML](#html)
    * [SVG](#svg)
* [Troubleshooting](#troubleshooting)
* [Release Notes](#release-notes)


## Requirements

You only need Visual Studio Code installed to use this extension.

> Install Visual Studio Code: [Official Website](https://code.visualstudio.com/)


## Installation

The extension can be installed via the `VS Code Extension Manager`.
1. Open the `Extension Manager` with the shortcut <kbd>⇧ Shift</kbd>+<kbd>⌘ Command</kbd>+<kbd>P</kbd> or via the menu `View > Extensions`.
2. On the top-left highlight the search-bar.
3. Enter the extensions name (`Let's Hassel`) or it's slug-name (`craftycram.lets-hassel`)
4. Click on the green `Install` button.

> Read the official documentation for more detailed help: [VS Code Docs - Extensions](https://code.visualstudio.com/docs/editor/extension-gallery)


## Features

Once you created a file of one of the supported types or languages you can auto-generate different code blocks by typing `!`and the shortname which you can find in these docs below.


### Supported Programming Languages & File Types
* [JavaScript](#lang-js)
* [HTML](#lang-html)
* [SVG](#lang-svg)

#### JavaScript

**1. Require**  
Shortcut: `!req`  
This generates the import/require line for Node.js applications.  
```
const = require('');
const <TABSTOP> = require('<TABSTOP>');<FINALPOS>
```
> You can use <kbd>⇥ Tab</kbd> to jump from `<TABSTOP>` to `<TABSTOP>` and to the `<FINALPOS>`

**2. Else-If**  
Shortcut: `!elif`  
This generates the else-if structure.  
```
  else if (<TABSTOP>) {
	  <FINALPOS>
  }
```
> You can use <kbd>⇥ Tab</kbd> to jump from `<TABSTOP>` to `<TABSTOP>` and to the `<FINALPOS>`

**3. Index.js**  
Shortcut: `!index`  
This generates the index require structure for Node.js applications.  
If you have a folder with a similar named `.js` file you can just create a `index.js` and use this shortcut to auto-complete the file. It uses the file-/folder-name to generate it, so be aware that they are the same.  
```
const ${TM_DIRECTORY/^.+\\/(.*)$/$1/} = require('./${TM_DIRECTORY/^.+\\/(.*)$/$1/}');

module.exports = ${TM_DIRECTORY/^.+\\/(.*)$/$1/};
```

#### HTML

**1. HTML basic structure**  
Shortcut: `!html`  
This generates the basic HTML structure.
```
<!doctype html>
<html>
  <head>
		<meta charset="utf-8">
		<title><TABSTOP></title>
	</head>
	<body>
		<FINALPOS>
	</body>
</html>
```
> You can use <kbd>⇥ Tab</kbd> to jump from `<TABSTOP>` to `<TABSTOP>` and to the `<FINALPOS>`

#### SVG

**1. SVG basic structure**  
Shortcut: `!svg`  
This generates the basic SVG structure.
```
<svg width="<TABSTOP>" height="<TABSTOP>" xmlns="http://www.w3.org/2000/svg">
  <FINALPOS>
</svg>
```
> You can use <kbd>⇥ Tab</kbd> to jump from `<TABSTOP>` to `<TABSTOP>` and to the `<FINALPOS>`


## Troubleshooting

#### Shortcuts not working?
Make sure that your file is in the correct language mode. Usually if you safe your file in the correct filetype VS Code automatically set's the correct language mode. If it doesn't you can also set it yourself in the bottom-right corner or by entering `Change Language Mode` in the `Command Palette`.
> Read the official documentation for more detailed help: [VS Code Docs - Language Mode](https://code.visualstudio.com/docs/languages/overview#_changing-the-language-for-the-selected-file)

## Release Notes

These are similar to the commits of the GitHub repository.

### 0.0.1
- Initial release

### 0.0.2
- Added extension logo

### 0.0.3
- Fixed extension logo path

### 1.0.0
- Added SVG support
- Fixed wrong character in HTML

### 2.0.0
- Fixed wrong version number

### 2.0.1
- Fixed SVG spacing

### 2.1.0
- Added docs

### 2.1.1
- Fixed version number in docs

### 2.1.2
- Fixed unnecessary link in docs

### 2.1.3
- Fixed link in docs

**Enjoy!**
