'use strict';

(async () => {
  const storage = (typeof browser !== 'undefined' ? browser : chrome).storage.sync;

  const defaults = {
    urls: [],
    position: 'bottom',
    color: '#d32f2f',
    text: '\u26a0 PRODUCTION ENVIRONMENT \u26a0',
  };

  const settings = await new Promise(resolve => storage.get(defaults, resolve));

  if (!settings.urls || settings.urls.length === 0) return;

  const fullUrl = window.location.href;
  const matches = settings.urls.some(pattern => {
    const p = pattern.trim();
    if (!p) return false;
    try {
      const base = p.startsWith('*.') ? p.slice(2) : p;
      const escaped = base.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
      const regexStr = p.startsWith('*.') ? '(.*\\.)?' + escaped : escaped;
      return new RegExp(regexStr, 'i').test(fullUrl);
    } catch {
      return fullUrl.toLowerCase().includes(p.toLowerCase());
    }
  });

  if (!matches) return;

  const pos = settings.position;
  const isVertical = pos === 'left' || pos === 'right';
  const SIZE = '30px';

  // --- Banner ---
  const banner = document.createElement('div');
  banner.id = 'prod-warning-banner';

  const positionStyles = {
    top:    { top: '0', left: '0', right: '0', height: SIZE, flexDirection: 'row' },
    bottom: { bottom: '0', left: '0', right: '0', height: SIZE, flexDirection: 'row' },
    left:   { left: '0', top: '0', bottom: '0', width: SIZE, flexDirection: 'column' },
    right:  { right: '0', top: '0', bottom: '0', width: SIZE, flexDirection: 'column' },
  };

  Object.assign(banner.style, {
    position: 'fixed',
    zIndex: '2147483647',
    background: settings.color,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
    opacity: '0.92',
    userSelect: 'none',
    pointerEvents: 'none',
  }, positionStyles[pos] || positionStyles.bottom);

  // Text
  const textEl = document.createElement('span');
  textEl.textContent = settings.text;
  Object.assign(textEl.style, {
    flex: '1',
    textAlign: 'center',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.08em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

  if (isVertical) {
    textEl.style.writingMode = 'vertical-rl';
    if (pos === 'left') textEl.style.transform = 'rotate(180deg)';
  }

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '\u2715';
  closeBtn.title = 'Hide';
  Object.assign(closeBtn.style, {
    flexShrink: '0',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold',
    lineHeight: '1',
    padding: isVertical ? '6px 0' : '0 7px',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
  });

  banner.append(textEl, closeBtn);

  // --- Mini tab (shown when banner is hidden) ---
  const tab = document.createElement('div');
  tab.id = 'prod-warning-tab';
  tab.textContent = '\u26a0';
  tab.title = 'Show production banner';

  const tabPositionStyles = {
    top:    { top: '0', left: '50%', transform: 'translateX(-50%)', padding: '2px 10px 5px', borderRadius: '0 0 8px 8px' },
    bottom: { bottom: '0', left: '50%', transform: 'translateX(-50%)', padding: '5px 10px 2px', borderRadius: '8px 8px 0 0' },
    left:   { left: '0', top: '50%', transform: 'translateY(-50%)', padding: '10px 4px', borderRadius: '0 8px 8px 0', writingMode: 'vertical-rl' },
    right:  { right: '0', top: '50%', transform: 'translateY(-50%)', padding: '10px 4px', borderRadius: '8px 0 0 8px', writingMode: 'vertical-rl' },
  };

  Object.assign(tab.style, {
    position: 'fixed',
    zIndex: '2147483647',
    background: settings.color,
    color: '#fff',
    cursor: 'pointer',
    display: 'none',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    lineHeight: '1',
    opacity: '0.9',
    userSelect: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  }, tabPositionStyles[pos] || tabPositionStyles.bottom);

  // Toggle handlers
  closeBtn.addEventListener('click', e => {
    e.stopPropagation();
    banner.style.display = 'none';
    tab.style.display = 'block';
  });

  tab.addEventListener('click', () => {
    tab.style.display = 'none';
    banner.style.display = 'flex';
  });

  // Injection
  const inject = () => {
    const root = document.body || document.documentElement;
    if (!root) return;
    if (!document.getElementById('prod-warning-banner')) root.appendChild(banner);
    if (!document.getElementById('prod-warning-tab')) root.appendChild(tab);
  };

  inject();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  }
})();
