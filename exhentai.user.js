// ==UserScript==
// @name        exhentai
// @namespace   crabtw@gmail.com
// @description ExHentai settings
// @include     http://exhentai.org/*
// @version     1
// @grant       none
// ==/UserScript==

function listUTCToLocal() {
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
        time.textContent = local.toLocaleFormat("%Y-%m-%d, %H:%M");
    }
}

function pageUTCToLocal() {
    var time = document.evaluate(
        "//div[@id='gdd']/table/tbody/tr[1]/td[2]",
        document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null
    ).singleNodeValue;

    var t = time.textContent.match(/(\d+)-(\d+)-(\d+)\s+(\d+):(\d+)/);
    var [_, year, mon, day, hr, min] = t.map(function(x) {
        return parseInt(x, 10);
    });

    var local = new Date(Date.UTC(year, mon - 1, day, hr, min));
    time.textContent = local.toLocaleFormat("%Y-%m-%d, %H:%M");
}

function toggleOptions() {
    var searchBox = document.getElementById('searchbox');

    // category
    var category = document.evaluate(
        "//form/table/tbody/tr/td/img",
        searchBox, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );

    [
        category.snapshotItem(4), // western
        category.snapshotItem(5), // non-h
        category.snapshotItem(6), // image set
        category.snapshotItem(7), // cosplay
        category.snapshotItem(8), // asian porn
    ].forEach(function(img) {
        var input = img.parentNode.getElementsByTagName('input')[0];
        if (input.value != '0') {
            img.click();
        }
    });

    // pane
    var optsPane = document.getElementById('advdiv');
    if (optsPane.style.display == 'none') {
        document.evaluate(
            "//form/p[2]/a[1]",
            searchBox, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null
        ).singleNodeValue.click();
    }

    // options
    var opts = document.evaluate(
        "//form/div/table/tbody/tr/td/input",
        searchBox, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );

    [
        opts.snapshotItem(2), // gallery description
        opts.snapshotItem(3), // torrent filenames
        opts.snapshotItem(5), // low-power tags
        opts.snapshotItem(6), // downvoted tags
        opts.snapshotItem(7), // expunged galleries
    ].forEach(function(input) {
        if (!input.checked) {
            input.click();
        }
    });
}

var path = document.location.pathname;

switch (path) {
case '/':
    toggleOptions();
case '/favorites.php':
    listUTCToLocal();
    break;
default:
    if (path.match(/^\/g\/.+/)) {
        pageUTCToLocal();
    }
    break;
}
