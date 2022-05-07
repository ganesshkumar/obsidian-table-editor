import MarkdownTableEditorPlugin from "main";
import { App } from "obsidian";
import * as React from "react";
import { AppContext, PluginContext } from "./context";

export const useApp = (): App | undefined => {
  return React.useContext(AppContext);
};

export const usePlugin = (): MarkdownTableEditorPlugin | undefined => {
  return React.useContext(PluginContext);
}