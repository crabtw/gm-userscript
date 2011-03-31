// ==UserScript==
// @name           dinbendon
// @namespace      crabtw@gmail.com
// @description    complete dinbendon captcha
// @include        http://*dinbendon.net/do/*
// ==/UserScript==

window.addEventListener('load', function() {
    if(document.getElementById('signInPanel_signInForm') == null) {
        return;
    }

    var input = document.getElementsByName('result')[0];
    var [_, a, b] = input.parentNode.
                          previousElementSibling.
                          textContent.
                          match(/(\d+).+(\d+)=/);
    input.value = parseInt(a, 10) + parseInt(b, 10);
}, false);
