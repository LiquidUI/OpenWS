// Conditions header detail 
if((_transaction=="VA01" || _transaction=="VA02") ) {
	if(_transaction == 'VA02'){
		pushbutton([TOOLBAR],"@90@Document Flow",'/5');
		pushbutton([TOOLBAR],"@F9@Order Status",'/7');
	}
	pushbutton([TOOLBAR],"@2M@Back",'/3');
	if(_page.exists('Conditions')) {
		if(<'P[T\\01]'>.isValid) del("P[T\\01]");
		if(<'P[T\\02]'>.isValid) del("P[T\\02]");
		if(<'P[T\\03]'>.isValid) del("P[T\\03]");
		if(<'P[T\\04]'>.isValid) del("P[T\\04]");
		if(<'P[T\\05]'>.isValid) del("P[T\\05]");
		if(<'P[T\\07]'>.isValid) del("P[T\\07]");
		if(<'P[T\\08]'>.isValid) del("P[T\\08]");
		if(<'P[T\\09]'>.isValid) del("P[T\\09]");
		if(<'P[T\\10]'>.isValid) del("P[T\\10]");
		if(<'P[T\\11]'>.isValid) del("P[T\\11]");
		if(<'P[T\\12]'>.isValid) del("P[T\\12]");
		if(<'P[T\\13]'>.isValid) del("P[T\\13]");
		if(<'P[T\\14]'>.isValid) del("P[T\\14]");		
	}
	onUIEvents['/11']={"process":disable};
	del('M[/11]');
	del('M[/15]');
	del('M[/12]');
	del('P[/25]');	//Config
	del('P[/31]');	//Costing
	del('P[/37]');	//Header output
	del('P[/6]');	//Display sold to
	del('P[/5]');	//document flow
	del('P[/7]');	//order status
}

