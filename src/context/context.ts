import MarkdownTableEditorPlugin from "main";
import { App, View } from "obsidian";
import * as React from "react";

export const AppContext = React.createContext<App>(undefined);
export const PluginContext = React.createContext<MarkdownTableEditorPlugin>(undefined);
export const ParentLeafContext = React.createContext<View>(undefined);