import { AppContext } from "context/context";
import { Notice, MarkdownView } from "obsidian";
import * as React from "react";
import { parseInputData, sanitize, toMarkdown } from "../utils/markdown";
import Cell from "./Cell";

type Props = {
  leafId: string,
  cursor: string,
  inputData: string,
  updateViewData: (data: string) => void
  supressNotices: boolean
}

export const TableEditor = ({leafId, cursor, inputData, updateViewData, supressNotices = false}: Props) => {
	let _leafid = leafId;
	let _cursor = cursor;

  const app = React.useContext(AppContext);

  const [newRows, setNewRows] = React.useState(3);
  const [newCols, setNewCols] = React.useState(3);
  const [values, setValues] = React.useState([[''], ['']]);
  const [colJustify, setColJustify] = React.useState([])
  const [copyText, setCopyText] = React.useState('Copy as Markdown');
  const [autoFocusCell, setAutoFocusCell] = React.useState({row: -1, col: -1});

  const onContentChanged = (rowIndex: number, colIndex: number, value: string) => {
    const newValues = [...values];
    newValues[rowIndex][colIndex] = value;
    setValues(newValues);
  }

  const computeAutoFocusRow = React.useCallback((values: string[][]) => {
    if (!values || !values.length || values.length === 0 || !values[0] || !values[0].length || values[0].length === 0 || !values[0][0]) {
      setAutoFocusCell({row: 0, col: 0});
    } else {
      setAutoFocusCell({row: 1, col: 0});
    }
  }, [inputData]);

  React.useEffect(() => {
    let data = parseInputData(inputData);
    if (!data) {
      if (!supressNotices) {
        new Notice("Selection is not a valid Markdown table or CSV or Excel data. Creating a new table!");
      }
      data = [[''], ['']];
    }

    data = sanitize(data);

    setValues(data);
    setColJustify(Array(data[0].length).fill('LEFT'));
    computeAutoFocusRow(data);
  }, [inputData]);

  React.useEffect(() => {
    if (copyText !== 'Copy as Markdown') {
      setCopyText('Copy as Markdown');
    }
    updateViewData(toMarkdown(values, colJustify));
  }, [values, colJustify]);


  const copyClicked = () => {
    setCopyText('Copied!');
    navigator?.clipboard?.writeText(toMarkdown(values, colJustify));
  }

  const newTableClicked = () => {
    const newValues = Array(newRows).fill([]).map(_ => Array(newCols).fill(''));
    setValues(newValues);
    setColJustify(Array(newValues[0].length).fill('LEFT'))
  }

  const clearClicked = () => {
    setValues([[''], ['']]);
    setColJustify(Array(1).fill('LEFT'));
  }

  const shouldAutoFocus = (rowIndex: number, colIndex: number) => {
    if (colIndex === autoFocusCell.col && rowIndex === autoFocusCell.row) {
      return true;
    }
    return false;
  }

  const replaceClicked = () => {
    const editorLeaf = app.workspace.activeLeaf;

    let leaf = app.workspace.getLeafById(_leafid);
    app.workspace.setActiveLeaf(leaf, false, true);
    
    let view = app.workspace.getActiveViewOfType(MarkdownView);
    let line = parseInt(_cursor);

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

      const startCursor = { line: lineAbove, ch: 0 };
      const endCursor = { line: lineBelow, ch: view.editor.getLine(lineBelow).length };
      
      view.editor.replaceRange(toMarkdown(values, colJustify), startCursor, endCursor);
    }
  }

  return (
    <>
      <div className='mte button-container'>
        Rows : <input type='text' onChange={e => setNewRows(parseInt(e.target.value))} placeholder='3'/>
        Columns : <input type='text' onChange={e => setNewCols(parseInt(e.target.value))} placeholder='3' />
        <button onClick={newTableClicked}>New Table</button>
        <button onClick={clearClicked}>Clear Table</button>
      </div>
      <div className='mte button-container'>
        <button onClick={copyClicked}>{copyText}</button>
      </div>
      <div className="mte grid" style={{
        gridTemplateColumns: `repeat(${values[0]?.length}, 1fr)`
      }}>
        {
          values.map((row, rowIdx) => 
            row.map((value: string, colIdx: number) => 
              <Cell key={`${rowIdx}-${colIdx}`} 
                row={rowIdx} col={colIdx}
                content={value} values={values} setValues={setValues} 
                colJustify={colJustify} setColJustify={setColJustify} 
                onContentChanged={onContentChanged} 
                autoFocus={shouldAutoFocus(rowIdx, colIdx)} 
                onFocus={() => setAutoFocusCell({row: rowIdx, col: colIdx})}
              />))
          .flat()
        }
      </div>
      <div className='mte button-container'>
        <button onClick={copyClicked}>{copyText}</button>
        <button onClick={replaceClicked}>Update Table</button>
      </div>
      
    </>
  );
};
