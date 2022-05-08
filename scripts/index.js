// const keyCodes = [
//   ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
//   ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
//   ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote',
//   'Enter'],
//   ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
//   ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
// ];

class Keyboard {
  constructor() {
    this.main = null;
    this.keysContainer = null;
    this.output = null;
    this.oninput = null;
    this.onclose = null;
    this.value = '';
    this.capsLock = false;
  }

  init() {
    // create main element
    this.main = document.createElement('div');
    this.keysContainer = document.createElement('div');

    // setup main elements
    this.main.classList.add('keyboard', 'keyboard--hidden');
    this.keysContainer.classList.add('keyboard__keys');
    this.keysContainer.appendChild(this._createKeys());

    this.keys = this.keysContainer.querySelectorAll('.keyboard__key');


    // create textarea element
    this.output = document.createElement('textarea');
    this.output.classList.add('use-keyboard-input');

    // add to DOM
    this.main.appendChild(this.keysContainer);
    document.body.appendChild(this.main);
    document.body.appendChild(this.output);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
          this.open(element.value, currentValue => {
              element.value = currentValue;
          });
      });
    });
  }

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "space"
    ]

    // create HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`
    }

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

      // add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case "backspace":
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            this.value = this.value.slice(0, -1);
            this._triggerEvent('oninput');
          })

          break;

        case "caps":
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.capsLock);
          })

          break;

        case "enter":
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            this.value += '\n';
            this._triggerEvent('oninput');
          })

          break;

        case "space":
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            this.value += ' ';
            this._triggerEvent('oninput');
          })

          break;

        case "done":
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          })

          break;

          default:
            keyElement.textContent = key.toLowerCase();

            keyElement.addEventListener("click", () => {
              this.value += this.capsLock ? key.toUpperCase() : key.toLowerCase();
              this._triggerEvent("oninput");
            });

            break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  _triggerEvent() {
    this.output.value = this.value;
  }

  _toggleCapsLock() {
    this.capsLock = !this.capsLock;

    for (const key of this.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  }

  open(initialValue, oninput, onclose) {
    this.value = initialValue || "";
    this.oninput = oninput;
    this.onclose = onclose;
    this.main.classList.remove("keyboard--hidden");
  }

  close() {
    this.value = "";
    this.oninput = oninput;
    this.onclose = onclose;
    this.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  new Keyboard().init()
});
