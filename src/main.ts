import { MarkdownView, Plugin } from 'obsidian';
import { TableView, MARKDOWN_TABLE_EDITOR_VIEW } from "./view";
import { addIcons } from 'utils/obsidian/icons';
import { registerRibbonIcons } from './utils/obsidian/ribbon';
import { parseInputData } from './utils/markdown';
import { registerCommands } from 'utils/obsidian/commands';
import { registerViews } from 'utils/obsidian/view';

export default class MarkdownTableEditorPlugin extends Plugin {
  async onload() {
    addIcons();
    registerViews(this);
    registerRibbonIcons(this);
    registerCommands(this);
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);
  }
}
