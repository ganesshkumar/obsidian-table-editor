const addIcon = jest.fn();
addIcon.mockReturnValue(null);

const obsidian = jest.mock('obsidian', () => ({
  __esModule: true,
  addIcon
}));

export default obsidian;