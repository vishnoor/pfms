var activityController = {

      template : '',

	renderItems : function(selector){
            activityController.getTemplate();
            $(selector).html('');
            var compiledTmpl = Template7.compile(activityController.template);

		doGet('activity', pfms.token, function(data){

                  $.each(data, function(idx, node){
                      var $entry = compiledTmpl(node);
                      $(selector).append($entry);
                  });
                  
            });
          
	},


      getTemplate : function()
      {
            doGetHTML('app/activity/activity-item.tmpl', function(result){
                  activityController.template = result;
            })
      },

      Saveactivity : function()
      {
            var activity = {};
            activity["Id"] = parseInt($('.activity-id').text());
            activity["DeptVisited"] = $('#txtDeptVisited').val();
            activity['SchemeName'] = $('#txtSchemeName').val();
            activity['ProjectStage'] = $('#txtProjectStage').val();
            activity['ActivityDate'] = $('#txtActivityDate').val();
            activity['Remarks'] = $('#txtRemarks').val();

            var url = 'activity';
            var data = JSON.stringify(activity);

            doPost(url, data, pfms.token, function(result){
                  if (result.Id > 0)
                  {
                        if (data.Remarks !== '')
                        {
                              url = 'activity/remark';
                              doPost(url, data, pfms.token, function(result){});
                        }

                        myApp.alert("Activity saved successfully.",'Axis Bank - PFMS');
                  }
                  
                  menuController.navigate('app/activity/list.html', 'activity');
            });


            
            

      },

      Deleteactivity : function()
      {
            var id = $('.activity-id').text();
            var url = 'activity/del/' + id;
            doGet(url, pfms.token, function(response){
                 myApp.alert("Activity deleted successfully.",'Axis Bank - PFMS');
                 menuController.navigate('app/activity/list.html', 'activity');
            })
      },

      GetSchemes : function(filter)
      {
            var filtered = [];
            doGet('scheme/lov', pfms.token, function(data){
                  
                  if (filter !== '')
                  {
                        $.each(data, function(idx, elem){
                            if (elem.SchemeName.indexOf(filter) !== -1)
                            {
                               filtered.push(elem.SchemeName);
                            }
                        });   
                  }
                  else
                  {
                        filtered = $.map(data, function(elem, idx){
                              return elem.SchemeName;
                        })
                  }

                  var myPicker = myApp.picker({
                      input: '.scheme-list-popup',
                      cols: [
                         {
                           values: filtered
                         }
                       ]
                  });   

                  myPicker.open();

            });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      }
}

$().ready(function(){
      //activityController.renderItems('#activity-item-pnl');
       
      // Add 'refresh' listener on it
      $(document).on('refresh','.activity-list-content', function (e) {
            activityController.renderItems('#activity-item-pnl');
            myApp.pullToRefreshDone();
      });

      $(document).on('activity',function(){
            activityController.renderItems('#activity-item-pnl');
            var pageContainer = $('div.page')[0];
            myApp.initPage(pageContainer);
      });

      $(document).on('click', '#btnAddActivity', function(){
            menuController.navigate('app/activity/add.html', 'activity-add');
      });

      $(document).on('click','.activity-item', function(){
            if (pfms.level > 99 || pfms.level == 0)
            {
                  var id = $(this).find('.activity-id').text();
                  var url = 'activity/' + id;

                  var currentContent = $('.view-main').html();
                  window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

                  doGet(url,pfms.token, function(data){
                        doGetHTML('app/activity/activity-details.html', function(content){
                              var tmpl = Template7.compile(content);
                              var $result = tmpl(data);
                              $('.view-main').html($result);
                              $(document).trigger('activity-details');
                               window.location.hash = 'activity-details';

                        });
                  });
            }
      });

      $(document).on('click', '#btnEditActivity', function(){
            var id = $('.activity-id').text();
            var url = 'activity/' + id;

            var currentContent = $('.view-main').html();
            window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

            doGet(url,pfms.token, function(data){
                  doGetHTML('app/activity/edit.html', function(content){
                        var tmpl = Template7.compile(content);
                        var $result = tmpl(data);
                        $('.view-main').html($result);
                        $(document).trigger('activity-edit');
                        window.location.hash = 'activity-edit';
                  });
            });
      });

      $(document).on('click', '#btnSaveActivity', function(){
            activityController.Saveactivity();
      });

      $(document).on('click', '#btnCancelActivity', function(){
            history.back();
      });

      $(document).on('click', '#btnDeleteActivity', function(){
            activityController.Deleteactivity();
      });

      $(document).on('click','#txtSchemeName', function(){
            activityController.GetSchemes('');

      });

});


