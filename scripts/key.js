/* eslint-disable import/extensions */
import createItem from './build.js';

export default class Key {
  constructor({ small, big, code }) {
    this.code = code;
    this.small = small;
    this.big = big;
    this.isFnKey = Boolean(small.match(/Ctrl|arr|Alt|Shift|Tab|Back|Del|Enter|Caps|en|ru/));

    if (big && big.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
      this.sub = createItem('div', 'sub', this.big);
    } else {
      this.sub = createItem('div', 'sub', '');
    }

    this.letter = createItem('div', 'letter', small);
    this.div = createItem(
      'div',
      'keyboard__key',
      [this.sub, this.letter],
      null,
      ['code', this.code],
      this.isFnKey ? ['fn', 'true'] : ['fn', 'false'],
    );
  }
}
