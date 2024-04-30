

export enum algosKeys {
  Random = "Random",
  RandomWalkDFS = "RandomWalkDFS",
  recursiveDivider = "recursiveDivider",
  BFS = "BFS",
  Astar = "Astar",
  Dijkstra = "Dijkstra",
}

export const mazeGenerationAlgorithms = [
  // {
  //   key: algosKeys.Random,
  //   name: "Random",
  // },
  {
    key: algosKeys.RandomWalkDFS,
    name: "Random Walk DFS",
  },
  // {
  //   key: algosKeys.recursiveDivider,
  //   name: "recursive devider (wall adder)",
  // },
];

export const mazeSolvingAlgorithms = [
  // {
  //   key: algosKeys.Random,
  //   name: "Random",
  // },
  {
    key: algosKeys.BFS,
    name: "Breadth first search (BFS)",
  },
  // {
  //   key: algosKeys.Astar,
  //   name: "A* Algorithm",
  // },
  // {
  //   key: algosKeys.Dijkstra,
  //   name: "Dijkstra's Algorithm",
  // },
];
