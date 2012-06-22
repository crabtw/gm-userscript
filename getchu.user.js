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

    return text;
}

function searchForm() {
    function selVal(sel, val) {
        var opts = sel.options;

        for(var i = 0; i < opts.length; ++i) {
            if(opts[i].value == val) {
                opts[i].selected = true;
                break;
            }
        }
    }

    selVal(document.getElementsByName('genre')[1], 'pc_soft');
    selVal(document.getElementsByName('age')[0], '18:lady');
    selVal(document.getElementsByName('sort2')[0], 'up');

    document.getElementsByName('release_date_start')[0].checked = true;
    document.getElementsByName('release_date_end')[0].checked = true;

    const unit = 86400000;
    var now = new Date();
    var start = new Date(now.getTime() - now.getDay() * unit);
    var end = new Date(start.getTime() + 7 * unit);
    console.log(end.toDateString());

    selVal(document.getElementsByName('start_year')[0], start.getFullYear());
    selVal(document.getElementsByName('start_month')[0], start.getMonth() + 1);
    selVal(document.getElementsByName('start_day')[0], start.getDate());

    selVal(document.getElementsByName('end_year')[0], end.getFullYear());
    selVal(document.getElementsByName('end_month')[0], end.getMonth() + 1);
    selVal(document.getElementsByName('end_day')[0], end.getDate());
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

switch(location.pathname) {
case '/php/search_top.phtml':
    searchForm();
    break;
case '/php/search.phtml':
    searchPage();
    break;
case '/soft.phtml':
    infoPage();
    break;
}
