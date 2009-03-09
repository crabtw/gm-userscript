// ==UserScript==
// @name           Getchu
// @namespace      crabtw@gmail.com
// @description    copy name and URL easily
// @include        http://www.getchu.com/*
// ==/UserScript==

function createTextArea(name, url) {
    var text = document.createElement("textarea");

    text.value = name + "\n" + url;
    text.rows = 2;
    text.cols = 50;
    text.readOnly = true;
    text.addEventListener("mouseover", function() {
        this.select();
    }, false);

    return text;
}

function searchPage() {
    var links = document.links;

    for(var i = 0; i < links.length; ++i) {
        if(links[i].className != 'greenb' &&  links[i].className != 'blueb')
            continue;

        var paren = links[i].parentNode
        paren.appendChild(document.createElement('br'));
        paren.appendChild(
            createTextArea(
                links[i].textContent,
                links[i].href
            )
        );
    }
}

function infoPage() {
    var title = document.getElementById('soft-title');

    title.appendChild(document.createElement('br'));
    title.appendChild(
        createTextArea(
            title.firstChild.textContent.replace(/^\s+|\s+$/g, ''),
            document.URL
        )
    );
}

function fixSearchForm() {
    document.getElementsByName('form1')[0].action = '/php/search.phtml';
}

switch(location.pathname) {
case '/php/calendar.phtml':
case '/php/search.phtml':
    searchPage();
    break;
case '/soft.phtml':
    infoPage();
    break;
case '/php/search_top.phtml':
    fixSearchForm();
    break;
}
