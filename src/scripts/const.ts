import images from '../images/*.png';

export const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;
export const ROW = 9;
export const COL = 4;
export const SQX = 64;
export const SQY = 52;
export const VACANT = images.egg5;
export const UPPER_SHELL = images.egg6;
export const LOWER_SHELL = images.egg7;
export const board: any[] = [];
export const CHARACTER = [images.egg1, images.egg2, images.egg3, images.egg4, images.egg6, images.egg7];
