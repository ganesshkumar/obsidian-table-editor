import { parseInputData } from './markdown';

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

test("parsing empty string", () => {
  const result = parseInputData('');
  expect(result).toBeUndefined();
});

test("parsing null", () => {
  const result = parseInputData(null);
  expect(result).toBeUndefined();
});

test("parsing undefined", () => {
  const result = parseInputData(undefined);
  expect(result).toBeUndefined();
});

test("parses plain markdown table", () => {
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

test("parse markdown table with unescaped wiki link", () => {
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

test("parse markdown table with unescaped wiki link", () => {
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

test("parses markdown table with after content", () => {
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

test("parses markdown table with before content", () => {
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

test("parses markdown table inside callout", () => {
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

test("parses plain csv data", () => {
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
