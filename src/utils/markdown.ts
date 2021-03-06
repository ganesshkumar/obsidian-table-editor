import * as Papa from 'papaparse';

function sanitizeWikiLinks(input: string): string {
  const matches = (input || '').matchAll(/\[\[\w*\|\w*\]\]/g);
  let match = matches.next();
  while (!match.done) {
    const value = match.value['0'];
    input = input.replace(value, value.replace('|', '\\|'));
    match = matches.next()
  }
  return input;
}

function extractAfterContent(input: string[][]): string[][] {
  if (input && input[0] && input[0].length > 1) {
    let idx = -1;
    for (idx = 0; idx < input.length; idx++) {
      if (input[idx].length == 1) {
        break;
      }
    }

    return input.splice(idx);
  }

  return [] as string[][];
}

function extractBeforeContent(input: string[][]): string[][] {
  if (input && input[0]) {
    let idx = -1;
    for (idx = 0; idx < input.length; idx++) {
      if (input[idx].length > 1) {
        break;
      }
    }

    return input.splice(0, idx);
  }

  return [] as string[][];
}

function removeAlignmentRow(input: string[][]) {
  // Remove the second row that represents the alignment
  if (input.length > 1) {
    input.splice(1, 1);
  }
}

function mergeWikiLinkCells(input: string[][]): string[][] {
  return input.map((row: string[]) => {
    let writeIndex = 0;
    const result: string[] = [];

    for (let index = 0; index < row.length; index++) {
      // Last cell in a row
      if (index === row.length - 1) {
        result.push(row[index]);
        continue;
      }

      if (row[index].includes('[[') && row[index].endsWith('\\') && row[index + 1].includes(']]')) {
        // Cells with wiki links
        let current = row[index];
        let offset = 1;
        while (current.includes('[[') && current.endsWith('\\') && row[index + offset].includes(']]')) {
          current = `${current}|${row[index + offset]}`;
          offset++;
        }
        result[writeIndex] = current;
        writeIndex++;
        index = index + offset;
      } else {
        // Normal cells
        result[writeIndex] = row[index];
        writeIndex++;
      }
    }

    return result;
  });
}

const papaConfig = {
  escapeChar: '\\',
}

export function parseInputData(input: string): { content: string[][], afterContent: string[][], beforeContent: string[][], isInsideCallout: boolean } | undefined {
  input = sanitizeWikiLinks(input);

  let { data, meta }: { data: string[][], meta: any } = Papa.parse((input || '').trim(), papaConfig);
  let afterContent: string[][] = undefined;
  let beforeContent: string[][] = undefined;
  let leftContent: string[] = [] as string[];

  if (data && data[0]?.length) {
    beforeContent = extractBeforeContent(data);
    afterContent = extractAfterContent(data);


    if (meta.delimiter === '|') {
      // Remove the first and last column that are empty when we parsed the data
      data = data.map((row: string[]) => {
        row.splice(row.length - 1, 1);

        const dataOnLeft = row.splice(0, 1)
        leftContent.push(dataOnLeft.join(''));

        return row;
      });

      // Markdown table
      removeAlignmentRow(data);

      // Handing [[link|alias]] in a cell
      data = mergeWikiLinkCells(data);
    }

    return {
      content: data,
      afterContent,
      beforeContent,
      isInsideCallout: leftContent.length > 0 && leftContent.map(v => v.trim()).every(v => v.startsWith('>')),
    };
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

export const toMarkdown = (values: any[][], colJustify: string[], isInsideCallout: boolean): string => {
  const cols = values[0]?.length;
  if (!cols) {
    return '';
  }

  let maxColWidth = Array(cols).fill(0);

  // Find column width for result
  for (let rowIdx = 0; rowIdx < values.length; rowIdx++) {
    for (let colIdx = 0; colIdx < values[0].length; colIdx++) {
      maxColWidth[colIdx] = values[rowIdx][colIdx].length > maxColWidth[colIdx] ?
        values[rowIdx][colIdx].length : maxColWidth[colIdx];
    }
  }

  // line formatter function
  const lineformatter = (row: string[]) => `| ${row?.map((value, idx) => {
    const length = maxColWidth[idx] - (value?.length || 0);
    const suffix = Array(length >= 0 ? length : 1).fill(' ').join('');
    return Number.isFinite(parseFloat(value)) ? `${suffix}${value}` : `${value}${suffix}`;
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

  let markdown = `${header}\n${alignMarker}\n${rows}`;
  if (isInsideCallout) {
    markdown = markdown.split('\n').map(row => `> ${row}`).join('\n');
  }

  return markdown;
}