import { useApp } from "context/hooks";
import { Menu, Notice, Point } from "obsidian";
import * as React from "react";
import ContentEditable from "react-contenteditable";

type CellProps = {
  row: number
  col: number
  content: string
  values: string[][]
  setValues: (values: string[][]) => void
  colJustify: string[]
  setColJustify: (colJustify: string[]) => void
  onContentChanged: (row: number, col: number, content: string) => void
  autoFocus?: boolean
  onFocus?: () => void // Not using it yet
}

const Cell = ({ row, col, content, onContentChanged, values, setValues, colJustify, setColJustify, autoFocus = false, onFocus }: CellProps) => {
  const contentEditable = React.useRef<HTMLSpanElement>();
  const contextMenu = React.useRef<HTMLSpanElement>();

  const handleChange = (evt: any) => {
    onContentChanged(row, col, evt.target.value);
  };

  const handleKeyDown = (evt: any) => {
    if (evt.altKey && evt.ctrlKey && evt.code === 'KeyO') {
      showContextMenu({
        x: contextMenu.current.getBoundingClientRect().left,
        y: contextMenu.current.getBoundingClientRect().top
      });
    }
  }

  const app = useApp();
  const [isHovering, setIsHovering] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (autoFocus) {
      contentEditable.current.setText('');
      contentEditable.current.focus();
    }
  }, [autoFocus]);

  const showContextMenu = (event: any) => {
    const menu = new Menu(app);

    const validateAndSetValues = (values: string[][]) => {
      if (!values || !values[0]) {
        setValues(Array(0).fill(['']));
      } else {
        setValues(values);
      }
    }

    // Header only items
    if (row === 0) {
      menu.addItem((item) =>
        item
          .setTitle("Left align")
          .setIcon("alignLeft")
          .onClick(() => {
            const newColJustify = [...colJustify];
            newColJustify[col] = 'LEFT';
            setColJustify(newColJustify);
          })
      );

      menu.addItem((item) =>
        item
          .setTitle("Center align")
          .setIcon("alignCenter")
          .onClick(() => {
            const newColJustify = [...colJustify];
            newColJustify[col] = 'CENTER';
            setColJustify(newColJustify);
          })
      );

      menu.addItem((item) =>
        item
          .setTitle("Right align")
          .setIcon("alignRight")
          .onClick(() => {
            const newColJustify = [...colJustify];
            newColJustify[col] = 'RIGHT';
            setColJustify(newColJustify);
          })
      );

      menu.addSeparator();

      menu.addItem((item) =>
        item
          .setTitle("Sort text ascending")
          .setIcon("sortAsc")
          .onClick(() => {
            let newValues = [...values];
            const firstRow = newValues.shift();
            newValues.sort((a, b) => a[col].localeCompare(b[col]))
            newValues = [firstRow].concat(newValues)
            validateAndSetValues(newValues);
          })
      );

      menu.addItem((item) =>
        item
          .setTitle("Sort text descending")
          .setIcon("sortDesc")
          .onClick(() => {
            let newValues = [...values];
            const firstRow = newValues.shift();
            newValues.sort((a, b) => b[col].localeCompare(a[col]))
            newValues = [firstRow].concat(newValues)
            validateAndSetValues(newValues);
          })
      );

      menu.addItem((item) =>
        item
          .setTitle("Sort numeric ascending")
          .setIcon("sortAscNumeric")
          .onClick(() => {
            let newValues = [...values];
            const isAllNumeric = newValues.map((row, idx) => idx === 0 || Number.isFinite(Number.parseFloat(row[col]))).every(r => r === true);
            if (!isAllNumeric) {
              return
            }
            const firstRow = newValues.shift();
            newValues.sort((rowA, rowB) => Number.parseFloat(rowA[col]) - Number.parseFloat(rowB[col]));
            newValues = [firstRow].concat(newValues);
            validateAndSetValues(newValues);
          })
      );

      menu.addItem((item) =>
        item
          .setTitle("Sort numeric descending")
          .setIcon("sortDescNumeric")
          .onClick(() => {
            let newValues = [...values];
            const isAllNumeric = newValues.map((row, idx) => idx === 0 || Number.isFinite(Number.parseFloat(row[col]))).every(r => r === true);
            if (!isAllNumeric) {
              return
            }
            const firstRow = newValues.shift();
            newValues.sort((rowA, rowB) => Number.parseFloat(rowB[col]) - Number.parseFloat(rowA[col]));
            newValues = [firstRow].concat(newValues);
            validateAndSetValues(newValues);
          })
      );

      menu.addSeparator();
    }

    menu.addItem((item) =>
      item
        .setTitle("Add row above")
        .setIcon("insertRow")
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
        .setIcon("insertRow")
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
        .setIcon("deleteRow")
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
        .setIcon("insertColumn")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col, 0, ''));

          const newColJustify = [...colJustify];
          newColJustify.splice(col, 0, 'LEFT');

          validateAndSetValues(newValues);
          setColJustify(newColJustify);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Add column right")
        .setIcon("insertColumn")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col + 1, 0, ''));

          const newColJustify = [...colJustify];
          newColJustify.splice(col + 1, 0, 'LEFT');

          validateAndSetValues(newValues);
          setColJustify(newColJustify);
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Remove column")
        .setIcon("deleteColumn")
        .onClick(() => {
          const newValues = [...values];
          newValues.forEach(row => row.splice(col, 1));

          const newColJustify = [...colJustify];
          newColJustify.splice(col, 1);

          validateAndSetValues(newValues);
          setColJustify(newColJustify);
        })
    );

    menu.addSeparator();

    menu.addItem((item) =>
      item
        .setTitle("Move row up")
        .setIcon("moveRowUp")
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
        .setIcon("moveRowDown")
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
        .setIcon("moveColumnRight")
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
        .setIcon("moveColumnLeft")
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

    if (event?.constructor.name === 'SyntheticBaseEvent') {
      menu.showAtMouseEvent(event);
    } else {
      menu.showAtPosition(event as Point);
    }
  }

  return (
    <div className={`mte cell-container relative ${row === 0 ? 'header' : 'data'}`} onMouseEnter={_ => setIsHovering(true)} onMouseLeave={_ => setIsHovering(false)}>
      <ContentEditable
        className='mte cell'
        style={{ textAlign: colJustify[col] === 'LEFT' ? 'start' : colJustify[col] === 'RIGHT' ? 'end' : 'center' }}
        innerRef={contentEditable}
        html={content}
        disabled={false}
        onFocus={_ => setIsFocused(true)}
        onBlur={_ => setIsFocused(false)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        tagName='span' />
      <span onClick={e => showContextMenu(e)} ref={contextMenu}
        className={`absolute ${isHovering || isFocused ? 'display-block' : 'display-none'}`}>
        <svg viewBox="0 0 100 100" className="vertical-three-dots" width="18" height="18"><path fill="currentColor" stroke="currentColor" d="M50,6c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S56.6,6,50,6z M50,10c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8 S45.6,10,50,10z M50,38c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S56.6,38,50,38z M50,42c4.4,0,8,3.6,8,8s-3.6,8-8,8 s-8-3.6-8-8S45.6,42,50,42z M50,70c-6.6,0-12,5.4-12,12c0,6.6,5.4,12,12,12s12-5.4,12-12C62,75.4,56.6,70,50,70z M50,74 c4.4,0,8,3.6,8,8c0,4.4-3.6,8-8,8s-8-3.6-8-8C42,77.6,45.6,74,50,74z"></path></svg>
      </span>
    </div>
  )
}

export default Cell;
