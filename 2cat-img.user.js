// ==UserScript==
// @name        2cat-img
// @namespace   crabtw@gmail.com
// @description open all images
// @include     http://2cat.or.tl/~tedc21thc/*/pixmicat.php*
// @version     1
// @grant       GM_openInTab
// ==/UserScript==

var button = document.createElement('button');
button.innerHTML = 'Open All Images';
button.type = 'button';

var newDiv = document.createElement('div');
newDiv.appendChild(button);
newDiv.style.paddingBottom = '10px';

var threads = document.getElementById('threads');
threads.insertBefore(newDiv, threads.firstChild);

button.addEventListener('click', function(ev) {
    var links = threads.getElementsByTagName('a');

    for (var i = 0; i < links.length; ++i) {
        var link = links[i];

        if (link.href.match(/.+\.(png|jpe?g)$/) && link.firstChild.nodeName == '#text') {
            GM_openInTab(link.href, true);
        }
    }

    ev.target.blur();
}, false);
