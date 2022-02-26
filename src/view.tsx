import { ItemView, ViewStateResult, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TableEditor } from "./views/TableEditor";
import { AppContext } from "./context/context";

export const MARKDOWN_TABLE_EDITOR_VIEW = "markdown-table-editor-view";

export class TableView extends ItemView {
  private state: any;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return MARKDOWN_TABLE_EDITOR_VIEW;
  }

  getDisplayText() {
    return "Markdown Table Editor";
  }

  async setState(state: any, result: ViewStateResult): Promise<void> {
    if ('data' in state) {
      this.state = state;
      ReactDOM.render(
        <AppContext.Provider value={this.app}>
          <TableEditor data={state.data} updateViewData={(data: string) => this.state.data = data}/>
        </AppContext.Provider>,
        this.containerEl.children[1]
      );
    }
    return;
  }

  async getState() {
    return Promise.resolve(this.state);
  }

  async onOpen() {
    ReactDOM.render(
      <AppContext.Provider value={this.app}>
        <TableEditor data='' updateViewData={(data: string) => this.state.data = data} />
      </AppContext.Provider>,
      this.containerEl.children[1]
    );
  }

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }
}
