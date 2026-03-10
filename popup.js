'use strict';

document.getElementById('options-btn').addEventListener('click', () => {
  (typeof browser !== 'undefined' ? browser : chrome).runtime.openOptionsPage();
});
