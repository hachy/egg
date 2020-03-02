import { Global } from './global';

export const ready = (): void => {
  Global.pieces = [];
  Global.pieces = Global.waiting;
  Global.done = false;
};
