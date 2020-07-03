<p align="center"><a href="https://craftycram.net" target="_blank" rel="noopener noreferrer"><img width="100" src="https://marcrufeis.de/repo/logo-let-s-hassel.png" alt="Let's Hassel Logo"></a></p>
<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=craftycram.lets-hassel"><img src="https://vsmarketplacebadge.apphb.com/version/craftycram.lets-hassel.svg" alt="VS-Code-Marketplace-Version"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=craftycram.lets-hassel"><img src="https://vsmarketplacebadge.apphb.com/installs/craftycram.lets-hassel.svg" alt="VS-Code-Marketplace-Installs"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=craftycram.lets-hassel"><img src="https://vsmarketplacebadge.apphb.com/downloads/craftycram.lets-hassel.svg" alt="VS-Code-Marketplace-Downloads"></a>
  <br/>
  <a href="https://marketplace.visualstudio.com/items?itemName=craftycram.lets-hassel"><img src="https://vsmarketplacebadge.apphb.com/rating-star/craftycram.lets-hassel.svg" alt="VS-Code-Marketplace-Rating"></a>
  </p>

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
  * [Node.js Workspace Auto-Setup](#nodejs-workspace-auto-setup)
    * [Usage](#usage)
    * [Commands](#commands)
  * [RaspiSSD Setup](#raspi-ssd-setup)
    * [Configuration](#raspi-config)
    * [Usage](#raspi-usage)
    * [Commands](#raspi-cmds)
  * [LoremIpsum Generator](#loremipsum-generator)
    * [Configuration](#lorem-config)
    * [Usage](#lorem-usage)
    * [Commands](#lorem-cmds)
  * [Web File Generator](#web-file-generator)
    * [Configuration](#web-config)
    * [Usage](#web-usage)
    * [Commands](#web-cmds)
  * [WSS File Generator](#wss-file-generator)
    * [Configuration](#wss-config)
    * [Usage](#wss-usage)
    * [Commands](#wss-cmds)
* [Troubleshooting](#troubleshooting)
* [Release Notes](https://github.com/craftycram/lets-hassel/blob/master/CHANGELOG.md)

> If the links aren't working properly try viewing the docs on [GitHub](https://github.com/craftycram/lets-hassel/).
If the problem is still there you can create an issue.


## Requirements

You need Visual Studio Code installed to use this extension.  

> Install Visual Studio Code: [Official Website](https://code.visualstudio.com/)


## Installation

The extension can be installed via the `VS Code Extension Manager`.
1. Open the `Extension Manager` with the shortcut <kbd>⇧ Shift</kbd>+<kbd>⌘ Command</kbd>+<kbd>X</kbd> or via the menu `View > Extensions`.
2. On the top-left highlight the search-bar.
3. Enter the extensions name (`Let's Hassel`) or it's slug-name (`craftycram.lets-hassel`)
4. Click on the green `Install` button.

> Read the official documentation for more detailed help: [VS Code Docs - Extensions](https://code.visualstudio.com/docs/editor/extension-gallery)


## Features

Once you created a file of one of the supported types or languages you can auto-generate different code blocks by typing `!`and the shortname which you can find in these docs below.
You can also use this extension to automatically generate loremipsum text, a basic Node.js workspace and other project files. Instructions on how that feature can be used can be found in these docs as well.


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

### Node.js Workspace Auto-Setup

This feature automatically generates you a basic Node.js workspace structure. It helps you to save time by not having to create all the files and folders each time you start a new project.  
It creates the main `index.js`, initializes a git repository, installs `eslint` and starts its setup assistant. More details on that under [Usage](#usage)

#### Usage

1. Create a new project folder and open it in `VS Code`.
2. Open the `Command Palette` with the shortcut <kbd>⇧ Shift</kbd>+<kbd>⌘ Command</kbd>+<kbd>P</kbd> or via the menu `View > Command Palette`.
3. Enter `Setup Node.js project in this folder`
4. A input box will show up. Enter which Node.js version you want to use.
5. A input box will show up. Enter your name or the one that should be shown as the author.
6. In the terminal the installation/initialisation progress will start.
7. Once it's finished the `eslint` configuration assistant will start and simplify the configuration for you.
8. Your workspace is ready to go.

The created structure will look like this:
```
.
├── node_modules        // installed Node.js modules
├── src
│   └── index.js        // main index.js
├── .eslintrc.json      // eslint config file
├── .gitignore          // ignore build output and node_modules
├── .nvmrc              // specifies which Node.js version to use
├── CHANGELOG.md        // changelog file
├── package-lock.json   // version history of installed Node.js modules
├── package.json        // npm configuration file
└── README.md           // README file
```

#### Commands

**1. Setup Node.js project in this folder**  
This command generates a basic Node.js project workspace. [[Details](#usage)]

<a name="raspi-ssd-setup"></a>
### RaspberryPi SD Setup (Wifi & SSH)

This feature generates the files needed for Wifi & SSH access on your RaspberryPi after flashing a new SD card.

<a name="raspi-config"></a>
#### Configuration

You can change some of the generators settings in the `VS Code settings` under `Extensions > Let's Hassel`.

##### Settings:

1. Country code:
The country code of your local wifi.

> You can use <kbd>⌘ Command</kbd>+<kbd>,</kbd> to open the settings.

<a name="raspi-usage"></a>
#### Usage

1. Flash your SD card with a RaspberryPiOS image and open the boot partition in `VS Code`.
2. Open the `Command Palette` with the shortcut <kbd>⇧ Shift</kbd>+<kbd>⌘ Command</kbd>+<kbd>P</kbd> or via the menu `View > Command Palette`.
3. Enter `Setup RaspberryPi SD Card. (Wifi & SSH config)`
4. A input box will show up. Enter the wifi name you want the Pi to connect to.
5. A input box will show up. Enter the corresponding wifi password.
6. The files will be generated and automatically saved to your sd.
7. Your sd card is ready to go.

<a name="raspi-cmds"></a>
#### Commands

**1. Setup RaspberryPi SD Card. (Wifi & SSH config)**  
This command creates the files necessary to connect to a new flashed raspi via wifi and SSH.

### LoremIpsum Generator

You can use this feature to fill your placeholders with random text.
You can either create a custom amount of words, sentences or paragraphs.

<a name="lorem-config"></a>
#### Configuration

You can change some of the generators settings in the `VS Code settings` under `Extensions > Let's Hassel`.

##### Settings:

1. Format:  
This changes the format of the text between normal text or HTML formatted text.

2. Minimum words in a sentence:  
The minimal amount of words used in a sentence.

3. Maximum words in a sentence:  
The maximal amount of words in a sentence.

4. Minimum sentences in a paragraph:  
The minimal amount of sentences in a paragraph.

5. Maximum sentences in a paragraph:  
The maximal amount of sentences in a paragraph.

> You can use <kbd>⌘ Command</kbd>+<kbd>,</kbd> to open the settings.


<a name="lorem-usage"></a>
#### Usage

There are three different commands which generate different amount of text.  

1. Move your cursor to the position where the text should be generated or select the area you want to replace.
2. Open the `Command Palette` with the shortcut <kbd>⇧ Shift</kbd>+<kbd>⌘ Command</kbd>+<kbd>P</kbd> or via the menu `View > Command Palette`.
3. Type one of the available commands. [[Commands](#lorem-cmds)]
4. Enter the amount of words, sentences or paragraphs in the popup window.
5. Confirm with <kbd>&#x23ce; Return</kbd>.


<a name="lorem-cmds"></a>
#### Commands

**1. Generate a specified amount of words**  
This command creates a random LoremIpsum text with a given amount of words.

**2. Generate a specified amount of sentences**  
This command creates a random LoremIpsum text with a given amount of sentences.

**3. Generate a specified amount of paragraphs**  
This command creates a random LoremIpsum text with a given amount of paragraphs.

### Web File Generator

You can use this feature to create a basic website structure consisting of a `index.html` and `style.css`.

<a name="web-config"></a>
#### Configuration

You can change some of the generators settings in the `VS Code settings` under `Extensions > Let's Hassel`.  
Make sure that you configured it properly before first use!

##### Settings:

1. Title:
The title of your HTML document, visible in the browser.  
(Also used by the WSS generator)

> You can use <kbd>⌘ Command</kbd>+<kbd>,</kbd> to open the settings.


<a name="web-usage"></a>
#### Usage

1. Open VS Code in a folder.
2. Open the `Command Palette` with the shortcut <kbd>⇧ Shift</kbd>+<kbd>⌘ Command</kbd>+<kbd>P</kbd> or via the menu `View > Command Palette`.
3. Type one of the available commands. [[Commands](#web-cmds)]
5. Confirm with <kbd>&#x23ce; Return</kbd>.


<a name="web-cmds"></a>
#### Commands

**1. Create web files. (index.html + style.css)**  
This command creates a index.html and style.css file linked with each other.


### WSS File Generator

You can use this feature to create the file structure used in the lessons of one of our lecturers.

<a name="wss-config"></a>
#### Configuration

You can change some of the generators settings in the `VS Code settings` under `Extensions > Let's Hassel`.  
Make sure that you configured it properly before first use!

##### Settings:

1. Filename:  
This specifies how the file will be named.

2. Filenumber:  
The number added to the end of the file.

3. Title:
The title of your HTML document, visible in the browser.  
(This used the title config of the web generator settings)

> You can use <kbd>⌘ Command</kbd>+<kbd>,</kbd> to open the settings.


<a name="wss-usage"></a>
#### Usage

1. Open VS Code in a folder.
2. Open the `Command Palette` with the shortcut <kbd>⇧ Shift</kbd>+<kbd>⌘ Command</kbd>+<kbd>P</kbd> or via the menu `View > Command Palette`.
3. Type one of the available commands. [[Commands](#wss-cmds)]
5. Confirm with <kbd>&#x23ce; Return</kbd>.


<a name="wss-cmds"></a>
#### Commands

**1. Create WSS files. (HTML & CSS)**  
This command creates a HTML and CCS file linked with each other with the nomenclature of WSS.


## Troubleshooting

#### Shortcuts not working?
Make sure that your file is in the correct language mode. Usually if you safe your file in the correct filetype VS Code automatically set's the correct language mode. If it doesn't you can also set it yourself in the bottom-right corner or by entering `Change Language Mode` in the `Command Palette`.
> Read the official documentation for more detailed help: [VS Code Docs - Language Mode](https://code.visualstudio.com/docs/languages/overview#_changing-the-language-for-the-selected-file)


**Enjoy!**
