load("functions_systemgeneric.sjs");
load("functions_goodsreceipts.sjs");


del("X[IMAGE_CONTAINER]");
del('P[/35]'); //SAP menu
del('P[/36]'); //SAP Business Workplace
del('P[/42]'); //Add to Favorites
del('P[@0Z@]');
del('P[@0H@]');
del('P[@0I@]');
del('P[@6C@]');
del('P[@ES@]');
if(<'P[/17]'>.isValid) //Other menu
	del('P[/17]');
if(<'P[/48]'>.isValid) //Create role
	del('P[/48]');
if(<'P[@ID@]'>.isValid) //Assign users
	del('P[@ID@]'); 
if(<'P[@0P@]'>.isValid) //Documentation
	del('P[@0P@]');

if(USER_DEFAULTS != 'X') {
    enter('?', {'process':readUserDefaults});
	USER_DEFAULTS = 'X';
	}
	
z_migo_po_readonly = false;

switch(SHOWSCREEN) {

	case 'DISPLAYMATERIAL':
		pushbutton([TOOLBAR], "@9S@ Back", {'process':toggleUI, 'using':{'l_scrn':''}});
		title("Goods Receipts - Display Materials");
		table([0,0], [12,34], {"name":"migo_lnitems", "title":"GR Materials", "rows":dm_tot, "rowselection":true});
		column('Material', {"table":"migo_lnitems", "size":18, "name":"z_migo_matl", "position":1, "readonly":true});
		column('Description', {"table":"migo_lnitems", "size":18, "name":"z_migo_desc", "position":2, "readonly":true});
		column('Open Qty', {"table":"migo_lnitems", "size":10, "name":"z_migo_opqty", "position":3, "readonly":true});
		column('Ordered Qty', {"table":"migo_lnitems", "size":10, "name":"z_migo_ordqty", "position":4, "readonly":true});
	
		if(z_data_match==true){
			getTableData();
			z_data_match=false;
		}

		break;
	default:
		title("Goods Receipts - Purchase Order");
		pushbutton([TOOLBAR], "@10@View", "/nmigo",{'process':displayMaterial});
		pushbutton([TOOLBAR], "@0Y@New", "?", {'process':newDoc});
		box([0,0], [12,33], "Goods Receipts-PO");
		inputfield( [1,1], "PO Number", [1,18],{ "name":"z_migo_ponum", "size":12, "maxlength":20, "required":true, "readonly":z_migo_po_readonly, "numerical":true, "smartattributes":"rf_autotab=3"});
		inputfield( [2,1], "Material", [2,18],{ "name":"z_migo_matl", "size":10, "maxlength":18, "required":true, "smartattributes":"rf_validate=/2"});	
		inputfield( [3,1], {"name":"z_migo_matdesc", "size":32, "readonly":true, "nolabel":true, "smartattributes":"rf_autotab=1"});
		inputfield( [4,1], "Batch", [4,18],{ "name":"z_migo_batch", "size":10, "maxlength":20, "required":true, "smartattributes":"rf_autotab=3"});
		inputfield( [5,1], "Manuf. Date", [5,18],{ "name":"z_migo_mfgd", "size":10, "maxlength":10, "required":true, "date":true, "numerical":true, "smartattributes":"rf_autotab=3"});
		inputfield( [6,1], "Expiry Date", [6,18],{ "name":"z_migo_expd", "size":10, "maxlength":10, "numerical":true, "smartattributes":"rf_autotab=3"});
		inputfield( [7,1], "Quantity", [7,18],{ "name":"z_migo_qnty", "size":6, "maxlength":6, "numerical":true, "required":true, "smartattributes":"rf_autotab=3"});
		inputfield( [8,1], "Stor. Loc.", [8,18],{ "name":"z_migo_stloc", "size":4, "maxlength":4, "required":true, "smartattributes":"rf_autotab=3"});
		inputfield( [9,1], "Header Text", [9,18],{ "name":"z_migo_htxt", "size":13, "maxlength":50});
		pushbutton([10,1], "@2L@Post", "/nmigo", {'process':postDoc, "size":[2,32]});
		onUIEvents['Enter@[2,18]']={"fcode":"/nmm03", 'process':migopoMaterialDesc};
		onUIEvents['/2']={"fcode":"/nmm03", 'process':migopoMaterialDesc};

		if(!isBlank(cursorPosition)) {
			setcursor(cursorPosition);
			cursorPosition = '';
		} else{
			setcursor('V[z_migo_ponum]');
		}
		break;
	}
