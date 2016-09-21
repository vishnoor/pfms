// Initialize your app
var myApp = new Framework7();

var $$= Dom7;

// Add view
var mainView = myApp.addView('.view-main');

/*
// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('notice', function (page) {
  noticeController.renderItems('#notice-item-pnl');
});
*/

window.pfms = {
    token : '',
    level : 45,
    userName : '',
    email : '' ,
    URL : 'http://localhost:23904/v1/',
};

function ensureServerResponse(result, callback)
{
    if (result !== undefined)
    {
            if (result.Status === 1)
            {
                callback(result.Data);
            }
            else
            {
                if (result.ErrorMessage)
                {
                    displayMessage(result.ErrorMessage);
                }
                else
                {
                    displayMessage(result);
                }
            }
    }
    else
    {
        displayMessage("There was no response from the server")
    }
}

function displayMessage(msg)
{
    myApp.alert(msg,"Axis Bank - PFMS");
}

 // Cookies
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";               

    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


function doPost(url, data, token, callback)
{
    $.ajax({ 
            type: 'POST',
            data: data ,
            contentType : 'application/json',
            dataType: 'json',
            headers : {
                'Authorization' :  'Bearer ' + pfms.token
            },
            url : pfms.URL + url,
            cache: false,
            async: true,
            crossDomain: true,
            success : function(result, status, xhr)
            {
                ensureServerResponse(result, callback);
            },
            done : function(result, status, xhr)
            {
                    console.log(status);
            },
            error : function(result, status, xhr)
            {
                  console.log(xhr);
            }
        });
}



function doGet(url, token, callback)
{

    if (token !== '')
    {
        $.ajax({ 
            type: 'GET',
            dataType: 'json',
            headers : {
                'Authorization' :  'Bearer ' + pfms.token
            },
            url : pfms.URL + url,
            cache: false,
            async: true,
            crossDomain: true,
            success : function(result, status, xhr)
            {
                ensureServerResponse(result, callback);
            },
            done : function(result, status, xhr)
            {
                    console.log(status);
            },
            error : function(result, status, xhr)
            {
                  console.log(status);
            }
        });
    }
    else
    {
        $.ajax({ 
            type: 'GET',
            dataType: 'json',
            url : pfms.URL + url,
            cache: false,
            async: true,
            crossDomain: true,
            success : function(result, status, xhr)
            {
                ensureServerResponse(result, callback);
            }
        });        
    }


    
}

function doGetHTML(url, callback)
{

     $.ajax({
        type: 'GET',
        url:   url,
        dataType: 'html',
        async: false,
        cache: false,
        success : function(result, status, xhr)
        {
            callback(result);
        }
    });
}

window.onpopstate = function(e){
    if(e.state){
        document.getElementsByClassName("view-main")[0].innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};