import * as Papa from 'papaparse';

/* Not using this function as of now
 * Will be needed if we have to add an exception to parsing logic when [[link|alias]] is used,
 * and where we need to supress spliting at the pipe between the link and alias.
 * keeping it for now, will delete it later in case if this is not needed for a while!
 */
export function parseMarkdownTable(data: string): any[][] | undefined {
  if (data) {
    data = data.trim();

    const lines = data.split('\n');
    if (lines.length < 2) {
      return;
    }

    let headers = lines[0].split('|')
    headers = headers.splice(1, headers.length - 2);

    if (headers.length <= 1) {
      // Not a markdown table
      return
    }

    let rows = undefined;
    if (lines.length > 2) {
      rows = lines.splice(2).map((line: string) => line.split('|'));
    }

    for (let idx = 0; idx < rows.length; idx++) {
      rows[idx] = rows[idx].splice(1, rows[idx].length - 2);
    }

    const result: any[][] = []
    for (let idx = 0; idx < rows.length + 1; idx++) {
      const data = idx === 0 ? headers : rows[idx - 1]
      const rowResult = []
      for (let colIdx = 0; colIdx < data.length; colIdx++) {
        rowResult.push(data[colIdx].trim());
      }
      result.push(rowResult)
    }

    return result
  }

  return undefined;
}

export function parseInputData(input: string): any[][] | undefined {
  let {data, meta}: {data: string[][], meta: any} = Papa.parse((input || '').trim());

  if (data && data[0]?.length && data[0].length > 1) {
    if (meta.delimiter === '|') {
      // Markdown table
      // Remove the second row that represents the alignment
      if (data.length > 1) {
        data.splice(1, 1);
      }

      // Remove the first and last column that are empty when we parsed the data
      data = data.map((row: string[]) => {
        row.splice(row.length - 1, 1);
        row.splice(0, 1);
        return row;
      });

      // Handing [[link|alias]] in a cell
      data = data.map((row: string[]) => {
        let writeIndex = 0;
        const result: string[] = [];
        for (let index = 0; index < row.length; index++) {
          if (index === row.length - 1) {
            result.push(row[index]);
            continue;
          }

          if (row[index].includes('[[') && row[index].endsWith('\\') && row[index + 1].includes(']]')) {
            result[writeIndex] = `${row[index]}|${row[index + 1]}`;
            writeIndex++;
            index++;
          } else {
            result[writeIndex] = row[index];
            writeIndex++;
          }
        }
        return result;
      });
    }

    return data;
  }
  return undefined;
}

export function sanitize(data: string[][]) {
  const maxCol = data.map(r => r.length).reduce((a, v) => a > v ? a : v, -1);
  return data.map(row => {
    const diff = maxCol - row.length;
    if (diff > 0) {
      return row.concat(Array(diff).fill(''));
    } else {
      return row
    }
  });
}

export const toMarkdown = (values: any[][], colJustify: string[]): string => {
  const cols = values[0]?.length;
  let maxColWidth = Array(cols).fill(0);
  
  // Find column width for result
  for (let rowIdx = 0; rowIdx < values.length; rowIdx++) {
    for (let colIdx = 0; colIdx < values[0].length; colIdx++) {
      maxColWidth[colIdx] = values[rowIdx][colIdx].length > maxColWidth[colIdx] ? 
                              values[rowIdx][colIdx].length : maxColWidth[colIdx];
    }
  }

  // line formatter function
  const lineformatter = (row: string[]) => `| ${row.map((h, idx) => {
    const length = maxColWidth[idx] - (h?.length || 0);
    const suffix = Array(length >= 0 ? length : 1).fill(' ').join('');
    return Number.isFinite(parseFloat(h)) ? `${suffix}${h}` : `${h}${suffix}`;
  }).join(' | ')} |`;

  // Headers
  const header = lineformatter(values[0])

  // Align markers
  let alignMarker = (lineformatter(Array(cols).fill('-')) as any).replaceAll(' ', '-')
  alignMarker = alignMarker.split('|')
    .splice(1).splice(0, alignMarker.length - 2)
    .map((part: string, idx: number) => {
      if (!part || part.length < 0) {
        return part;
      }

      if (colJustify[idx] === 'LEFT') {
        return `:${part.split('').splice(1).join('')}`;
      } else if (colJustify[idx] === 'RIGHT') {
        return `${part.split('').splice(0, part.length - 1).join('')}:`;
      } else {
        return `:${part.split('').splice(1).splice(0, part.length - 2).join('')}:`;
      }
    })
    .join('|');
  alignMarker = `|${alignMarker}`;

  const rows = values.slice(1)
                .map(row => lineformatter(row))
                .join('\n');

  return `${header}\n${alignMarker}\n${rows}\n`;
}