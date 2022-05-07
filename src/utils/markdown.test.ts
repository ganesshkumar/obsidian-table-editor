import { parseInputData, sanitize, toMarkdown } from './markdown';

const simpleMarkdownTable = `
|   title       |   content      |
|:--------------|:---------------|
|      1        |        2       |  
`

const markdownTableUnescapedWithWikiLink = `
|    title        |    content                |
|:----------------|:--------------------------|
|       1         |          [[2|Two]]        |  
`

const markdownTableEscapedWithWikiLink = `
|    title        |    content                |
|:----------------|:--------------------------|
|       1         |         [[2\|Two]]        |  
`

const markdownWithAfterContent = `
|   title       |   content      |
|:--------------|:---------------|
|      1        |        2       |  
<small>Table description</small>
`

const markdownWithBeforeContent = `
# Markdown
|   title       |   content      |
|:--------------|:---------------|
|      1        |        2       |  
<small>Table description</small>
`

const markdownInsideCallout = `
> [!tip]
> |   title       |   content      |
> |:--------------|:---------------|
> |      1        |        2       |  
<small>Table description</small>
`

const simpleCSV = `
title,content
1,2
`

describe('parse input content', () => {
  it("parsing empty string", () => {
    const result = parseInputData('');
    expect(result).toBeUndefined();
  });

  it("parsing null", () => {
    const result = parseInputData(null);
    expect(result).toBeUndefined();
  });

  it("parsing undefined", () => {
    const result = parseInputData(undefined);
    expect(result).toBeUndefined();
  });

  it("parses plain markdown table", () => {
    const { content, afterContent, isInsideCallout } = parseInputData(simpleMarkdownTable);

    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('2');

    expect(afterContent).not.toBeNull();
    expect(afterContent.length).toBe(0);

    expect(isInsideCallout).toBeFalsy();
  });

  it("parse markdown table with unescaped wiki link", () => {
    const { content, afterContent } = parseInputData(markdownTableUnescapedWithWikiLink);

    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('[[2\\|Two]]');

    expect(afterContent).not.toBeNull();
    expect(afterContent.length).toBe(0);
  });

  it("parse markdown table with unescaped wiki link", () => {
    const { content, afterContent } = parseInputData(markdownTableEscapedWithWikiLink);

    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('[[2\\|Two]]');

    expect(afterContent).not.toBeNull();
    expect(afterContent.length).toBe(0);
  });

  it("parses markdown table with after content", () => {
    const { content, afterContent } = parseInputData(markdownWithAfterContent);

    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('2');

    expect(afterContent).not.toBeNull();
    expect(afterContent.length).toBe(1);
    expect(afterContent[0].length).toBe(1);
    expect(afterContent[0][0]).toBe('<small>Table description</small>');
  });

  it("parses markdown table with before content", () => {
    const { content, beforeContent } = parseInputData(markdownWithBeforeContent);

    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('2');

    expect(beforeContent).not.toBeNull();
    expect(beforeContent.length).toBe(1);
    expect(beforeContent[0].length).toBe(1);
    expect(beforeContent[0][0]).toBe('# Markdown');
  });

  it("parses markdown table inside callout", () => {
    const { content, afterContent, beforeContent, isInsideCallout } = parseInputData(markdownInsideCallout);

    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('2');

    expect(beforeContent).not.toBeNull();
    expect(beforeContent.length).toBe(1);
    expect(beforeContent[0].length).toBe(1);
    expect(beforeContent[0][0]).toBe('> [!tip]');

    expect(afterContent).not.toBeNull();
    expect(afterContent.length).toBe(1);
    expect(afterContent[0].length).toBe(1);
    expect(afterContent[0][0]).toBe('<small>Table description</small>');

    expect(isInsideCallout).toBeTruthy();
  });

  it("parses plain csv data", () => {
    const { content, afterContent } = parseInputData(simpleCSV);

    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('2');

    expect(afterContent).not.toBeNull();
    expect(afterContent.length).toBe(0);
  });
});

describe('convert to markdown', () => {
  it('simple table', () => {
    const input: string[][] = [
      ['Column 1', 'Column 2'],
      ['1', '2']
    ];

    const colJustify = ['LEFT', 'LEFT'];

    const markdown = toMarkdown(input, colJustify, false);

    expect(markdown).not.toBeNull();

    const lines = markdown.split('\n');
    expect(lines.length).toBe(3);

    expect(lines[0].split('|').length).toBe(4);
    expect(lines[0].startsWith('>')).toBeFalsy();
    expect(lines[1].startsWith('>')).toBeFalsy();
    expect(lines[2].startsWith('>')).toBeFalsy();
  });

  it('table inside callout', () => {
    const input: string[][] = [
      ['Column 1', 'Column 2'],
      ['1', '2']
    ];

    const colJustify = ['LEFT', 'LEFT'];

    const markdown = toMarkdown(input, colJustify, true);

    expect(markdown).not.toBeNull();

    const lines = markdown.split('\n');
    expect(lines.length).toBe(3);

    expect(lines[0].split('|').length).toBe(4);
    expect(lines[0].startsWith('>')).toBeTruthy();
    expect(lines[1].startsWith('>')).toBeTruthy();
    expect(lines[2].startsWith('>')).toBeTruthy();
  });

  it('table with alignments', () => {
    const input: string[][] = [
      ['Column 1', 'Column 2', 'Column 3'],
      ['1', '2', '3']
    ];

    const colJustify = ['LEFT', 'CENTER', 'RIGHT'];

    const markdown = toMarkdown(input, colJustify, false);

    expect(markdown).not.toBeNull();

    const lines = markdown.split('\n').length;
    expect(lines).toBe(3);

    const numberOfLeftAlignment = [...markdown.split('\n')[1].matchAll(/(-*)(\|:)(-*)(\|)/g)].length;
    expect(numberOfLeftAlignment).toBe(1);

    const numberOfCenterAlignment = [...markdown.split('\n')[1].matchAll(/(\|:)(-*)(:\|)/g)].length;
    expect(numberOfCenterAlignment).toBe(1);

    const numberOfRightAlignment = [...markdown.split('\n')[1].matchAll(/(\|)(-*)(:\|)/g)].length;
    expect(numberOfRightAlignment).toBe(1);
  });

  it('invald content', () => {
    const x = toMarkdown([] as string[][], [], false);
    expect(x).toBe('');
  });
});

describe('sanitize data', () => {
  it('is sanitized data', () => {
    const input: string[][] = [
      ['', '', ''],
      ['', '', ''],
    ];

    const sanitized = sanitize(input);

    expect(sanitized).not.toBeUndefined();
    expect(sanitized[0].length).toBe(3);
    expect(sanitized[1].length).toBe(3);
  });

  it('is unsanitized data', () => {
    const input: string[][] = [
      ['', '', ''],
      ['', ''],
    ];

    const sanitized = sanitize(input);

    expect(sanitized).not.toBeUndefined();
    expect(sanitized[0].length).toBe(3);
    expect(sanitized[1].length).toBe(3);
  });
});