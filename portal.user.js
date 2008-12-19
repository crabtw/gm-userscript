// ==UserScript==
// @name           YZU portal corrector
// @namespace      crabtw@gmail.com
// @description    let YZU portal be compatible with Firefox
// @include        https://portal.yzu.edu.tw/*
// ==/UserScript==

// rewrite functions
function showhidedetail_new(e) {
    var parenttag = e.target.parentNode;
    if(parenttag.tagName == "SPAN")
        parenttag = parenttag.parentNode;

    var imgobj = parenttag.getElementsByTagName("img")[0];
    var tables = document.evaluate(
        "code/following-sibling::table",
        parenttag,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    for(var k = 0; k < tables.snapshotLength; ++k) {
        var codeobj = tables.snapshotItem(k);

        if(codeobj.style.display == "") {
            codeobj.style.display = "none";
            imgobj.src = "http://www.yzu.edu.tw/image/plus.gif";
        } else {
            codeobj.style.display = "";
            imgobj.src = "http://www.yzu.edu.tw/image/minus.gif";
        }
    }
}

function showhidedetail1_new(no) {
    var codeobj = document.getElementsByTagName("div")[no];

    if(codeobj.style.display == "") {
        codeobj.style.display = "none";
    } else {
        codeobj.style.display = "";
    }
}

function checkList() {
    var form = document.forms['maildata'];
    var list = form.elements['MailMember'];
    var mail = form.elements['To'];
    
    mail.value = '';
    for(var i = 0; i < list.length; ++i) {
        if(list[i].checked)
            mail.value += list[i].value + ';';
    }
}

function selAll(checked) {
    var list = document.getElementsByName('MailMember');
    for(var i = 0; i < list.length; ++i)
        list[i].checked = checked;
    checkList();
}

function insertApply() {
    var vactype = document.getElementsByName('Vactype').value;
    var reason = document.getElementsByName('reason').value;
    
    var fyear = document.getElementsByName('FYear').value;
    var fmonth = document.getElementsByName('FMonth').value;
    var fday = document.getElementsByName('FDay').value;

    var eyear = document.getElementsByName('EYear').value;
    var emonth = document.getElementsByName('EMonth').value;
    var eday = document.getElementsByName('EDay').value;

    var fromtime = document.getElementsByName('FromTime').value;
    var totime = document.getElementsByName('ToTime').value;

    parent.mainFrame.location = './confirm.asp?' +
        'Vactype=' + vactype +
        '&reason=' + reason +
        '&FYear=' + fYear +
        '&FMonth=' + fmonth +
        '&FDay=' + fday +
        '&EYear=' + eyear +
        '&EMonth=' + emonth +
        '&EDay=' + eday +
        '&FromTime=' + fromtime +
        '&ToTime=' + totime;
}

// modify portal
function foldNews() {
    var newscript = document.createElement("script");
    newscript.text = showhidedetail_new.toString();
    document.body.appendChild(newscript);
    
    var spantags = document.getElementsByTagName("span");
    for(var i = 0; i < spantags.length; ++i) {
        spantags[i].setAttribute("onclick", "showhidedetail_new(event)");
        spantags[i].removeAttribute("onmouseover");
        spantags[i].removeAttribute("onmouseout");
        
        spantags[i].parentNode.
           getElementsByTagName("table")[0].style.display = "none";
    }
}

function fixLinks(frame, regex) {
    var links = document.links
    var map = {
        // course system
        '2': "../stdsellots/GetTurStdCos.asp?m_folder=1",
        '3': "../stdsellots/lotscoslist.asp",
        '4': "../stdsellots/GetTurStdCos.asp?m_folder=2",
        '5': "../stdsellots/lotsPQuestCosList.asp",
        // register
        'regidetail': 'CheckQueryRegiChargeItem.asp',
        'regiresult': 'QueryPaidResult.asp',
        'applypri': 'Myportal_prilege/main_new.asp',
        'applyloan': 'Myportal_loan/loan_clause.asp',
        'applyATM': 'selCheck/chActionList.asp',
        'eduATM': 'EduProg/EduActionList.asp',
        //student data
        'basicdata': 'student_stddata.asp',
        'family': 'student_family.asp',
        'outlook': 'student_outlook.asp',
        'learn1': 'student_learn1.asp',
        'learn2': 'student_learn2.asp',
        'action': 'student_actionrecord.asp',
        'loan': 'student_loan.asp',
        'pri': 'student_pri.asp',
        'rew': 'student_stdabsent.asp',
        'CheckHealth': 'Student_HealthCheck.asp',
        'leave_basicdata': 'student_levestd.asp',
        'leave_Alumnbasicdata': 'AlumnBasicData/basicUpdate.asp?flag=1'
    };

    for(var i = 0; i < links.length; ++i) {
        var url = null;
        var item = regex.exec(links[i].href);
        if(item) item = item[1];

        for(var key in map) {
            if(key == item)
                url = map[key];
        }

        links[i].href = url || links[i].href;
        links[i].target = frame;
   }
}

function delLayer() {
    document.getElementById("enter").style.display = "none";
}

function foldWork() {
    var newscript = document.createElement("script");
    newscript.text =
        showhidedetail_new.toString() +
        showhidedetail1_new.toString();
    document.body.appendChild(newscript);
    
    var spantags = document.getElementsByTagName("span");
    for(var i = 0, j = 0; i < spantags.length; ++i) {
        var cond = spantags[i].className == "worklist1";
        spantags[i].setAttribute(
            "onclick",
            cond ? "showhidedetail_new(event)" :
                "showhidedetail1_new("+(j++)+")"
        );
        spantags[i].removeAttribute("onmouseover");
        spantags[i].removeAttribute("onmouseout");
        
        if(cond) {
            var tables = document.evaluate(
                "code/following-sibling::table",
                spantags[i].parentNode,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );

            for(var k = 0; k < tables.snapshotLength; ++k)
                tables.snapshotItem(k).style.display = "none";
        } else {
            document.getElementsByTagName("div")[j-1].style.display = "none";
        }
    }
}

function modForm() {
    var code = 'document.getElementById("enter").style.display=';
    document.getElementById("button1").
        setAttribute("onclick", code+'""');
    document.getElementsByName("cancel")[0].
        setAttribute("onclick", code+'"none"');
    document.getElementsByName('frmUPLOAD')[0].
        setAttribute('onsubmit', '');
}

function directDL() {
    var links  = document.links;

    for(var i = 0; i < links.length; ++i) {
        links[i].href = links[i].href.replace(
            /javascript:QueryPool\('(\d{6})','(\w{5})','(\w)','(.*)'\);/,
            "http://140.138.36.178/upload/file/$1/$2$3/$4"
        );
    }
}

function foldCourse() {
    var newscript = document.createElement("script");
    newscript.text = showhidedetail1_new.toString();
    document.body.appendChild(newscript);
    
    var divtags = document.getElementsByTagName("div");
    for(var i = 0; i < divtags.length; ++i)
        divtags[i].style.display = 'none';

    var links = document.links;
    for(var i = 0; i < links.length; ++i) {
        links[i].href = links[i].href.replace(
            /javascript:showhidedetail\((\d*)\)/i,
            'javascript:showhidedetail1_new($1)'
        );
    }
}

function fixCalLink() {
    var links = document.links;
    var regex = /javascript:gopage\('(.*)'\)/i;

    for(var i = 0; i < links.length; ++i) {
        if(url = regex.exec(links[i].href)) {
            url = url[1];
            links[i].href = url;
            links[i].target = 'main';
            break;
        }
    }
}

function showPhoto() {
    document.getElementsByName('photo')[0].setAttribute(
        'onclick',
        'form1 = document.forms["form1"];'+
        'form1.method="post";'+
        'form1.action="ShowMyClassmate.asp";'+
        'form1.submit();'
    );
}

function print() {
    document.body.setAttribute(
        'onkeydown',
        'document.getElementById("enter").style.display="none";'+
        'window.print();'
    );
} 

function printPhoto() {
    document.getElementsByName('print')[0].
        setAttribute(
            'onclick',
            'window.open("./printclassmatesPicture.asp")'
        );
}

function rmCheck() {
    var form = document.forms[0];
    form.method = 'post';
    form.action = 'Question_Send.asp';

    input = document.getElementsByTagName('input');
    for(var i = 0; i < input.length; ++i) {
        if(input[i].type == 'button') {
            input[i].setAttribute(
                'onclick',
                'document.forms[0].submit();'
            );
            break;
        }
    }
}

function fixMailForm() {
    var script = document.createElement('script');
    script.text = checkList.toString() + selAll.toString();
    document.body.appendChild(script);

    var list = document.getElementsByName('MailMember');
    for(var i = 0; i < list.length; ++i)
        list[i].setAttribute('onclick', 'checkList()');

    document.getElementsByName('SelectAll')[0].setAttribute(
        'onclick',
        'selAll(true)'
    );
    document.getElementsByName('ClearAll')[0].setAttribute(
        'onclick',
        'selAll(false)'
    );
}

function rmServCheck() {
    var input = document.getElementsByTagName('input');
    for(var i = 0; i < input.length; ++i) {
        if(input[i].type == 'submit' || input[i].type == 'reset')
            input[i].setAttribute('onclick', '');
    }
}

function fixLeaveForm() {
    var script = document.createElement('script');
    script.text = insertApply.toString();
    document.body.appendChild(script);

    document.getElementsByName('Su')[0].setAttribute(
        'onclick',
        'insertApply()'
    );
}

function fixServList(act) {
    var links = document.links;
    var smtr = act == 'std_actlist' ?
        '&smtr="+document.forms["form1"].elements["smtr"].value' : '"';

    for(var i = 0; i < links.length; ++i) {
        links[i].href = links[i].href.replace(
            /javascript:get_ref\((\d*)\)/i,
            'javascript:'+
            'var form=document.forms["form1"];'+
            'form.target="_self";'+
            'form.method="post";'+
            'form.action="./ser_'+act+'.asp?page=$1'+smtr+';'+
            'form.submit();'
        );
    }
}

function fixAllCosForm() {
    document.getElementsByName('btnOk')[0].setAttribute(
        'onclick',
        'var form = document.forms["form1"];'+
        'form.method="post";'+
        'form.action="/vc/classlistsall.asp";'+
        'form.submit();'
    );
}

function addAccessKey() {
    document.getElementsByName('uid')[0].accessKey = 'u';
    document.getElementsByName('pwd')[0].accessKey = 'p';
}

// dispatch
switch(window.location.pathname.toLowerCase()) {
    case "/vc/board/showboard.asp":
        foldNews();
        break;
    case "/vc/stdsel/stdsel_home.asp":
    case "/vc/stdsellots/getturstdcos.asp":
    case "/vc/stdsellots/lotscoslist.asp":
    case "/vc/stdsellots/getstdlotslist.asp":
    case "vc/stdsellots/lotsPQuestCosList.asp":
        fixLinks('main', /javascript:changeFrame\((\d)\)/i);
        break;
    case "/vc/content/listdir.asp":
        delLayer();
        break;
    case "/vc/homework/fnewworklist.asp":
        foldWork();
        directDL();
        break;
    case "/vc/discuss/discussdetail.asp":
        foldCourse();
    case "/vc/discuss/discuss.asp":
        modForm();
        break;
    case '/noregi/student_left.asp':
    case '/personal/student/student_left.asp':
        fixLinks('mainFrame', /javascript:(\w*)\(\)/i);
        break;
    case '/vc/classpast_std.asp':
        foldCourse();
        break;
    case '/vc/classleft.asp':
        fixCalLink();
        break;
    case '/vc/contact/myclassmate.asp':
        showPhoto();
        break;
    case '/vc/contact/showmyclassmate.asp':
        printPhoto();
        break;
    case '/vc/contact/printclassmatespicture.asp':
    case '/vc/contact/printclassmates.asp':
        print();
        break;
    case '/vc/survey/survey_question.asp':
        rmCheck();
        break;
    case '/vc/contact/classemail.asp':
        fixMailForm();
        break;
    case '/ser_learn/stdserv_std/ser_dai_ins.asp':
        rmServCheck();
        break;
    case '/leave/main1.asp':
        fixLeaveForm();
        break;
    case '/ser_learn/stdserv_std/ser_act_regilist.asp':
        fixServList('act_regilist')
        break;
    case '/ser_learn/stdserv_std/ser_std_actlist.asp':
        fixServList('std_actlist');
        break;
    case '/ser_learn/stdserv_std/ser_act_dellist.asp':
        fixServList('act_dellist');
        break;
    case '/ser_learn/stdserv_std/ser_std_dailist.asp':
        fixServList('std_dailist');
        break;
    case '/ser_learn/stdserv_std/ser_std_reclist.asp':
        fixServList('std_reclist');
        break;
    case '/vc/classlistsall.asp':
        fixAllCosForm();
        break;
    case '/': case '/index.asp': case '/login.htm':
    case '/logincheck_new.asp':
        addAccessKey();
        break;
}

