var menuController = {
     
     attachMenu : function(element)
     {
     	$.ajax({
            type: 'GET',
            url:  'menu/menu.html',
            dataType: 'html',
            cache: false,
            async: true,
            success : function(result, status, xhr)
            {
            	$('#' + element).append(result);
            }
        });
     },

     navigate : function(url, pageName)
     {
        doGetHTML(url, function(content){
            
            var currentContent = $('.view-main').html();
            window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

            $('.view-main').html(content);
            window.location.hash =  pageName;
            
        });
        myApp.closePanel();
        $(document).trigger(pageName);

     },

     checkAccess : function()
     {
        var pfmsSerialzed = readCookie('pfms');
        window.pfms = JSON.parse(pfmsSerialzed);

        //console.log(window.pfms.token);
        if (window.pfms.token !== '')
        {
             menuController.attachMenu('appMenu');
        }
        else
        {
            if (window.location.href.indexOf("index.html") === -1)
            {
                window.location = 'index.html';
            }
        }
     },

};



$().ready(function(){

     menuController.checkAccess();

    $(document).on('click','.menu-item', function(e){ 
        var url = $(this).attr('data-url');
        var pageName = $(this).attr('data-page');

        menuController.navigate(url, pageName);
    });
})

