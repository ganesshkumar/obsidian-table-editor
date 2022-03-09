import { Editor, MarkdownView, Menu, Plugin } from 'obsidian';
import { TableView, MARKDOWN_TABLE_EDITOR_VIEW } from "./view";

const VERTICAL_EDITOR_TEXT = 'Open Editor (Next to the Active View)';
const HORIZONTAL_EDITOR_TEXT = 'Open Editor (Below the Active View)';

export default class MarkdownTableEditorPlugin extends Plugin {
	async onload() {
		this.registerView(
      MARKDOWN_TABLE_EDITOR_VIEW,
      (leaf) => new TableView(leaf)
    );

    this.addRibbonIcon("pane-layout", "Open Markdown Table Editor", (event) => {
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

		const data = view.editor.getSelection();
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
}
