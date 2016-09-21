var schemeController = {

  searchBar: {},

  cachedData: {},

  compiledTmpl: {},

  shortcuts: [],

  template : '',

	  renderItems : function(selector){
      
      schemeController.getTemplate();
      //$(selector).html('');
      schemeController.compiledTmpl = Template7.compile(schemeController.template);

		  doGet('scheme', pfms.token, function(data){
            schemeController.cachedData = data;
            schemeController.rebuildList(data);
      });
	},

  rebuildList : function(data)
  {
      var firstLetters = [];

      $('.contacts-block').html('');
      $('.page').find('ul.list-index').remove();

      /* Build First Letters */
      $.each(data, function(idx, node){

          var alpha = node.SchemeName.substring(0,1).toUpperCase();
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
                return item.SchemeName.substring(0,1).toUpperCase() == node;
          });

          $.each(groupData, function(idx, groupNode){
              var $entry = schemeController.compiledTmpl(groupNode);
              //var innerDOM = $(groupHtml.find('.list-group-title'));
              groupHtml.append($entry);
          });
          
          $('.contacts-block').append(groupHtml);
      });

      $('.page').append(indexContainer);
  },


  getTemplate : function()
  {
        doGetHTML('app/scheme/scheme-item.tmpl', function(result){
              schemeController.template = result;
        })
  },

  Savescheme : function()
  {
    var scheme = {};
    scheme["Id"] = parseInt($('.scheme-id').text());
    scheme["Ministry"] = $('#txtMinistry').val();
    scheme['SchemeName'] = $('#txtSchemeName1').val();
    scheme['PlanOutlay'] = $('#txtPlanOutlay').val();
    scheme['IsActive'] = $('#txtIsActive').prop('checked');

    var url = 'scheme';
    var data = JSON.stringify(scheme);

    doPost(url, data, pfms.token, function(result){
          if (result.Id > 0)
          {
                myApp.alert("Scheme saved successfully.",'Axis Bank - PFMS');
          }
          
          menuController.navigate('app/scheme/list.html', 'scheme');
    });
  },

  Deletescheme : function()
  {
        var id = $('.scheme-id').text();
        var url = 'scheme/del/' + id;
        doGet(url, pfms.token, function(response){
             myApp.alert("Scheme deleted successfully.",'Axis Bank - PFMS');
             menuController.navigate('app/scheme/list.html', 'scheme');
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
      $(document).on('refresh','.scheme-list-content', function (e) {
            schemeController.renderItems('#scheme-item-pnl');
            myApp.pullToRefreshDone();
      });

      $(document).on('scheme',function(){
            schemeController.renderItems('#scheme-item-pnl');
            var pageContainer = $('div.page')[0];
            myApp.initPage(pageContainer);

            schemeController.searchBar =  myApp.searchbar('.searchbar', {
                searchList: '.list-block-search',
                searchIn: '.topic',
                hideGroups : false,
                onDisable : function()
                {
                  schemeController.rebuildList(schemeController.cachedData);
                }
            });   
      });

      $(document).on('click', '#btnAddscheme', function(){
            menuController.navigate('app/scheme/add.html', 'scheme-add');
      });

      $(document).on('click','.scheme-item', function(){
            if (pfms.level > 99 || pfms.level == 0)
            {
                  var id = $(this).find('.scheme-id').text();
                  var url = 'scheme/' + id;

                  var currentContent = $('.view-main').html();
                  window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

                  doGet(url,pfms.token, function(data){
                        doGetHTML('app/scheme/scheme-details.html', function(content){
                              var tmpl = Template7.compile(content);
                              var $result = tmpl(data);
                              $('.view-main').html($result);
                              $(document).trigger('scheme-details');
                               window.location.hash = 'scheme-details';

                        });
                  });
            }
      });

      $(document).on('click', '#btnEditScheme', function(){
            var id = $('.scheme-id').text();
            var url = 'scheme/' + id;

            var currentContent = $('.view-main').html();
            window.history.pushState({"html":currentContent ,"pageTitle":'Axis Bank - PFMS'},"", window.location.href);

            doGet(url,pfms.token, function(data){
                  doGetHTML('app/scheme/edit.html', function(content){
                        var tmpl = Template7.compile(content);
                        var $result = tmpl(data);
                        $('.view-main').html($result);
                        $(document).trigger('scheme-edit');
                        window.location.hash = 'scheme-edit';
                  });
            });
      });

      $(document).on('click', '#btnSaveScheme', function(){
            schemeController.Savescheme();
      });

      $(document).on('click', '#btnCancelScheme', function(){
            history.back();
      });

      $(document).on('click', '#btnDeleteScheme', function(){
            schemeController.Deletescheme();
      });

      $(document).on('click', 'li[data-index-letter]', function(){

          schemeController.rebuildList(schemeController.cachedData);

          var letter = $(this).attr('data-index-letter');
          schemeController.naviagteToIndex(letter);
      })
});


