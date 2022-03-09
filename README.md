# Obsidian Table Editor

An Obsidian plugin to provide an editor for Markdown tables. It can open CSV, Microsoft Excel/Google Sheets data as Markdown tables from Obsidian Markdown editor.

![Obsidian Table Editor](https://user-images.githubusercontent.com/2135089/155855554-28f69b38-1f1c-4287-b2da-ba0b75ecc1e1.png)

[![Tag 0.1.0](https://img.shields.io/badge/tag-0.1.0-blue)](https://github.com/ganesshkumar/obsidian-table-editor) 
[![MIT License](https://img.shields.io/github/license/ganesshkumar/obsidian-table-editor)](LICENSE)

## Table of Contents

- [Obsidian Table Editor](#obsidian-table-editor)
  * [1. Usage Guide](#1-usage-guide)
    + [1.1 Create a New Table](#11-create-a-new-table)
    + [1.2 Edit and format an existing Markdown Table](#12-edit-and-format-an-existing-markdown-table)
    + [1.3 CVS data to Markdown Table](#13-cvs-data-to-markdown-table)
    + [1.4 Excel or Sheets to Markdown Table](#14-excel-or-sheets-to-markdown-table)
      - [1.5 Operations](#15-operations)
        * [Cell Operations](#cell-operations)
        * [Header Operations](#header-operations)
  * [2. Installation](#2-installation)
    + [2.1 From GitHub](#21-from-github)
  * [3. License](#3-license)
  * [4. Other Obsidian plusins/tools made by me](#4-other-obsidian-plusins-tools-made-by-me)

## 1. Usage Guide

There is a [video walkthrough](https://www.youtube.com/watch?v=rZX_ZVPOgC8) of this plugin in Chinese made by @emisjerry. Thank you emisjerry! 

### 1.1 Create a New Table

1. Click `Open Markdown Table Editor` button from the *ribbon*.
2. Use `Markdown Table Editor: Open Editor` command from the *command palette*.

![Create a New Table](https://user-images.githubusercontent.com/2135089/155854358-fe7df44f-a9ad-42f4-b7e4-e8b639b4c7f8.gif)

### 1.2 Edit and format an existing Markdown Table

1. Select the markdown content
2. Open *Markdown Table Editor*

![Edit and format an existing Markdown Table](https://user-images.githubusercontent.com/2135089/155854503-9c894dff-fea2-4785-8078-78b53b23f98c.gif)

### 1.3 CVS data to Markdown Table

1. Select the CSV content
2. Open *Markdown Table Editor*

![CVS data to Markdown Table](https://user-images.githubusercontent.com/2135089/155854610-992bfa4f-1be3-4a56-ab56-89726a7db253.gif)

### 1.4 Excel or Sheets to Markdown Table

1. Select the Excel data (pasted via Ctrl/Cmd + Shift + V)
2. Open *Markdown Table Editor*

![Excel Sheets to Markdown Table](https://user-images.githubusercontent.com/2135089/155854780-36860953-cd41-41cb-ba8f-83de7e94f04c.gif)

#### 1.5 Operations

The following operations are supported

##### Cell Operations

- Row
	- Add row above
	- Add row below
	- Delete row
	- Move row up
	- Move row down
- Column
	* Add column above
	- Add column below
	- Delete column
	- Move column up
	- Move column down


##### Header Operations
- Justify
	- Left
	- Center
	- Right
- Sort
	- Text
		- Ascending
		- Descending
	- Numberic
		- Ascending
		- Descending

![operations](https://user-images.githubusercontent.com/2135089/155855370-3a93ae56-95df-4c36-be7a-2fc338f275a6.gif)


## 2. Installation

### 2.1 From GitHub

1. Download the Latest Release from the Releases section of the GitHub Repository
2. Put files to your vault's plugins folder: `<vault>/.obsidian/plugins/obsidian-excel-to-markdown-table`  
3. Reload Obsidian
4. If prompted about Safe Mode, you can disable safe mode and enable the plugin.  
    Otherwise, head to Settings, third-party plugins, make sure safe mode is off and enable the plugin from there.

> Note: The `.obsidian` folder may be hidden. On macOS, you should be able to press `Command+Shift+Dot` to show the folder in Finder.

## 3. License
[MIT](LICENSE)

## 4. Other Obsidian plusins/tools made by me

| # | Name/Repo                                                                                            | Link                                                    | Type   |
|---|------------------------------------------------------------------------------------------------------|---------------------------------------------------------|--------|
| 1 | [Obsidian Excel to Markdown Table](https://github.com/ganesshkumar/obsidian-excel-to-markdown-table) |                                                         | Plugin | 
| 2 | [Obsidian Clipper Maker](https://github.com/ganesshkumar/obsidian-bookmarklet-maker)                 | [Live Link](https://obsidian-clipper-maker.vercel.app/) | Tool   |
| 3 | [Obsidian Plugin Stats](https://github.com/ganesshkumar/obsidian-plugins-stats-ui)                   | [Live Link](https://obsidian-plugin-stats.vercel.app/)  | Tool   |

---

If you like my work, you could consider buying me a coffee. It is unnecessary, but appreciated 🙂

<a href="https://www.buymeacoffee.com/ganesshkumar" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
