'use strict';

// Background script: adds Single Page App (SPA) support.
//
// Content scripts only run once, when a document first loads. SPAs change the
// URL client-side (History API) without a full page load, so the content
// script never re-runs and the banner can become stale.
//
// This listener watches every tab for URL changes and asks the content script
// to re-evaluate. The URL patterns live in sync storage (configured on the
// options page) and are read by content.js

const api = typeof browser !== 'undefined' ? browser : chrome;

function handleTabUpdate(tabId, changeInfo) {
  // changeInfo.url is only present when the URL actually changed.
  if (!changeInfo.url) return;

  // Tell the content script the URL changed so it can show/hide the banner.
  // Ignore errors for tabs without a content script (e.g. about: pages).
  Promise.resolve(
    api.tabs.sendMessage(tabId, { type: 'pwb:urlChanged', url: changeInfo.url })
  ).catch(() => {});
}

api.tabs.onUpdated.addListener(handleTabUpdate, { properties: ['url'] });
