export function parseMarkdownTable(data: string): any[][] {
  if (data) {
    data = data.trim();

    const lines = data.split('\n');
    if (lines.length < 2) {
      // handle error
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

  return [];
}


export const toMarkdown = (values: any[][]) => {
  const cols = values[0]?.length;
  let maxColWidth = Array(cols).fill(-1);
  
  // Find column width for result
  for (let rowIdx = 0; rowIdx < values.length; rowIdx++) {
    for (let colIdx = 0; colIdx < values[0].length; colIdx++) {
      maxColWidth[colIdx] = values[rowIdx][colIdx].length > maxColWidth[colIdx] ? 
                              values[rowIdx][colIdx].length : maxColWidth[colIdx];
    }
  }

  // line formatter function
  const lineformatter = (row: string[], pad: string) => `| ${row.map((h, idx) => {
    const suffix = Array(maxColWidth[idx] - (h?.length || 0)).fill(pad).join('');
    return Number.isFinite(parseFloat(h)) ? `${suffix}${h}` : `${h}${suffix}`;
  }).join(' | ')} |`;

  // Headers
  const header = lineformatter(values[0], ' ')

  // Align markers
  const alignMarker = (lineformatter(Array(cols).fill('-'), '-') as any).replaceAll(' ', '-')
  const rows = values.slice(1)
                .map(row => lineformatter(row, ' '))
                .join('\n');

  return `${header}\n${alignMarker}\n${rows}\n`;
}