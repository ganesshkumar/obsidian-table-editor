import { Notice } from "obsidian";
import * as React from "react";
import { parseInputData, sanitize, toMarkdown } from "../utils/markdown";
import Cell from "./Cell";

type Props = {
  inputData: string,
  updateViewData: (data: string) => void
  supressNotices: boolean
}

export const TableEditor = ({inputData, updateViewData, supressNotices = false}: Props) => {
  const [newRows, setNewRows] = React.useState(3);
  const [newCols, setNewCols] = React.useState(3);
  const [values, setValues] = React.useState(Array(2).fill(['']));
  const [colJustify, setColJustify] = React.useState([])
  const [copyText, setCopyText] = React.useState('Copy as Markdown');
  const [autoFocusRow, setAutoFocusRow] = React.useState(0);

  const onContentChanged = (rowIndex: number, colIndex: number, value: string) => {
    const newValues = [...values];
    newValues[rowIndex][colIndex] = value;
    setValues(newValues);
  }

  const computeAutoFocusRow = React.useCallback((values: string[][]) => {
    if (!values || !values.length || values.length === 0 || !values[0] || !values[0].length || values[0].length === 0 || !values[0][0]) {
      setAutoFocusRow(0);
    } else {
      setAutoFocusRow(1);
    }
  }, [inputData]);

  React.useEffect(() => {
    let data = parseInputData(inputData);
    if (!data) {
      if (!supressNotices) {
        new Notice("Selection is not a valid Markdown table or CSV or Excel data. Creating a new table!");
      }
      data = Array(2).fill(['']);
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
    setValues(Array(2).fill(['']));
    setColJustify(Array(1).fill('LEFT'));
  }

  const shouldAutoFocus = (rowIndex: number, colIndex: number) => {
    if (colIndex === 0) {
      if (rowIndex === autoFocusRow) {
        return true;
      }
    }
    return false;
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
        {/* <svg viewBox="0 0 100 100" className="checkbox-glyph" width="18" height="18"><path fill="currentColor" stroke="currentColor" d="M89.9,20c-0.9,0-1.7,0.4-2.3,1l-51,51l-21-21c-0.8-0.9-2.1-1.2-3.2-0.9s-2.1,1.2-2.4,2.4c-0.3,1.2,0,2.4,0.9,3.2L34.3,79 c1.3,1.3,3.4,1.3,4.7,0l53.3-53.3c1-1,1.3-2.4,0.7-3.7C92.6,20.7,91.3,19.9,89.9,20z"></path></svg> */}
      </div>
      <div className="mte grid" style={{
        gridTemplateColumns: `repeat(${values[0]?.length}, 1fr)`
      }}>
        {
          values.map((row, rowIdx) => 
            row.map((value: string, colIdx: number) => 
              <Cell key={`${rowIdx}-${colIdx}`} content={value} row={rowIdx} col={colIdx} values={values} setValues={setValues} colJustify={colJustify} setColJustify={setColJustify} onContentChanged={onContentChanged} autoFocus={shouldAutoFocus(rowIdx, colIdx)}/>))
          .flat()
        }
      </div>
      <div className='mte button-container'>
        <button onClick={copyClicked}>{copyText}</button>
      </div>
    </>
  );
};
