import { atom } from "jotai";
import { User } from "../types";

export const authUserAtom = atom<User | null>(null);
