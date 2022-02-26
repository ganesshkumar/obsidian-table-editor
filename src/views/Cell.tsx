import { useApp } from "context/hooks";
import { Menu } from "obsidian";
import * as React from "react";
import ContentEditable from "react-contenteditable";

type CellProps = {
  row: number
  col: number
  content: string
  values: string[][]
  setValues: (values: string[][]) => void
  onContentChanged: (row: number, col: number, content: string) => void
}

const Cell = ({row, col, content, onContentChanged, values, setValues}: CellProps) => {
  const contentEditable = React.useRef();

  const handleChange = (evt: any) => {
    onContentChanged(row, col, evt.target.value);
  };

  const app = useApp();
  const [visible, setVisible] = React.useState(false);

  const showContextMenu = (event: any) => {
    const menu = new Menu(app);
    
    const validateAndSetValues = (values: string[][]) => {
      if (!values || !values[0]) {
        setValues(Array(0).fill(['']));
      } else {
        setValues(values);
      }
    }

    menu.addItem((item) =>
      item
        .setTitle("Add row above")
        .onClick(() => {
          const colLen = values[0].length;
          const newValues = [...values];
          newValues.splice(row, 0, Array(colLen).fill(''));
          validateAndSetValues(newValues);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Add row below")
        .onClick(() => {
          const colLen = values[0].length;
          const newValues = [...values];
          newValues.splice(row + 1, 0, Array(colLen).fill(''));
          validateAndSetValues(newValues);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Remove row")
        .onClick(() => {
          const newValues = [...values];
          newValues.splice(row, 1);
          validateAndSetValues(newValues);
        })
    );

    menu.addSeparator();

    menu.addItem((item) =>
      item
        .setTitle("Add column left")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col, 0, ''));
          validateAndSetValues(newValues);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Add column right")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col + 1, 0, ''));
          validateAndSetValues(newValues);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Remove column")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col, 1));
          validateAndSetValues(newValues);
        })
    );

    menu.showAtMouseEvent(event);
  }

  return (
    <div className={`cell-container relative ${row === 0 ? 'header' : 'data'}`} onMouseEnter={_ => setVisible(true)} onMouseLeave={_ => setVisible(false)}>      
      <ContentEditable
          className='cell'
          innerRef={contentEditable}
          html={content}
          disabled={false}
          onChange={handleChange}
          tagName='span' />
      <span onClick={e => showContextMenu(e)}
          className={`absolute ${visible ? 'display-block' : 'display-none'}`}>
        ⚙️
      </span>
    </div>
  ) 
}

export default Cell;
