// ==UserScript==
// @name           classmate/TA link
// @namespace      crabtw@gmail.com
// @description    add class/TA link to YZU portal
// @include        https://portal.yzu.edu.tw/VC/vcleft.asp*
// ==/UserScript==

var title = '同學/助教';
var menuItem = "//a[@target='main']";
var hasLink = document.evaluate(
    menuItem+"[text()='"+title+"']",
    document,
    null,
    XPathResult.BOOLEAN_TYPE,
    null
).booleanValue;

if(!hasLink) {
    var link = document.createElement('a');
    link.href = document.location.href.
        replace('vcleft', 'contact/MyClassmate');
    link.target = 'main';
    link.textContent = title;

    var item = document.evaluate(
        menuItem+'/following-sibling::br',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    item.parentNode.insertBefore(link, item);
}
