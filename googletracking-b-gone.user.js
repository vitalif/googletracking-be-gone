// Google Tracking-B-Gone - FIXED version (by Vitaliy Filippov)
// version 2.5
// Release Date: 2014-06-14
// Homepage http://userscripts.org/scripts/show/120330
// See also http://userscripts.org/scripts/show/132237
//
// ===== INSTRUCTIONS =====
//
// This is a Greasemonkey user script.
// Now supports Opera (Presto).
//
// To use this script in Firefox, get Greasemonkey: http://greasemonkey.mozdev.org/
// After you've installed it, come back to this page. A dialog box will
// appear asking you if you want to install this script.
//
// To uninstall, go to Tools->Greasemonkey->Manage User Scripts, select
// "Google Tracking-B-Gone" from the list on the left, and click
// Uninstall.
//
// To use it in Opera, create a directory for userscripts, put this file into it,
// then go to Settings -> Content -> JS and point userscript directory to the
// newly created directory.
// Also set 'User JavaScript on HTTPS' = on in about:config.
//
// ==UserScript==
// @name           Google Tracking-B-Gone
// @namespace      http://sbdev.org
// @description    Strips click tracking from Google search results
//
// @include        http://*.google.*
// @include        https://*.google.*
// ==/UserScript==

doIt(); // make sure we run at least once, regardless of search results page version

document.addEventListener('DOMAttrModified', function (event) {
  doIt(event.target);
  if (event.target.id == 'xfoot' || event.target.parentNode.id == 'bfoot') {
    doIt();
  }
}, false);

document.addEventListener('DOMSubtreeModified', function (event) {
  doIt(event.target);
  if (event.target.id == 'xfoot') {
    doIt();
  }
}, false);

document.addEventListener('DOMNodeInserted', function (event) {
  if (event.target.parentNode.id == 'gsr') {
    doIt();
  }
}, false);

function doIt(e) {
  var resultLinks = e ? e.querySelectorAll('h3.r') : document.querySelectorAll('div#search h3.r');
  for (var i = 0; i < resultLinks.length; i++) {
    var link = resultLinks[i].childNodes[0];
    var oldLink = link.href;
    if (/^(https?:\/\/(www\.|encrypted\.)?google\.[^\/]*)?\/?url/.test(oldLink)) {
      var matches = /[\?&](url|q)=(.+?)&/.exec(oldLink);
      if (matches != null) {
        link.href = unescape(matches[2]);
      }
    }
    // Clear attached event listeners so google can't mangle urls on mouse click
    if (link.getAttribute('onmousedown')) {
      link.removeAttribute('onmousedown');
    }
    resultLinks[i].innerHTML = resultLinks[i].innerHTML;
  }
}
