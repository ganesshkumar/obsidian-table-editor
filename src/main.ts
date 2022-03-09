import { Editor, MarkdownView, Menu, Plugin } from 'obsidian';
import { TableView, MARKDOWN_TABLE_EDITOR_VIEW } from "./view";
import { addIcons } from 'utils/icons';

const VERTICAL_EDITOR_TEXT = 'Open Editor (Next to the Active View)';
const HORIZONTAL_EDITOR_TEXT = 'Open Editor (Below the Active View)';

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
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);
	}

	async activateView(direction: 'vertical' | 'horizontal' = 'vertical') {
    this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if(!view) {
			return;
		}

    let data = this.getData(view);
  
    const activeLeaf = this.app.workspace.activeLeaf;
    
    await this.app.workspace.createLeafBySplit(activeLeaf, direction).setViewState({
      type: MARKDOWN_TABLE_EDITOR_VIEW,
      active: true,
			state: { data }
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW)[0]
    );
  }

  getData (view: MarkdownView) {
    let data = undefined;
    // If user has selected something. Take the selection
    if (view.editor.somethingSelected()) {
      data = view.editor.getSelection();
    } else {
      let { line } = view.editor.getCursor();
      // If user has not selection anything, serach for empty lines above and below the cursor position and take them as data
      if (view.editor.getLine(line).trim() !== '') {
        let lineAbove = Math.max(line - 1, 0);
        while (view.editor.getLine(lineAbove).trim() !== '' && lineAbove > 0) {
          lineAbove--;
        }
        let lineBelow = Math.min(line + 1, view.editor.lineCount() - 1);
        while (view.editor.getLine(lineBelow).trim() !== '' && lineBelow < view.editor.lineCount() - 1) {
          lineBelow++;
        }
        data = view.editor.getRange({ line: lineAbove, ch: 0 }, { line: lineBelow, ch: view.editor.getLine(lineBelow).length });
      }
    }

    return data;
  }
}
