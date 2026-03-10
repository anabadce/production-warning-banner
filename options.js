'use strict';

const storage = (typeof browser !== 'undefined' ? browser : chrome).storage.sync;

const defaults = {
  urls: [],
  position: 'bottom',
  color: '#d32f2f',
  text: '\u26a0 PRODUCTION ENVIRONMENT \u26a0',
};

let currentColor = defaults.color;
let currentPosition = defaults.position;

function syncPresetActive(color) {
  document.querySelectorAll('.preset').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === color);
  });
}

// Load saved settings
storage.get(defaults, settings => {
  document.getElementById('urls').value = (settings.urls || []).join('\n');
  document.getElementById('bannerText').value = settings.text;

  currentColor = settings.color;
  currentPosition = settings.position;

  document.getElementById('colorPicker').value = currentColor;
  syncPresetActive(currentColor);

  document.querySelectorAll('.pos-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pos === currentPosition);
  });
});

// Position buttons
document.querySelectorAll('.pos-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPosition = btn.dataset.pos;
  });
});

// Color picker
document.getElementById('colorPicker').addEventListener('input', e => {
  currentColor = e.target.value;
  syncPresetActive(currentColor);
});

// Color presets
document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => {
    currentColor = btn.dataset.color;
    document.getElementById('colorPicker').value = currentColor;
    syncPresetActive(currentColor);
  });
});

// Save
document.getElementById('save').addEventListener('click', () => {
  const urls = document.getElementById('urls').value
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  const text = document.getElementById('bannerText').value.trim() || defaults.text;

  storage.set({ urls, position: currentPosition, color: currentColor, text }, () => {
    const status = document.getElementById('status');
    status.textContent = '\u2713 OK !';
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
});
