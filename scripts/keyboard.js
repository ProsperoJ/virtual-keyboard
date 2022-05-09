import * as storage from './storage.js';
import createItem from './build.js';
import language from './lang/app-lang.js';
import Key from './key.js';

const main = createItem('main', '');

export default class Keyboard {
  constructor(rows) {
    this.rows = rows;
    this.keysPressed = {};
    this.isCaps = false;
    this.shiftKey = false;
  }

  init(languageKey) {
    this.keyKeyboard = language[languageKey];
    this.output = createItem('textarea', 'output', null, main,
      ['placeholder', 'Enter text please...\nTo change the language, press "ALT + SHIFT" or a separate button with the current language'],
      ['rows', 4],
      ['cols', 40]);
    this.container = createItem('div', 'show-key', `<i class="fa-keyboard">Open</i>`, main, ['code', 'show']);
    this.container = createItem('div', 'keyboard', null, main, ['language', languageKey]);
    document.body.prepend(main);
    return this;
  }

  createRowsCnt() {
    this.keyItemsArr = [];
    this.rows.forEach((row, index) => {
      const rowContainer = createItem('div', 'keyboard__row', null, this.container, ['row', index + 1]);
      rowContainer.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        const keyObj = this.keyKeyboard.find((key) => key.code === code);
        if (keyObj) {
          const keyItem = new Key(keyObj);
          this.keyItemsArr.push(keyItem);
          rowContainer.appendChild(keyItem.div);
        }
      });
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.container.onmousedown = this.preHandleEvent;
    this.container.onmouseup = this.preHandleEvent;
  }

  preHandleEvent = (event) => {
    event.stopPropagation();
    const keyDiv = event.target.closest('.keyboard__key');
    if (!keyDiv) return;
    const { dataset: { code } } = keyDiv;
    keyDiv.addEventListener('mouseleave', this.resetStateItems);
    this.handleEvent({ code, type: event.type });
  };

  handleEvent = (event) => {
    if (event.stopPropagation) event.stopPropagation();
    const { code, type } = event;
    const keyObj = this.keyItemsArr.find((key) => key.code === code);
    if (!keyObj) return;
    this.output.focus();


    // Down
    if (type.match(/keydown|mousedown/)) {
      if (!type.match(/mouse/)) event.preventDefault();

      if (code.match(/Control|Alt|enru|Caps/) && event.repeat) return;

      if (code.match(/Control/)) this.ctrKey = true;
      if (code.match(/Alt/)) this.altKey = true;
      if (code.match(/Shift/) && this.altKey) {
        this.switchLanguage();
        // this.shiftKey = false;
        // this.altKey = false;
      }
      if (code.match(/Alt/) && this.shiftKey) {
        this.switchLanguage();
        // this.shiftKey = false;
        // this.altKey = false;
      }

      if (code.match(/enru/)) {
        this.switchLanguage();
      }

      keyObj.div.classList.add('active');

      if (code.match(/Shift/) && !this.shiftKey) {
        this.shiftKey = true;
      }if (code.match(/Shift/) && this.shiftKey) {
        this.shiftKey = false;
      }

      if (code.match(/Caps/) && !this.isCaps) {
        this.isCaps = true;
        this.switchUpperCase(true);
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;
        this.switchUpperCase(false);
      }


      if (!this.isCaps) {
        this.printText(keyObj, this.shiftKey ? keyObj.big : keyObj.small);
      } else if (this.isCaps) {
        if (this.shiftKey) {
          this.printText(keyObj, keyObj.sub.innerHTML ? keyObj.big : keyObj.small);
        } else {
          this.printText(keyObj, !keyObj.sub.innerHTML ? keyObj.big : keyObj.small);
        }
      }
      this.keysPressed[keyObj.code] = keyObj;

    // Up
    } else if (event.type.match(/keyup|mouseup/)) {
      this.resetStatePressedItems(code);

      if (code.match(/Control/)) this.ctrKey = false;
      if (code.match(/Alt/)) this.altKey = false;

      if (!code.match(/Caps/)) keyObj.div.classList.remove('active');
      if (!code.match(/Shift/)) keyObj.div.classList.remove('active');

      if (code.match(/Caps/))  {
        keyObj.div.children[2].classList.toggle('show');
      }

      if (code.match(/Shift/))  {
        keyObj.div.children[2].classList.toggle('show');
      }
    }
  }

  resetStateItems = ({ target: { dataset: { code } } }) => {
    if (code.match(/Shift/)) this.shiftKey = false;
    if (code.match(/Control/)) this.ctrKey = false;
    if (code.match(/Alt/)) this.altKey = false;
    this.resetStatePressedItems(code);
    this.output.focus();
  }

  resetStatePressedItems = (targetCode) => {
    if (!this.keysPressed[targetCode]) return;

    if (!this.isCaps) this.keysPressed[targetCode].div.classList.remove('active');
    this.keysPressed[targetCode].div.removeEventListener('mouseleave', this.resetStateItems);
    delete this.keysPressed[targetCode];
  }

  switchUpperCase(isTrue) {
    if (isTrue) {
      this.keyItemsArr.forEach((btn) => {
        if (btn.sub) {
          if (this.shiftKey) {
            btn.sub.classList.add('sub-active');
            btn.letter.classList.add('sub-inactive');
          }
        }
        if (!btn.isFnKey && this.isCaps && !this.shiftKey && !btn.sub.innerHTML) {
          btn.letter.innerHTML = btn.big;
        } else if (!btn.isFnKey && this.isCaps && this.shiftKey) {
          btn.letter.innerHTML = btn.small;
        } else if (!btn.isFnKey && !btn.sub.innerHTML) {
          btn.letter.innerHTML = btn.big;
        }
      });
    } else {
      this.keyItemsArr.forEach((btn) => {
        if (btn.sub.innerHTML && !btn.isFnKey) {
          btn.sub.classList.remove('sub-active');
          btn.letter.classList.remove('sub-inactive');
          if (!this.isCaps) {
            btn.letter.innerHTML = btn.small;
          } else if (!this.isCaps) {
            btn.letter.innerHTML = btn.big;
          }
        } else if (!btn.isFnKey) {
          if (this.isCaps) {
            btn.letter.innerHTML = btn.big;
          } else {
            btn.letter.innerHTML = btn.small;
          }
        }
      });
    }
  }

  switchLanguage = () => {
    const langAbbr = Object.keys(language);
    let langIdx = langAbbr.indexOf(this.container.dataset.language);
    this.keyKeyboard = langIdx + 1 < langAbbr.length ? language[langAbbr[langIdx += 1]]
      : language[langAbbr[langIdx -= langIdx]];

    this.container.dataset.language = langAbbr[langIdx];
    storage.set('kbLang', langAbbr[langIdx]);

    this.keyItemsArr.forEach((btn) => {
      const keyObj = this.keyKeyboard.find((key) => key.code === btn.code);
      if (!keyObj) return;
      btn.big = keyObj.big;
      btn.small = keyObj.small;
      if (keyObj.big && keyObj.big.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        btn.sub.innerHTML = keyObj.big;
      } else {
        btn.sub.innerHTML = '';
      }
      btn.letter.innerHTML = keyObj.small;
    });
    if (this.isCaps) this.switchUpperCase(true);
  }

  printText(keyObj, symbol) {
    let cursorPos = this.output.selectionStart;
    const start = this.output.value.slice(0, cursorPos);
    const end = this.output.value.slice(cursorPos);
    const textHandlers = {
      Space: () => {
        this.output.value = `${start} ${end}`;
        cursorPos += 1;
      },
      Tab: () => {
        this.output.value = `${start}` + '\t' + `${end}`;
        cursorPos += 1;
      },
      ArrowLeft: () => {
        cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
      },
      ArrowRight: () => {
        cursorPos += 1;
      },
      ArrowUp: () => {
        const positionFromLeft = `${start}`.match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPos -= positionFromLeft[0].length;
      },
      ArrowDown: () => {
        const positionFromLeft = `${end}`.match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPos += positionFromLeft[0].length;
      },
      Enter: () => {
        this.output.value = `${start}` + '\n' + `${end}`;
        cursorPos += 1;
      },
      Delete: () => {
        this.output.value = `${start}${end.slice(1)}`;
      },
      Backspace: () => {
        this.output.value = `${start.slice(0, -1)}${end}`;
        cursorPos -= 1;
      },
    };
    if (textHandlers[keyObj.code]) textHandlers[keyObj.code]();
    else if (!keyObj.isFnKey) {
      cursorPos += 1;
      this.output.value = `${start}${symbol || ''}${end}`;
    }
    this.output.setSelectionRange(cursorPos, cursorPos);
  }
}
