var loginController = {

	doLogin : function(userName, password)
	{
		$.ajax({
            type: 'POST',
            url:  pfms.URL + 'account/login',
            dataType: 'json',
            data : { "EmployeeId" : userName, "Password" : password}, 
            cache: false,
            async: true,
            crossDomain: true,
            success : function(result, status, xhr)
            {
            	ensureServerResponse(result, loginController.navigateToHome);
            }
        });
	},

	navigateToHome : function(data)
	{
		if (data !== undefined)
		{
			pfms.token = data.token;
			pfms.level = data.userInfo.Level;
			pfms.userName = data.userInfo.UserName;
            pfms.email = data.userInfo.Email;

            var pfmsSerialized = JSON.stringify(pfms);
            createCookie('pfms', pfmsSerialized);

            window.location = 'home.html';
            //mainView.router.loadPage({"url":'home.html', "force": true});
        }
	},


};

$('#btnSignIn').on('click', function(e){
	var usrName = $('#username').val();
	var passWord = $('#password').val();

	loginController.doLogin(usrName, passWord);
});