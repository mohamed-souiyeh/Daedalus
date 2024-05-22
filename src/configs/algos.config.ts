

export enum algosKeys {
  RandomWalkDFS = "RandomWalkDFS",
  recursiveDivider = "recursiveDivider",
  Kruskal = "kruskal",
  prim = "Prim",
  BFS = "BFS",
  Astar = "Astar",
  Dijkstra = "Dijkstra",
}


// NOTE: add a highlight of the skills needed in the footer of the algorithm description card.
export const mazeGenerationAlgorithms = [
  {
    key: algosKeys.RandomWalkDFS,
    name: "Random Walk DFS",
    description: "It is a maze generation algorithm that uses a randomized version of the depth-first search algorithm to generate a maze.\
    It is also known as the recursive backtracker algorithm.",
  },
  {
    key: algosKeys.recursiveDivider,
    name: "Recursive Divider (wall adder)",
    description: "It is an algorithm that generates mazes through adding walls to an impety space, it is unconvetional compared to all the other algorithms\
    since they take the oposit approuach and carve the walls in the space.",
  },
  {
    key: algosKeys.Kruskal,
    name: "Randomized Kruskal",
    description: "It is an algorithm that create an MST (minimum spanning tree) through randomized edge selection."
  },
  {
    key: algosKeys.prim,
    name: "Simplified Prim",
    description: "It is an algorithm that create an MST (minimum spanning tree) through simple first in first out order."
  },
];

export const mazeSolvingAlgorithms = [
  {
    key: algosKeys.BFS,
    name: "Breadth first search (BFS)",
    description: "Breadth-first search (BFS) is an algorithm for traversing or searching tree or graph data structures. \
    It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a 'search key'[1]) and explores the neighbor nodes first, \
    before moving to the next level neighbors, untile it finds the wanted node.",
  },
  {
    key: algosKeys.Astar,
    name: "A* Algorithm",
    description: "well it is A*",
  },
  {
    key: algosKeys.Dijkstra,
    name: "Dijkstra's Algorithm",
    description: "well it is dijkstra",
  },
];
