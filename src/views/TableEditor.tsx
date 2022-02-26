import * as React from "react";
import { parseMarkdownTable, toMarkdown } from "../utils/markdown";
import Cell from "./Cell";

type Props = {
  data: string,
  updateViewData: (data: string) => void
}

export const TableEditor = (props: Props) => {
  const [newRows, setNewRows] = React.useState(3);
  const [newCols, setNewCols] = React.useState(3);
  const [values, setValues] = React.useState(Array(2).fill(['']));
  const [copyText, setCopyText] = React.useState('Copy as Markdown');

  const onContentChanged = (rowIndex: number, colIndex: number, value: string) => {
    const newValues = [...values];
    newValues[rowIndex][colIndex] = value;
    props.updateViewData(toMarkdown(newValues));
    setValues(newValues);
  }

  React.useEffect(() => {
    setValues(parseMarkdownTable(props.data) || Array(2).fill(['']))
  }, [props.data]);

  React.useEffect(() => {
    if (copyText !== 'Copy as Markdown') {
      setCopyText('Copy as Markdown');
    }
  }, [values]);

  const copyClicked = () => {
    setCopyText('Copied!');
    navigator?.clipboard?.writeText(toMarkdown(values));
  }

  const newTableClicked = () => {
    const newValues = Array(newRows).fill([]).map(row => Array(newCols).fill(''));
    setValues(newValues);
  }

  const clearClicked = () => {
    setValues(Array(2).fill(['']));
  }

  return (
    <>
      <div className='button-container'>
        Rows : <input type='text' onChange={e => setNewRows(parseInt(e.target.value))} placeholder='3'/>
        Columns : <input type='text' onChange={e => setNewCols(parseInt(e.target.value))} placeholder='3' />
        <button onClick={newTableClicked}>New Table</button>
        <button onClick={clearClicked}>Clear Table</button>
      </div>
      <div className='button-container'>
        <button onClick={copyClicked}>{copyText}</button>
      </div>
      <div className="grid" style={{
        gridTemplateColumns: `repeat(${values[0]?.length}, 1fr)`
      }}>
        {
          values.map((row, rowIdx) => 
            row.map((value: string, colIdx: number) => 
              <Cell key={`${rowIdx}-${colIdx}`} content={value} row={rowIdx} col={colIdx} values={values} setValues={setValues} onContentChanged={onContentChanged} />))
          .flat()
        }
      </div>
      <div className='button-container'>
        <button onClick={copyClicked}>{copyText}</button>
      </div>
    </>
  );
};
