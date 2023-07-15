import { atom } from "jotai";
import { Room } from "../types";

export const roomIdAtom = atom<string | null>(null);

export const roomAtom = atom<Room | null>(null);
