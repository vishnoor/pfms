var noticeController = {

      template : '',

	renderItems : function(selector){
            noticeController.getTemplate();
            $(selector).html('');
            var compiledTmpl = Template7.compile(noticeController.template);

		doGet('notice', pfms.token, function(data){

                  $.each(data, function(idx, node){
                      var $entry = compiledTmpl(node);
                      $(selector).append($entry);
                  });

                  if (pfms.level > 0 && pfms.level < 100)
                  {
                        $('#notice-add').remove();
                  }
                  
            });
          
	},


      getTemplate : function()
      {
            doGetHTML('app/notice/notice-item.tmpl', function(result){
                  noticeController.template = result;
            })
      },

      SaveNotice : function()
      {
            var notice = {};
            notice["Id"] = parseInt($('.notice-id').text());
            notice["Topic"] = $('#txtSubject').val();
            notice['Content'] = $('#txtDescription').val();
            notice['ValidTill'] = $('#txtNoticeDate').val();
            notice['IsActive'] = 1;
            notice['Priority'] = 2;

            var url = 'notice';
            var data = JSON.stringify(notice);

            doPost(url, data, pfms.token, function(result){
                  if (result.Id > 0)
                  {
                        myApp.alert("Notice saved successfully.",'Axis Bank - PFMS');
                  }
                  
                  menuController.navigate('app/notice/notice.html', 'notice');
            });

      },

      DeleteNotice : function()
      {
            var id = $('.notice-id').text();
            var url = 'notice/del/' + id;
            doGet(url, pfms.token, function(response){
                 myApp.alert("Notice deleted successfully.",'Axis Bank - PFMS');
                 menuController.navigate('app/notice/notice.html', 'notice');
            })
      }
}

$().ready(function(){
      //noticeController.renderItems('#notice-item-pnl');
       
      // Add 'refresh' listener on it
      $(document).on('refresh','.notice-list-content', function (e) {
            noticeController.renderItems('#notice-item-pnl');
            myApp.pullToRefreshDone();
      });

      $(document).on('notice',function(){
            noticeController.renderItems('#notice-item-pnl');
            var pageContainer = $('div.page')[0];
            myApp.initPage(pageContainer);
      });

      $(document).on('click', '#btnAddNotice', function(){
            menuController.navigate('app/notice/add.html', 'notice-add');
      });

      $(document).on('click','.notice-item', function(){
            var id = $(this).find('.notice-id').text();
            var url = 'notice/' + id;

            var currentContent = $('.view-main').html();
            window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

            doGet(url,pfms.token, function(data){
                  doGetHTML('app/notice/notice-details.html', function(content){
                        var tmpl = Template7.compile(content);
                        var $result = tmpl(data);
                        $('.view-main').html($result);
                        $(document).trigger('notice-details');
                         window.location.hash = 'notice-details';

                  });
            });
      });

      $(document).on('click', '#btnEditNotice', function(){
            var id = $('.notice-id').text();
            var url = 'notice/' + id;

            var currentContent = $('.view-main').html();
            window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

            doGet(url,pfms.token, function(data){
                  doGetHTML('app/notice/edit.html', function(content){
                        var tmpl = Template7.compile(content);
                        var $result = tmpl(data);
                        $('.view-main').html($result);
                        $(document).trigger('notice-edit');
                        window.location.hash = 'notice-edit';
                  });
            });
      });

      $(document).on('click', '#btnSaveNotice', function(){
            noticeController.SaveNotice();
      });

      $(document).on('click', '#btnCancelNotice', function(){
            history.back();
      });

      $(document).on('click', '#btnDeleteNotice', function(){
            noticeController.DeleteNotice();
      })

});


