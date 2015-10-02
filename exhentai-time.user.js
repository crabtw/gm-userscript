// ==UserScript==
// @name        exhentai-time
// @namespace   crabtw@gmail.com
// @description UTC to local time
// @include     http://exhentai.org/
// @include     http://exhentai.org/?*
// @include     http://exhentai.org/favorites.php*
// @version     1
// @grant       none
// ==/UserScript==


var trTimes = document.evaluate(
    "//table[@class='itg']/tbody/tr[position() != 1]/td[2]",
    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
);

for (var i = 0; i < trTimes.snapshotLength; ++i) {
    var time = trTimes.snapshotItem(i);
    var t = time.textContent.match(/(\d+)-(\d+)-(\d+)\s+(\d+):(\d+)/);
    t.shift();

    var [year, mon, day, hr, min] = t.map(function(x) {
        return parseInt(x, 10);
    });

    var local = new Date(Date.UTC(year, mon - 1, day, hr, min));
    time.textContent = local.toLocaleFormat("%m-%d, %H:%M");
}
