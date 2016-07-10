// ==UserScript==
// @name        nyaa-time
// @namespace   crabtw@gmail.com
// @description show submitted time
// @include     http://*.nyaa.se/*
// @include     https://*.nyaa.se/*
// @version     1
// @grant       GM_xmlhttpRequest
// ==/UserScript==

function addSubmittedTime(rss) {
    var rssTimes = rss.documentElement.getElementsByTagName('pubDate');
    var times = [];

    for (var i = 0; i < rssTimes.length; ++i) {
        times.push(new Date(rssTimes[i].textContent));
    }

    var thName = document.evaluate(
        "//table[@class='tlist']/tbody/tr[1]/th[2]",
        document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null
    ).singleNodeValue;

    var thDate = document.createElement('th');
    thDate.textContent = 'Date';
    thDate.style.width = '120px';

    thName.parentNode.insertBefore(thDate, thName);

    var tdNames = document.evaluate(
        "//table[@class='tlist']/tbody/tr[position() != 1]/td[2]",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );

    for (var i = 0; i < times.length; ++i) {
        var time = times[i];
        var name = tdNames.snapshotItem(i);

        var date = document.createElement('td');
        date.style.borderRight = '1px solid #666';
        date.style.padding = '0px 5px';
        date.style.whiteSpace = 'nowrap';
        date.style.fontWeight = 'bold';

        date.innerHTML = time.toLocaleFormat("%Y-%m-%d, %H:%M");
        name.parentNode.insertBefore(date, name);
        name.style.paddingLeft = '8px';
    }
}

var loc = document.location;

if (loc.search.match(/page=/) === null) {
    var rss = loc.search == '' ? loc.href + '?' : loc.href + '&';
    rss += 'page=rss';

    GM_xmlhttpRequest({
        method: "GET",
        url: rss,
        onload: function(resp) {
            if (resp.responseXML) {
                addSubmittedTime(resp.responseXML);
            }
        }
    });
} else if (loc.search.match(/page=view/)) {
    var tdTime = document.evaluate(
        "//div[@id='main']/div[3]/div/table[2]/tbody/tr[2]/td[4]",
        document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null
    ).singleNodeValue;

    var utc = tdTime.textContent.match(/(\d+)-(\d+)-(\d+), (\d+):(\d+) UTC/);
    var [_, year, mon, day, hr, min ] = utc.map(function(x) { return parseInt(x, 10); });
    var local = new Date(Date.UTC(year, mon - 1, day, hr, min));

    tdTime.textContent = local.toLocaleFormat("%Y-%m-%d, %H:%M");
}
