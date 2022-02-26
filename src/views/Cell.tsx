import { useApp } from "context/hooks";
import { Menu, Notice } from "obsidian";
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
  const [isHovering, setIsHovering] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

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
        .setIcon("up-chevron-glyph")
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
        .setIcon("down-chevron-glyph")
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
        .setIcon("cross")
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
        .setIcon("left-chevron-glyph")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col, 0, ''));
          validateAndSetValues(newValues);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Add column right")
        .setIcon("right-chevron-glyph")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col + 1, 0, ''));
          validateAndSetValues(newValues);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Remove column")
        .setIcon("cross")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col, 1));
          validateAndSetValues(newValues);
        })
    );

    menu.addSeparator();

    menu.addItem((item) =>
      item
        .setTitle("Move row up")
        .setIcon("up-arrow-with-tail")
        .onClick(() => {
          if (row === 0) {
            new Notice('Can not move this row up!');
            return;
          }
          const newValues = [...values];
          [newValues[row - 1], newValues[row]] = [newValues[row], newValues[row - 1]]
          validateAndSetValues(newValues);
        })
    );

    menu.addItem((item) =>
    item
      .setTitle("Move row down")
      .setIcon("down-arrow-with-tail")
      .onClick(() => {
        if (row === values.length - 1) {
          new Notice('Can not move this row down!');
          return;
        }
        const newValues = [...values];
        [newValues[row + 1], newValues[row]] = [newValues[row], newValues[row + 1]]
        validateAndSetValues(newValues);
      })
    );

    menu.addItem((item) =>
    item
      .setTitle("Move column right")
      .setIcon("right-arrow-with-tail")
      .onClick(() => {
        if (col === values[0].length - 1) {
          new Notice('Can not move this column right!');
          return;
        }
        const newValues = [...values];
        newValues.forEach((_, rowIdx) => [newValues[rowIdx][col + 1], newValues[rowIdx][col]] = [newValues[rowIdx][col], newValues[rowIdx][col + 1]])
        validateAndSetValues(newValues);
      })
    );

    menu.addItem((item) =>
    item
      .setTitle("Move column left")
      .setIcon("left-arrow-with-tail")
      .onClick(() => {
        if (col === 0) {
          new Notice('Can not move this column left!');
          return;
        }
        const newValues = [...values];
        newValues.forEach((_, rowIdx) => [newValues[rowIdx][col - 1], newValues[rowIdx][col]] = [newValues[rowIdx][col], newValues[rowIdx][col - 1]])
        validateAndSetValues(newValues);
      })
    );

    menu.showAtMouseEvent(event);
  }

  return (
    <div className={`mte cell-container relative ${row === 0 ? 'header' : 'data'}`} onMouseEnter={_ => setIsHovering(true)} onMouseLeave={_ => setIsHovering(false)}>      
      <ContentEditable
          className='mte cell'
          innerRef={contentEditable}
          html={content}
          disabled={false}
          onFocus={_ => setIsFocused(true)}
          onBlur={_ => setIsFocused(false)}
          onChange={handleChange}
          tagName='span' />
      <span onClick={e => showContextMenu(e)}
          className={`absolute ${isHovering || isFocused ? 'display-block' : 'display-none'}`}>
        <svg viewBox="0 0 100 100" className="gear" width="18" height="18"><path fill="currentColor" stroke="currentColor" d="M44.4,4c-1,0-1.8,0.7-2,1.7l-1.9,11.9c-2.3,0.7-4.6,1.6-6.7,2.7l-9.8-7c-0.8-0.6-1.9-0.5-2.6,0.2l-7.8,7.8 c-0.7,0.7-0.8,1.8-0.2,2.6l6.9,9.9c-1.2,2.1-2.1,4.4-2.8,6.7l-11.9,2c-1,0.2-1.7,1-1.7,2v11c0,1,0.7,1.8,1.6,2l11.9,2.1 c0.7,2.4,1.6,4.6,2.8,6.7l-7,9.8c-0.6,0.8-0.5,1.9,0.2,2.6l7.8,7.8c0.7,0.7,1.8,0.8,2.6,0.2l9.9-6.9c2.1,1.2,4.3,2.1,6.7,2.8 l2,11.9c0.2,1,1,1.7,2,1.7h11c1,0,1.8-0.7,2-1.7l2.1-12c2.3-0.7,4.6-1.6,6.7-2.8l10,7c0.8,0.6,1.9,0.5,2.6-0.2l7.8-7.8 c0.7-0.7,0.8-1.8,0.2-2.6l-7.1-9.9c1.1-2.1,2.1-4.3,2.7-6.6l12-2.1c1-0.2,1.7-1,1.7-2v-11c0-1-0.7-1.8-1.7-2l-12-2 c-0.7-2.3-1.6-4.5-2.7-6.6l7-10c0.6-0.8,0.5-1.9-0.2-2.6l-7.8-7.8c-0.7-0.7-1.8-0.8-2.6-0.2l-9.8,7.1c-2.1-1.2-4.3-2.1-6.7-2.8 l-2.1-12c-0.2-1-1-1.7-2-1.7L44.4,4z M46.1,8h7.6l2,11.4c0.1,0.8,0.7,1.4,1.5,1.6c2.9,0.7,5.7,1.9,8.2,3.4 c0.7,0.4,1.6,0.4,2.2-0.1l9.4-6.7l5.4,5.4l-6.7,9.5c-0.5,0.6-0.5,1.5-0.1,2.2c1.5,2.5,2.6,5.2,3.4,8.1c0.2,0.8,0.8,1.4,1.6,1.5 L92,46.1v7.6l-11.4,2c-0.8,0.1-1.4,0.7-1.6,1.5c-0.7,2.9-1.9,5.6-3.4,8.1c-0.4,0.7-0.4,1.6,0.1,2.2l6.8,9.4l-5.4,5.4l-9.5-6.7 c-0.7-0.5-1.5-0.5-2.2-0.1c-2.5,1.5-5.2,2.7-8.2,3.4c-0.8,0.2-1.3,0.8-1.5,1.6l-2,11.4h-7.6l-1.9-11.3c-0.1-0.8-0.7-1.4-1.5-1.6 c-2.9-0.7-5.7-1.9-8.2-3.4c-0.7-0.4-1.5-0.4-2.2,0.1l-9.4,6.6l-5.4-5.4l6.6-9.3c0.5-0.7,0.5-1.5,0.1-2.2c-1.5-2.5-2.7-5.3-3.4-8.2 c-0.2-0.8-0.8-1.3-1.6-1.5L8,53.7v-7.6l11.3-1.9c0.8-0.1,1.4-0.7,1.6-1.5c0.7-2.9,1.9-5.7,3.4-8.2c0.4-0.7,0.4-1.5-0.1-2.2 l-6.6-9.4l5.4-5.4l9.3,6.7c0.6,0.5,1.5,0.5,2.2,0.1c2.5-1.5,5.3-2.7,8.2-3.4c0.8-0.2,1.4-0.8,1.5-1.6L46.1,8z M50,34 c-8.8,0-16,7.2-16,16s7.2,16,16,16s16-7.2,16-16S58.8,34,50,34z M50,38c6.7,0,12,5.3,12,12s-5.3,12-12,12s-12-5.3-12-12 S43.3,38,50,38z"></path></svg>
      </span>
    </div>
  ) 
}

export default Cell;
