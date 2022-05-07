import { parseInputData } from './markdown';

const markdown = `
|   title       |   content      |
|:--------------|:---------------|
|      1        |        2       |  
`

const csv = `
title,content
1,2
`

describe("markdown parser", () => {
  it("parses markdown", () => {
    const { content, afterContent } = parseInputData(markdown);
    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('2');
  });

  it("parses csv", () => {
    const { content, afterContent } = parseInputData(csv);
    expect(content).not.toBeNull();
    expect(content.length).toBe(2);
    expect(content[0].length).toBe(2);
    expect(content[0][0].trim()).toBe('title');
    expect(content[0][1].trim()).toBe('content');
    expect(content[0].length).toBe(2);
    expect(content[1][0].trim()).toBe('1');
    expect(content[1][1].trim()).toBe('2');
  });
});
