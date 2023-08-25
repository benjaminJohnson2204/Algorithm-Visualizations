export interface DataStructureState {}

export interface DataStructure {
  state: DataStructureState;
  stateHistory: DataStructureState[];
  addState: (newState: DataStructureState) => void;
}

export interface AlgorithmStep {}

export interface MyAlgorithm {
  dataStructure: DataStructure;

  run: () => void;

  getStateHistory: () => AlgorithmStep[];
}
