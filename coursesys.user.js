// ==UserScript==
// @name           YZU course system corrector
// @namespace      crabtw@gmail.com
// @description    let YZU course system be compatible with Firefox
// @include        https://isdna1.yzu.edu.tw/Cnstdsel/CosTable.aspx*
// @include        https://isdna1.yzu.edu.tw/Cnstdsel/CosList.aspx*
// ==/UserScript==

const pageSubmit = 'courseSysSubmit';
const gmVal = {
    'courseSysEV': '__EVENTVALIDATION',
    'courseSysVS': '__VIEWSTATE',
    'courseSysDN': 'DPListDeptName',
    'courseSysDE': 'DPListDegree'
};

function genData() {
    var data = '';
    var trailer = '&ImageButShowDept.x=0&ImageButShowDept.y=0';

    for(var key in gmVal) {
        var val = GM_getValue(key);

        if(val)
            data += '&' + gmVal[key] + '=' + val;
    }

    return data.substr(1, data.length) + trailer;
}

function removeComment(resp) {
    var newbody = resp.responseText.replace(/<!--.*?-->/g, '').
        replace(/\r\n/g, '').match(/<body.*?>(.*?)<\/body>/)[1];
    document.body.innerHTML = newbody;

    document.forms[0].addEventListener('submit', function(e) {
        var es = e.target.elements;

        window.setTimeout(GM_setValue, 0, pageSubmit, true);
        for(var key in gmVal) {
            var pageVal = es.namedItem(gmVal[key]);

            window.setTimeout(GM_setValue, 0, key, false);
            if(pageVal) {
                window.setTimeout(
                    GM_setValue, 0, key,
                    encodeURIComponent(pageVal.value)
                );
            }
        }
    }, false);

    var script = document.createElement('script');
    script.text = (function __doPostBack(et, ea) {
        var form = document.forms['Form1'];
        var evt = document.createEvent('HTMLEvents');

        evt.initEvent('submit', false, false);
        form.dispatchEvent(evt);
        form.submit();
    }).toString();
    document.body.appendChild(script);
}

if(GM_getValue(pageSubmit)) {
    GM_setValue(pageSubmit, false);
    GM_xmlhttpRequest({
        method: 'POST',
        url: document.URL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: genData(),
        onload: removeComment
    });
} else {
    GM_xmlhttpRequest({
        method: 'GET',
        url: document.URL,
        onload: removeComment
    });
}
