//**************************************************************************************************//
//Developed By:		Synactive, Inc.																	
//Version: 			1.0																				
//Purpose: 			User Launchpad
//Executed On:		SAP Easy Access Screen
//					
//**************************************************************************************************//
load('functionsGeneric.sjs');
load('functionsVA01.sjs');

deleteElements();

set('V[me21n*]','');
me21nPOStatus = false;
if(isBlank(z_va02_order)) z_va02_order = '5235';
z_vl02n_dlv = '80003637';
pushbutton([TOOLBAR],"@3D@Settings",{"process":toggleUI,"using":{"l_mode":"NTT-DFLT"}});
if(isBlank(allItemsLayout))
	set('V[allItemsLayout]','JAPAN');

switch(screenMODE) {

	case 'FLP':
		title('Fiori Launchpad');
		pushbutton([TOOLBAR],'@2M@Back','?',{'process':toggleUI, 'using':{'l_mode':''}});
		box([0,0], [16,56], "Sales and Distribution");
		pushbutton([1,1], "@0Y@Create SO", "/nva01",{ "size":[5,13]});
		pushbutton([1,15], "@13@Search SO", "/nva05",{ "size":[5,13]});
		pushbutton([6,1], "@2V@Inventory", "/nmmbe",{ "size":[5,13]});
		pushbutton([6,15], "@0Y@Customer", "/nxd01",{ "size":[5,13]});
		pushbutton([11,1], "@OV@View Material", "/nmm03",{ "size":[5,13]});
		pushbutton([11,15], "@02@Log Off - &V[_user]", "/nex",{ "size":[5,13]});

		text([2,30],'Order#     ->');
		inputfield([3,30], {'name':'z_va02_order','size':10,'numerical':true,'required':true, 'nolabel':true});
		pushbutton([1,43], "@0Q@Change", "/nva02",{ "size":[5,13],"process":va0xEnter});
		text([7,30],'Delivery#  ->');
		inputfield([8,30],{'name':'z_vl02n_dlv','size':10,'numerical':true,'required':true, 'rf_barcode':true, 'nolabel':true});
		pushbutton([6,43], "@V1@Change", "/nvl02n",{ "size":[5,13],"process":vl02nEnter});

		view([17,0],[30,57],'http://www.guixt.com');
		comment([31,1],'Powered by Liquid UI [Synactive, Inc. (www.guixt.com)]');
		
		fromMODE = screenMODE;
		break;

	case 'NTT-DFLT':
		box([0,0], [10,45], "Select All Items Layout");
		box([1,1], [9,43], "");
		radiobutton([2,14],"America",{"name":"allItemsLayout","value":"AMERICAS"});
		radiobutton([4,14],"Asia",{"name":"allItemsLayout","value":"ASIA"});
		radiobutton([6,14],"United Kingdom",{"name":"allItemsLayout","value":"EMEA"});
		radiobutton([8,14],"Japan",{"name":"allItemsLayout","value":"JAPAN"});
		pushbutton([TOOLBAR],"@2L@Save",{"process":toggleUI,"using":{"l_mode":fromMODE}, "size":[1,10]});
		onUIEvents['Enter'] = {'fcode':'?'};
		break;
		
	default:
		pushbutton([TOOLBAR],'@L2@Fiori Launchpad','?',{'process':toggleUI, 'using':{'l_mode':'FLP'}});
		title('User Launchpad');
		box([0,0], [17,60], "Sales and Distribution");
		image([1,22], 'Logo.jpg');
		pushbutton([4,1], "@0Y@Create Sales Order", "/nva01",{ "size":[2,27]});
		inputfield([6,1],'Order#',[6,15],{'name':'z_va02_order','size':12,'numerical':true,'required':true});
		pushbutton([7,1], "@0Q@Change Sales Order", "/nva02",{ "size":[2,27],"process":va0xEnter});
		pushbutton([9,1], "@13@Search Sales Order", "/nva05",{ "size":[2,27]});
		pushbutton([11,1], "@2V@Inventory Look Up", "/nmmbe",{ "size":[2,27]});
		pushbutton([14,1], "@02@Log Off - &V[_user]", "/nex",{ "size":[2,27]});

		pushbutton([4,33], "@0Y@Create Customer", "/nxd01",{ "size":[2,25]});
		inputfield([6,33],'Delivery#',[6,44],{'name':'z_vl02n_dlv','size':12,'numerical':true,'required':true, 'rf_barcode':true});
		pushbutton([7,33], "@V1@Change Delivery", "/nvl02n",{ "size":[2,25],"process":v102nEnter});
		pushbutton([9,33], "@OV@Material Master Native SAP", "/nmm03",{ "size":[2,25]});

		view([0,62],[22,150],'http://www.guixt.com');
		comment([19,3],'Powered by Liquid UI [Synactive, Inc. (www.guixt.com)]');
		fromMODE = screenMODE;
		break;
}

//**************************************************************************************************//
//Developed By:		Synactive, Inc.																	
//Version: 			1.0																				
//Purpose: 			Deletes all screen elements on SAP Easy Access Screen including toolbar buttons
//Exectued By:		SAPLSMTR_NAVIGATION.E0100.sjs
//					
//**************************************************************************************************//
function deleteElements() {
	del('X[IMAGE_CONTAINER]');
	del('P[/14]');		// Delete Favorites
	del('P[/17]');		// Other menu
	del('P[/18]');		// Other menu
	del('P[/34]');		// User menu
	del('P[/35]');		// SAP menu
	del('P[/36]');		// SAP Business Workplace
	del('P[/37]');		// Move Favorites up
	del('P[/38]');		// Move Favorites down
	del('P[/39]');		// Change Favorites
	del('P[/42]');		// Add to Favorites
	del('P[/45]');		// Assign users
	del('P[/47]');		// Documentation
	del('P[/48]');		// Create role
}
