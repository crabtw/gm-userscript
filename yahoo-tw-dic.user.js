// ==UserScript==
// @name           yahoo tw dictionary
// @namespace      crabtw@gmail.com
// @description    add accesskey for input
// @include        http://tw.dictionary.yahoo.com/*
// ==/UserScript==

input = document.getElementById('ysearchinput');
input.blur();

window.addEventListener('keypress', function(e) {
    if(e.altKey && e.shiftKey && e.charCode == 'P'.charCodeAt(0)) {
        input.focus();
    }
}, false);
