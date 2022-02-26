import { Editor, MarkdownView, Plugin } from 'obsidian';
import { TableView, MARKDOWN_TABLE_EDITOR_VIEW } from "./view";

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerView(
      MARKDOWN_TABLE_EDITOR_VIEW,
      (leaf) => new TableView(leaf)
    );

    this.addRibbonIcon("pane-layout", "Open Markdown Table", () => {
      this.activateView();
    });

    this.addCommand({
      id: 'markdown-table-editor-open',
			name: 'Open Editor',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				this.activateView();
			}
    });
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);
	}

	async activateView() {
    this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if(!view) {
			return;
		}

		var data = view.editor.getSelection();
    await this.app.workspace.getLeaf(true).setViewState({
      type: MARKDOWN_TABLE_EDITOR_VIEW,
      active: true,
			state: { data }
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW)[0]
    );
  }
}
