import { jest } from "@jest/globals";
import { addRoomSet, deleteRoomSet, editRoomSet, fetchRoomSets } from "./actions.js";

jest.unstable_mockModule("../src/actions.js", () => ({
    addRoomSet: jest.fn(),
    deleteRoomSet: jest.fn(),
    editRoomSet: jest.fn(),
    fetchRoomSets: jest.fn()
}));

const { addRoomSet, deleteRoomSet, editRoomSet, fetchRoomSet } = await import("../src/actions.js");

beforeEach(() => {
  addRoomSet.mockClear();
  deleteRoomSet.mockClear();
  editRoomSet.mockClear();
  fetchRoomSets.mockClear();
});

test("Create a room set.", async () => {
  const project = {
    alias: "cli",
    path: "C:\\Users\\Clyde\\OneDrive\\Documents\\front-end-masters-course\\node-v3\\my-cli",
  };

  insertProject.mockResolvedValue(project);
  readDB.mockResolvedValue({ projects: [project] });
  const result = await newProject(project.alias, project.path, false);
  expect(result.alias).toEqual(project.alias);
  expect(result.path).toEqual(project.path);
});

test("Show all projects.", async () => {
  const projects = [
    {
      alias: "cli",
      path: "C:\\Users\\Clyde\\OneDrive\\Documents\\front-end-masters-course\\node-v3\\my-cli",
    },
    {
      alias: "pli",
      path: "C:\\Users\\Clyde\\OneDrive\\Documents\\front-end-masters-course\\node-v3\\my-cli",
    },
    {
      alias: "tli",
      path: "C:\\Users\\Clyde\\OneDrive\\Documents\\front-end-masters-course\\node-v3\\my-cli",
    },
  ];

  readDB.mockResolvedValue({ projects: projects });
  const result = await showAllProjects();
  expect(result).toEqual(projects);
});