import MarkdownTableEditorPlugin from 'main';
import { Menu } from 'obsidian';
import { VERTICAL_EDITOR_TEXT, HORIZONTAL_EDITOR_TEXT, POPOVER_EDITOR_TEXT } from '../../constants';
import {
  activateMarkdownEditorOnRight,
  activateMarkdownEditorBelow,
  activateMarkdownEditorInPopup,
  activateMarkdownEditorInDefaultDirection
} from './view';


export const registerRibbonIcons = (plugin: MarkdownTableEditorPlugin) => {
  plugin.addRibbonIcon("spreadsheet", "Open Markdown Table Editor", (event) => {
    if (event.type == 'click') {
      activateMarkdownEditorInDefaultDirection(plugin);
      event.preventDefault();
      return;
    }

    const menu = new Menu(plugin.app);

    menu.addItem((item) =>
      item
        .setTitle(VERTICAL_EDITOR_TEXT)
        .setIcon('vertical-split')
        .onClick(() => {
          activateMarkdownEditorOnRight(plugin);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle(HORIZONTAL_EDITOR_TEXT)
        .setIcon('horizontal-split')
        .onClick(() => {
          activateMarkdownEditorBelow(plugin);
        })
    );

    if ((plugin.app as any).plugins.plugins['obsidian-hover-editor'] !== undefined) {
      menu.addItem((item) =>
        item
          .setTitle(POPOVER_EDITOR_TEXT)
          .setIcon('popup-open')
          .onClick(() => {
            activateMarkdownEditorInPopup(plugin);
          })
      );
    }

    menu.showAtMouseEvent(event);
  })
};