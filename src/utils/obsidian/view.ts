import { MarkdownView, Plugin } from 'obsidian';
import { MARKDOWN_TABLE_EDITOR_VIEW, TableView } from 'view';

export const registerViews = (plugin: Plugin) => {
  plugin.registerView(
    MARKDOWN_TABLE_EDITOR_VIEW,
    (leaf) => new TableView(leaf)
  );
}

export const activateMarkdownEditorOnRight = (plugin: Plugin) => activateView(plugin, 'vertical');
export const activateMarkdownEditorBelow = (plugin: Plugin) => activateView(plugin, 'horizontal');
export const activateMarkdownEditorInPopup = (plugin: Plugin) => activateView(plugin, 'popover');

export const activateMarkdownEditorInDefaultDirection = (plugin: Plugin) => {
  const defaultDirection = 'vertical';
  activateView(plugin, defaultDirection);
}

export const selectTableContentFromMarkdownView = (view: MarkdownView) => {
  const { data, startCursor, endCursor } = getDataFromMarkdownView(view);
  view.editor.setSelection(startCursor, endCursor);
}

const activateView = async (plugin: Plugin, direction: 'vertical' | 'horizontal' | 'popover' = 'vertical') => {
  const app = plugin.app;

  app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);

  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) {
    return;
  }

  let data = getDataFromMarkdownView(view)?.data;
  let { line } = view.editor.getCursor();
  let _cursor = line;
  const activeLeaf = app.workspace.activeLeaf;
  let _leafid = (activeLeaf as any).id;

  let editorLeaf = undefined;
  if (direction === 'popover') {
    editorLeaf = (app as any).plugins.plugins['obsidian-hover-editor'].spawnPopover();
  } else {
    editorLeaf = app.workspace.createLeafBySplit(activeLeaf, direction);
  }

  await editorLeaf.setViewState({
    type: MARKDOWN_TABLE_EDITOR_VIEW,
    active: true,
    state: { data, leafId: _leafid, cursor: _cursor }
  });

  app.workspace.revealLeaf(
    app.workspace.getLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW)[0]
  );
}

const getDataFromMarkdownView = (view: MarkdownView) => {
  let data = undefined;
  let startCursor = undefined;
  let endCursor = undefined;

  // If user has selected something. Take the selection
  if (view.editor.somethingSelected()) {
    data = view.editor.getSelection();
  } else {
    let { line } = view.editor.getCursor();
    // If user has not selection anything, serach for empty lines above and below the cursor position and take them as data
    if (!!view.editor.getLine(line).trim()) {
      let lineAbove = Math.max(line - 1, 0);
      if (!!view.editor.getLine(lineAbove).trim()) {
        while (lineAbove > 0 && !!view.editor.getLine(lineAbove - 1).trim()) {
          lineAbove--;
        }
      } else {
        lineAbove = line;
      }

      let lineBelow = Math.min(line + 1, view.editor.lineCount() - 1);
      if (!!view.editor.getLine(lineBelow).trim()) {
        while (lineBelow + 1 < view.editor.lineCount() && !!view.editor.getLine(lineBelow + 1).trim()) {
          lineBelow++;
        }
      } else {
        lineBelow = line;
      }

      startCursor = { line: lineAbove, ch: 0 };
      endCursor = { line: lineBelow, ch: view.editor.getLine(lineBelow).length };

      // Marking the selection to support update from the Table Editor
      view.editor.setSelection(startCursor, endCursor);
      data = view.editor.getRange(startCursor, endCursor);
    }
  }

  return { data, startCursor, endCursor };
}

