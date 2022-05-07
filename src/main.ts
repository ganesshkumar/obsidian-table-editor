import { Editor, MarkdownView, Menu, Plugin } from 'obsidian';
import { TableView, MARKDOWN_TABLE_EDITOR_VIEW } from "./view";
import { addIcons } from 'utils/icons';
import { parseInputData } from './utils/markdown';
const VERTICAL_EDITOR_TEXT = 'Open Editor (Next to the Active View)';
const HORIZONTAL_EDITOR_TEXT = 'Open Editor (Below the Active View)';
const POPOVER_EDITOR_TEXT = "Open Editor (with the hover editor pluging)";

export default class MarkdownTableEditorPlugin extends Plugin {
  async onload() {
    // Add custom icons
    addIcons();

    this.registerView(
      MARKDOWN_TABLE_EDITOR_VIEW,
      (leaf) => new TableView(leaf)
    );

    this.addRibbonIcon("spreadsheet", "Open Markdown Table Editor", (event) => {
      if (event.type == 'click') {
        this.activateView('vertical');
        event.preventDefault();
        return;
      }

      const menu = new Menu(this.app);

      menu.addItem((item) =>
        item
          .setTitle(VERTICAL_EDITOR_TEXT)
          .setIcon('vertical-split')
          .onClick(() => {
            this.activateView('vertical');
          })
      );

      menu.addItem((item) =>
        item
          .setTitle(HORIZONTAL_EDITOR_TEXT)
          .setIcon('horizontal-split')
          .onClick(() => {
            this.activateView('horizontal');
          })
      );

      menu.showAtMouseEvent(event);
    });

    this.addCommand({
      id: 'markdown-table-editor-open-vertical',
      name: VERTICAL_EDITOR_TEXT,
      editorCallback: async (_: Editor, __: MarkdownView) => {
        this.activateView('vertical');
      }
    });

    this.addCommand({
      id: 'markdown-table-editor-open-horizontal',
      name: HORIZONTAL_EDITOR_TEXT,
      editorCallback: async (_: Editor, __: MarkdownView) => {
        this.activateView('horizontal');
      }
    });


    this.addCommand({
      id: 'markdown-table-editor-select-table-content',
      name: 'Select surrounding Table Content',
      editorCallback: async (_: Editor, view: MarkdownView) => {
        this.selectTableContent(view);
      }
    });

    if ((this.app as any).plugins.plugins['obsidian-hover-editor'] !== undefined) {
      this.addCommand({
        id: "markdown-table-editor-open-in-popover",
        name: POPOVER_EDITOR_TEXT,
        editorCallback: async (_: Editor, __: MarkdownView) => {
          this.activateView("popover");
        }
      });
    }
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);
  }

  async activateView(direction: 'vertical' | 'horizontal' | 'popover' = 'vertical') {
    this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      return;
    }

    let data = this.getData(view)?.data;
    let { line } = view.editor.getCursor();
    let _cursor = line;
    const activeLeaf = this.app.workspace.activeLeaf;
    let _leafid = (activeLeaf as any).id;

    let editorLeaf = undefined;
    if (direction === 'popover') {
      editorLeaf = (this.app as any).plugins.plugins['obsidian-hover-editor'].spawnPopover();
    } else {
      editorLeaf = this.app.workspace.createLeafBySplit(activeLeaf, direction);
    }

    await editorLeaf.setViewState({
      type: MARKDOWN_TABLE_EDITOR_VIEW,
      active: true,
      state: { data, leafId: _leafid, cursor: _cursor }
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW)[0]
    );
  }

  getData(view: MarkdownView) {
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

  selectTableContent(view: MarkdownView) {
    const { data, startCursor, endCursor } = this.getData(view);
    const parsedData = parseInputData(data);
    if (parseInputData) {
      view.editor.setSelection(startCursor, endCursor);
    }
  }
}
