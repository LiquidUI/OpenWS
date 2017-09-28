/********************************************************************************************************
								Designed by : Adarsh Kesireddy
								Modified on : 07/09/2014
********************************************************************************************************/
if((_transaction=="VA01" || _transaction=="VA02") ) {
	pushbutton([TOOLBAR],"@2M@Back",'/3');
	del("P[/14]");	//Delete item
	del("P[/45]");	//Dangerous item
	del("P[/37]");	//Item output view
	del("P[/29]");	//Item availability
	del("P[/26]");	//Batch Determtn
	del("P[/25]");	//Configuration
	del("P[/31]");	//Costing
	del("P[/8]");	//Display material

	if(<'P[T\\01]'>.isValid) del("P[T\\01]");
	if(<'P[T\\02]'>.isValid) del("P[T\\02]");
	if(<'P[T\\03]'>.isValid) del("P[T\\03]");
	if(<'P[T\\04]'>.isValid) del("P[T\\04]");
	if(<'P[T\\05]'>.isValid) del("P[T\\06]");

	if(<'P[T\\10]'>.isValid) del("P[T\\10]");
	if(<'P[T\\11]'>.isValid) del("P[T\\11]");
	if(<'P[T\\12]'>.isValid) del("P[T\\12]");
	if(<'P[T\\13]'>.isValid) del("P[T\\13]");
	if(<'P[T\\14]'>.isValid) del("P[T\\14]");		
	if(<'P[T\\15]'>.isValid) del("P[T\\15]");		
	if(<'P[T\\16]'>.isValid) del("P[T\\16]");		
	
	onUIEvents['/11']={"process":disable};
	del('M[/11]');
	del('M[/15]');
	del('M[/12]');
	del('P[/45]');	//	Dangerous good check
	del('P[/25]');
	del('P[/32]');
	del('P[/5]');	//Display document flow
}
