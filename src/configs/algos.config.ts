

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
    description: "Random Walk DFS is a maze generation algorithm that uses a depth-first search algorithm to generate a maze. It is a randomized version of the depth-first search algorithm. It is also known as the recursive backtracker algorithm. (for testing purposes only)",
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
    description: "Breadth-first search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a 'search key'[1]) and explores the neighbor nodes first, before moving to the next level neighbors. (for testing purposes only)",
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
