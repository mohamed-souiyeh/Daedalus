

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
    key: algosKeys.prim,
    name: "Simplified Prim",
    description: "This algorithm is a modified version of the original Prim graph MST (minimum spanning tree) algorithm.@ \
    It randomly selects a cell from a set of cells that are intended to be visited, \
    adds a random unvisited neighbour of that cell to the set, and links it to the current cell. \
    This process is repeated until all grid cells are visited."
  },
  {
    key: algosKeys.RandomWalkDFS,
    name: "Recursive Backtracker",
    description: "This algorithm is a tweaked implementation of the graphs algorithm DFS (depth-first search).@ \
    It explores the graph as deep as it can in random directions before backtracking to the last place where it can continue exploring until the graph is fully explored.",
  },
  {
    key: algosKeys.recursiveDivider,
    name: "Recursive Divider",
    description: "This algorithm creates mazes by placing walls on an empty grid, \
    It differs from conventional methods of carving out the maze features.@ \
    The algorithm divides the available space into two at a random point and repeats this process recursively until further divisions are not possible.",
  },
  {
    key: algosKeys.Kruskal,
    name: "Randomized Kruskal",
    description: "This algorithm is a modified version of the original Kruskal graph MST (minimum spanning tree) algorithm.@\
    It utilizes sets to maintain the connected parts of the maze and deconstructs walls between every pair of unlinked sets until all sets are connected."
  },
];

export const mazeSolvingAlgorithms = [
  {
    key: algosKeys.Dijkstra,
    name: "Dijkstra",
    description: "This algorithm ensures the shortest path and supports weighted graphs.@\
    It works by expanding outward from the starting node, \
    visiting nodes closer to the start first while taking into account the additional cost imposed by the weighted cells.@\
    It uses the Priority Queue Data Structure.",
  },
  {
    key: algosKeys.Astar,
    name: "A* (A-star)",
    description: "This graph search algorithm ensures the shortest path and supports weighted graphs.@\
    It combines aspects of Dijkstra's algorithm and a heuristic function to find the shortest path between two nodes in a graph. \
    It prioritizes the nodes that are estimated to be closer to the goal based on a heuristic (estimation function). \
    By intelligently guiding the search towards the goal, It can often find the optimal path more quickly than Dijkstra's algorithm, \
    especially in large graphs.@\
    It uses the Priority Queue Data Structure.",
  },
  {
    key: algosKeys.BFS,
    name: "Breadth first search (BFS)",
    description: "This algorithm ensures the shortest path but does not support weighted graphs.@\
    It searches by expanding outward from the starting node, \
    visiting nodes closer to the start first.@\
    It uses the Queue Data Structure (first in, first out).",
  },
];
