// ==UserScript==
// @name           CAPTCHA decoder
// @namespace      crabtw@gmail.com
// @include        https://isdna1.yzu.edu.tw/Cnstdsel/index.aspx*
// ==/UserScript==

const decoder = 'http://hash.cse.yzu.edu.tw/~crab/yzucaptcha/decoder.php';
var imgTag = document.getElementsByTagName('img')[0];

GM_xmlhttpRequest({
    method: 'GET',
    url: imgTag.src,
    overrideMimeType: 'text/plain; charset=x-user-defined',
    onload: update
});

function update(resp) {
    b64Img = [];
    for(var i = 0; i < resp.responseText.length; ++i) {
        b64Img.push(String.fromCharCode(
            resp.responseText.charCodeAt(i) & 0xFF
        ));
    }
    b64Img = window.btoa(b64Img.join(''));
    imgTag.src = 'data:image/png;base64,' + b64Img;

    GM_xmlhttpRequest({
        method: 'POST',
        url: decoder,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 's='+encodeURIComponent(b64Img),
        onload: function(resp) {
            document.getElementById('tbCheckCode').value =
                resp.responseText;
        }
    });
}
