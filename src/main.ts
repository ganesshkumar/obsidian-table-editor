import { Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { MARKDOWN_TABLE_EDITOR_VIEW } from "./view";
import { addIcons } from 'utils/obsidian/icons';
import { registerRibbonIcons } from './utils/obsidian/ribbon';
import { registerCommands } from 'utils/obsidian/commands';
import { registerViews } from 'utils/obsidian/view';

interface MarkdownEditorSettings {
  defaultDirection: 'vertical' | 'horizontal' | 'popover';
  defaultRows: number;
  defaultColumns: number;
}

const DEFAULT_SETTINGS: MarkdownEditorSettings = {
  defaultDirection: 'vertical',
  defaultRows: 3,
  defaultColumns: 3
}

export default class MarkdownTableEditorPlugin extends Plugin {
  settings: MarkdownEditorSettings;

  getSettings() {
    return this.settings;
  }

  async onload() {
    await this.loadSettings();

    addIcons();
    registerViews(this);
    registerRibbonIcons(this);
    registerCommands(this);

    this.addSettingTab(new MarkdownEditorSettingTab(this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);
  }
}

class MarkdownEditorSettingTab extends PluginSettingTab {
  plugin: MarkdownTableEditorPlugin;

  constructor(plugin: MarkdownTableEditorPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h2', { text: 'Settings for Markdown Table Editor' });

    new Setting(containerEl)
      .setName('Default Direction')
      .setDesc('Default direction in which the Markdown Editor has to be opened')
      .addDropdown(dropDown => {
        dropDown.addOption('vertical', 'Open to the right of active editor');
        dropDown.addOption('horizontal', 'Open below the active editor');
        dropDown.addOption('popover', 'Open in popover');
        dropDown.setValue(this.plugin.settings.defaultDirection);
        dropDown.onChange(async (value: string) => {
          let direction: 'vertical' | 'horizontal' | 'popover';
          if (value !== 'vertical' && value !== 'horizontal' && value !== 'popover') {
            direction = 'vertical';
          } else {
            direction = value;
          }
          this.plugin.settings.defaultDirection = direction;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Number of rows')
      .setDesc('Default number of rows in new tables created')
      .addText(text => text
        .setPlaceholder('3')
        .setValue(this.plugin.settings.defaultRows.toString())
        .onChange(async (value) => {
          const rows = parseInt(value)
          if (!rows) {
            new Notice('Rows has to be positive number. Defaulting to 3');
          }
          this.plugin.settings.defaultRows = rows || 3;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Number of columns')
      .setDesc('Default number of columns in new tables created')
      .addText(text => text
        .setPlaceholder('3')
        .setValue(this.plugin.settings.defaultColumns.toString())
        .onChange(async (value) => {
          const cols = parseInt(value)
          if (!cols) {
            new Notice('Columns has to be positive number. Defaulting to 3');
          }
          this.plugin.settings.defaultColumns = cols || 3;
          await this.plugin.saveSettings();
        }));
  }
}
