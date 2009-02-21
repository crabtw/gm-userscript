// ==UserScript==
// @name           Auto Selectection
// @namespace      crabtw@gmail.com
// @description    select course automatically
// @include        https://isdna1.yzu.edu.tw/Cnstdsel/CosMain.aspx*
// ==/UserScript==

const gmVal = 'autoSelVal';
const stdVal = 'autoSelStd';
const sep = ':';
const _sep = ',';

const uri = document.location;
const base = uri.protocol + '//' + uri.hostname;

const cosInfo = '/Cnstdsel/CosInfo.aspx';
const cosTable = '/Cnstdsel/CosTable.aspx';
const cosList = '/Cnstdsel/CosList.aspx';
const selOut = '/Cnstdsel/SelOut.aspx';

const css =
'.form {width:60px;float:right} select {width:160px}'+
'body {width:120px} .label {width:50px;float:left;text-align:right}'+
'input {width:60px}';
const ui =
'<div><span class="label">id:</span>'+
'<span class="form"><input id="id" /><span></div>'+
'<div><span class="label">class:</span>'+
'<span class="form"><input id="class" /></span></div>'+
'<div><span class="label">delay:</span>'+
'<span class="form"><input id="delay" value="5" /></span></div>'+
'<div><select id="tasks" multiple="multiple" size="10"></select></div>'+
'<div><button id="add">add</button> <button id="del">delete</button></div>'+
'<div><button id="start">start</button> <button id="stop">stop</button></div>'+
'<p id="status"></p>';

var frameset = document.getElementsByTagName('frameset')[1];
var frame = document.createElement('frame');
var doc, timer;

frameset.cols = '17%,63%,*'
frameset.appendChild(frame);

function $(n) { return doc.getElementById(n); }

function parseInfo(page) {
    var pattern = '<td align="center" class="cls_info_main">(.*?)<\/td>';
    var info = page.match(new RegExp(pattern, 'g')) || [];

    return info.map(function(e) {
        return e.match(pattern)[1].replace(/\s/g, '');
    });
}

function convType(type) {
    switch(type) {
        case '必修': return 'A';
        case '選修': return 'B';
        case '通識': return 'C';
    }
}

function add() {
    var id = $('id').value.toUpperCase();
    var classNo = $('class').value.toUpperCase();
    var path = cosInfo + "?cos_id=" + id + "&cos_class=" + classNo;

    get(path, function(resp) {
        var info = parseInfo(resp.responseText);
        if(info.length == 0) return;

        var val = [
            encodeURIComponent(info[0]), convType(info[9]), id, classNo
        ].join(_sep);
        var oldVal = GM_getValue(gmVal);
        if(oldVal) oldVal = oldVal.split(sep); else oldVal = [];

        if(oldVal.some(function(e) { return e == val }))
            return;
        oldVal.push(val);

        GM_setValue(gmVal, oldVal.join(sep));
        loadList();
    });
}

function del() {
    var val = GM_getValue(gmVal, '');
    var opts = doc.getElementsByTagName('option');
    val = val.split(sep);

    for(var i = 0; i < opts.length; ++i) {
        if(opts[i].selected) {
            val = val.filter(function(e) {
                return e.search(opts[i].value) == -1;
            });
        }
    }

    GM_setValue(gmVal, val.join(sep));
    loadList();
}

function loadList() {
    var list = GM_getValue(gmVal);
    if(list) list = list.split(sep); else list = [];
    var tasks = $('tasks');

    tasks.innerHTML = '';
    list.forEach(function(e) {
        var opt = doc.createElement('option');
        var name, id, classNo;
        [name, type, id, classNo] = e.split(_sep);

        opt.innerHTML = decodeURIComponent(name);
        opt.value = id + _sep + classNo;
        tasks.appendChild(opt);
    });
}

function addCourse(id, classNo, type) {
    var stdId, smtr, stdType, deg, dept;
    [stdId, smtr, stdType, deg, dept] = GM_getValue(stdVal).split(_sep);

    var addPath = cosTable +
        "?Type=Sel" +
        "&mCntr_chk_pre_cos=N" +
        "&cos_sel_type=" + type +
        "&mStd_Typeno=" + stdType +
        "&mStd_Deptno=" + dept +
        "&mStdno=" + stdId +
        "&mCntr_smtr=" + smtr +
        "&mStd_degree=" + deg +
        "&cos_id=" + id +
        "&cos_class=" + classNo;
    var infoPath = cosInfo + "?cos_id=" + id + "&cos_class=" + classNo;

    get(infoPath, function(page) {
        var cosName, cosId, cosClass, max, cur
        [cosName, cosId, cosClass,,,,, max, cur,,,,] =
            parseInfo(page.responseText);
        max = parseInt(max);
        cur = parseInt(cur);

        $("status").innerHTML =
            cosName + "<br/>" +
            cosId + " - " + cosClass + "<br/>" +
            max + " : " + cur;

        if(cur >= max) return;

        get(addPath, function() {
            get(selOut, function(resp) {
                if(resp.responseText.search(id) == -1) return;
                var opt = doc.getElementsByTagName('option');

                for(var i = 0; i < opt.length; ++i) {
                    if(opt[i].value.search(id) != -1) {
                        opt[i].selected = true;
                        break;
                    }
                }

                del();
                frames[2].location.reload();
                if(GM_getValue(gmVal).length == 0)
                    stop();
            });
        });
    });
}

function start() {
    if(GM_getValue(gmVal).length == 0) return;

    $('add').disabled = true;
    $('del').disabled = true;
    $('start').disabled = true;

    var delay = parseInt($('delay').value) * 1000;
    timer = setInterval(function() {
        var tasks = GM_getValue(gmVal).split(sep).map(function(e) {
                e = e.split(_sep);
                e[0] = decodeURIComponent(e[0]);
                return e;
        });

        tasks.forEach(function(e) {
            [name, type, id, no] = e
            addCourse(id, no, type);
        });
    }, delay);
}

function stop() {
    $('add').disabled = false;
    $('del').disabled = false;
    $('start').disabled = false;

    clearInterval(timer);
    $('status').innerHTML = '';
}

frame.addEventListener('load', function() {
    doc = frame.contentDocument;
    var body = doc.body;
    var head = doc.getElementsByTagName('head')[0];
    var style = doc.createElement('style');

    head.appendChild(style);
    style.textContent = css;
    body.innerHTML = ui;

    $('add').addEventListener('click', add, false);
    $('del').addEventListener('click', del, false);
    $('start').addEventListener('click', start, false);
    $('stop').addEventListener('click', stop, false);

    getStdInfo();
    loadList();
}, false);

function getStdInfo() {
    get(cosList, function(resp) {
        var pattern =
            'mStdno=(\\d+)&amp;'+
            'mCntr_smtr=(\\d+).*?'+
            'mStd_Typeno=(\\d)&amp;'+
            'mStd_degree=(\\d)&amp;'+
            'mStd_Deptno=(\\d{3})';
        var info = resp.responseText.match(pattern);
        info.shift();

        GM_setValue(stdVal, info.join(_sep));
    });
}

function get(path, func) {
    GM_xmlhttpRequest({
        method: "GET",
        url: (base + path),
        onload: func
    });
}
