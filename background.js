'use strict';

// Background script: adds Single Page App (SPA) support.
//
// This listener watches every tab for URL changes 
// and asks the content script to re-evaluate.

const api = typeof browser !== 'undefined' ? browser : chrome;

function handleTabUpdate(tabId, changeInfo) {
  // changeInfo.url is only present when the URL actually changed.
  if (!changeInfo.url) return;

  // Tell the content script the URL changed so it can show/hide the banner.
  Promise.resolve(
    api.tabs.sendMessage(tabId, { type: 'pwb:urlChanged', url: changeInfo.url })
  ).catch(() => {});
}

api.tabs.onUpdated.addListener(handleTabUpdate, { properties: ['url'] });
