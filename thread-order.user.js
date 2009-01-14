// ==UserScript==
// @name           thread-order
// @namespace      crabtw@gmail.com
// @description    let threads of Discuz forum order by dateline
// @include        *
// ==/UserScript==

if(document.title.search('Discuz') != -1) {
    var links = document.links;

    for(var i = 0; i < links.length; ++i) {
        if(links[i].href.search(/forumdisplay/) != -1 &&
            links[i].href.search(/orderby/) == -1
        ) {
            links[i].href += '&orderby=dateline';
        }
    }
}
