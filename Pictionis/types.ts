export type StackParamList = {
  Home: undefined;
  Login: undefined;
  Canvas: undefined;
  Register: undefined;
  RoomForm: undefined;
  Game: undefined;
  Dashboard: undefined;
  Stat: undefined;
  RoomsList: undefined;
};

export type Player = {
  uid: string;
  username: string;
  points: number;
  foundWord: boolean;
  isAdmin: boolean;
  connected: boolean;
};

export type User = {
  uid: string;
  username: string;
  email: string;
  password: string;
  loginAt: Date;
};

export type Room = {
  playerNumber: number;
  countDown: number;
  maxRound: number;
};

export type Message = {
  content: string;
  author: string;
  timestamp: string;
};
