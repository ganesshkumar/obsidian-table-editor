import { Editor, MarkdownView, Plugin } from 'obsidian';
import { VERTICAL_EDITOR_TEXT, HORIZONTAL_EDITOR_TEXT, POPOVER_EDITOR_TEXT } from '../../constants';
import {
  activateMarkdownEditorOnRight,
  activateMarkdownEditorBelow,
  activateMarkdownEditorInPopup,
  selectTableContentFromMarkdownView
} from './view';

export const registerCommands = (
  plugin: Plugin
) => {
  plugin.addCommand({
    id: 'markdown-table-editor-open-vertical',
    name: VERTICAL_EDITOR_TEXT,
    editorCallback: async (_: Editor, __: MarkdownView) => {
      activateMarkdownEditorOnRight(plugin);
    }
  });

  plugin.addCommand({
    id: 'markdown-table-editor-open-horizontal',
    name: HORIZONTAL_EDITOR_TEXT,
    editorCallback: async (_: Editor, __: MarkdownView) => {
      activateMarkdownEditorBelow(plugin);
    }
  });


  plugin.addCommand({
    id: 'markdown-table-editor-select-table-content',
    name: 'Select surrounding Table Content',
    editorCallback: async (_: Editor, view: MarkdownView) => {
      selectTableContentFromMarkdownView(view);
    }
  });

  const isHoverEditorPluginInstalled = (plugin.app as any).plugins.plugins['obsidian-hover-editor'] !== undefined;
  const shouldenableHoverEditor = isHoverEditorPluginInstalled;

  if (shouldenableHoverEditor) {
    plugin.addCommand({
      id: "markdown-table-editor-open-in-popover",
      name: POPOVER_EDITOR_TEXT,
      editorCallback: async (_: Editor, __: MarkdownView) => {
        activateMarkdownEditorInPopup(plugin);
      }
    });
  }
}
