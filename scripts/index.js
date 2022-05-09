/* eslint-disable import/extensions */
import { get } from './storage.js';
import Keyboard from './keyboard.js';

const rowsOrder = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Delete'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'Enter'],
  ['ShiftLeft', 'enru', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
  ['ControlLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
];

const lang = get('kbLang', '"ru"');

new Keyboard(rowsOrder).init(lang).createRowsCnt();

const showKeyboard = document.querySelector('.show-key');

showKeyboard.onclick = function () {
  document.querySelector('.keyboard').classList.toggle('show');
};

const capsLockBtn = document.querySelector('[data-code="CapsLock"]');
const shiftRight = document.querySelector('[data-code="ShiftRight"]');
const shiftLeft = document.querySelector('[data-code="ShiftLeft"]');

capsLockBtn.innerHTML += '<div class="checked"></div>';
shiftRight.innerHTML += '<div class="checked"></div>';
shiftLeft.innerHTML += '<div class="checked"></div>';
