var contactController = {

  searchBar: {},

  cachedData: {},

  compiledTmpl: {},

  shortcuts: [],

  template : '',

	  renderItems : function(selector){
      
      contactController.getTemplate();
      //$(selector).html('');
      contactController.compiledTmpl = Template7.compile(contactController.template);

		  doGet('search', pfms.token, function(data){
            contactController.cachedData = data;
            contactController.rebuildList(data);
      });
	},

  rebuildList : function(data)
  {
      var firstLetters = [];

      $('.contacts-block').html('');
      $('.page').find('ul.list-index').remove();

      /* Build First Letters */
      $.each(data, function(idx, node){

          var alpha = node.EmployeeName.substring(0,1).toUpperCase();
          firstLetters.push(alpha);
      });

      /* Filter Unique and Sort */
      shortcuts = firstLetters.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
      shortcuts = shortcuts.sort();
      var indexContainer = $("<ul class='list-index'>");

      $.each(shortcuts, function(idx, node){
          var groupHtml = $("<div class='list-group'><ul><li class='list-group-title' data-index-letter='" + node + "'>" + node + "</li></ul></div>");

          var idxHtml = "<li data-index-letter='" + node + "'>" + node + "</li>";
          indexContainer.append(idxHtml);

          var groupData = data.filter(function(item, i, ar){
                return item.EmployeeName.substring(0,1).toUpperCase() == node;
          });

          $.each(groupData, function(idx, groupNode){
              var $entry = contactController.compiledTmpl(groupNode);
              //var innerDOM = $(groupHtml.find('.list-group-title'));
              groupHtml.append($entry);
          });
          
          $('.contacts-block').append(groupHtml);
      });

      $('.page').append(indexContainer);
  },


  getTemplate : function()
  {
        doGetHTML('app/contact/contact-item.tmpl', function(result){
              contactController.template = result;
        })
  },

  Savecontact : function()
  {
    var contact = {};
    contact["Id"] = parseInt($('.contact-id').text());
    contact["Ministry"] = $('#txtMinistry').val();
    contact['contactName'] = $('#txtcontactName1').val();
    contact['PlanOutlay'] = $('#txtPlanOutlay').val();
    contact['IsActive'] = $('#txtIsActive').prop('checked');

    var url = 'contact';
    var data = JSON.stringify(contact);

    doPost(url, data, pfms.token, function(result){
          if (result.Id > 0)
          {
                myApp.alert("contact saved successfully.",'Axis Bank - PFMS');
          }
          
          menuController.navigate('app/contact/list.html', 'contact');
    });
  },

  Deletecontact : function()
  {
        var id = $('.contact-id').text();
        var url = 'contact/del/' + id;
        doGet(url, pfms.token, function(response){
             myApp.alert("contact deleted successfully.",'Axis Bank - PFMS');
             menuController.navigate('app/contact/list.html', 'contact');
        })
  },

  Getcontacts : function(filter)
  {
        var filtered = [];
        doGet('contact/lov', pfms.token, function(data){
          if (filter !== '')
          {
                $.each(data, function(idx, elem){
                    if (elem.contactName.indexOf(filter) !== -1)
                    {
                       filtered.push(elem.contactName);
                    }
                });   
          }
          else
          {
                filtered = $.map(data, function(elem, idx){
                      return elem.contactName;
                })
          }
        });
                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  },

  naviagteToIndex : function (letter){
    var pageContent = $('.page-content');
    var scrollToEl  = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]');
     if (!scrollToEl.length) return;

    var scrollTop = scrollToEl.offset().top + pageContent.scrollTop() - 112;
    pageContent.scrollTop(scrollTop);
  }
};

$().ready(function(){
       
      // Add 'refresh' listener on it
      $(document).on('refresh','.contact-list-content', function (e) {
            contactController.renderItems('#contact-item-pnl');
            myApp.pullToRefreshDone();
      });

      $(document).on('contact',function(){
            contactController.renderItems('#contact-item-pnl');
            var pageContainer = $('div.page')[0];
            myApp.initPage(pageContainer);

            contactController.searchBar =  myApp.searchbar('.searchbar', {
                searchList: '.list-block-search',
                searchIn: '.topic',
                hideGroups : false,
                onDisable : function()
                {
                  contactController.rebuildList(contactController.cachedData);
                }
            });   
      });

      $(document).on('click', '#btnAddcontact', function(){
            menuController.navigate('app/contact/add.html', 'contact-add');
      });

      $(document).on('click','.contact-item', function(){
            if (pfms.level > 99 || pfms.level == 0)
            {
                  var id = $(this).find('.contact-id').text();
                  var url = 'contact/' + id;

                  var currentContent = $('.view-main').html();
                  window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

                  doGet(url,pfms.token, function(data){
                        doGetHTML('app/contact/contact-details.html', function(content){
                              var tmpl = Template7.compile(content);
                              var $result = tmpl(data);
                              $('.view-main').html($result);
                              $(document).trigger('contact-details');
                               window.location.hash = 'contact-details';

                        });
                  });
            }
      });

      $(document).on('click', '#btnEditcontact', function(){
            var id = $('.contact-id').text();
            var url = 'contact/' + id;

            var currentContent = $('.view-main').html();
            window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

            doGet(url,pfms.token, function(data){
                  doGetHTML('app/contact/edit.html', function(content){
                        var tmpl = Template7.compile(content);
                        var $result = tmpl(data);
                        $('.view-main').html($result);
                        $(document).trigger('contact-edit');
                        window.location.hash = 'contact-edit';
                  });
            });
      });

      $(document).on('click', '#btnSavecontact', function(){
            contactController.Savecontact();
      });

      $(document).on('click', '#btnCancelcontact', function(){
            history.back();
      });

      $(document).on('click', '#btnDeletecontact', function(){
            contactController.Deletecontact();
      });

      $(document).on('click', 'li[data-index-letter]', function(){

          contactController.rebuildList(contactController.cachedData);

          var letter = $(this).attr('data-index-letter');
          contactController.naviagteToIndex(letter);
      })
});


