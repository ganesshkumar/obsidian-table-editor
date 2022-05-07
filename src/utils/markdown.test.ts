import { parseInputData } from './markdown';

const simpleMarkdownTable = `
|   title       |   content      |
|:--------------|:---------------|
|      1        |        2       |  
`

const simpleMarkdownTableWithWikiLink = `
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

const simpleCSV = `
title,content
1,2
`;

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
  const { content, afterContent } = parseInputData(simpleMarkdownTable);

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

test("parse markdown table with unescaped wiki link", () => {
  const { content, afterContent } = parseInputData(simpleMarkdownTableWithWikiLink);

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
