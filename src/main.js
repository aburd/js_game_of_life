import gameOfLife from './gameOfLife';

const body = document.querySelector('body');
const canvas = document.createElement('canvas');

body.appendChild(canvas);

gameOfLife(canvas);