if(_transaction == 'VA01' || _transaction == 'VA02') {
	
	del('P[/34]'); 
	del('P[/35]'); 
	del('P[/45]'); 
	del('P[/7]'); 
	del('P[/19]'); // Display Sales Summary
	del('P[/6]');	//Display Sold to party
	del('P[/37]');	//Header output preview
	del('P[/39]');	//Loading Units
	del('P[/5]');	//document flow
	del('P[/36]');	//order status

	del('P[T\\03]');
	del('P[T\\04]');
	del('P[T\\05]');
	del('P[T\\06]');
	
	pushbutton([TOOLBAR],"@01@Document Status",'/32');

	if(_transaction == 'VA01'){
		pushbutton([TOOLBAR],"@2M@Back",'/nva01',{'process':blockUnrequired});
	}

	if(_transaction == 'VA02'){
		pushbutton([TOOLBAR],"@2M@Back",'/n',{'process':blockUnrequired});
		pushbutton([TOOLBAR],"@90@Document Flow",'/5');
		pushbutton([TOOLBAR],"@F9@Order Status",'/36');
	}
	
	if(_page.exists('Sales') || _page.exists('Item overview'))
		allItemsUI();
	
	if(<'F[RV45A-TXT_VBELN]'>.isValid)
		del('F[RV45A-TXT_VBELN]',{"triple":true});	//Standard Order
		
	
	pos('F[KUAGV-KUNNR]','F[RV45A-TXT_VBELN]+[0,1]',{'triple':true}); //Sold to
	pos('F[KUWEV-KUNNR]','F[RV45A-TXT_VBELN]+[1,1]',{'triple':true});//Ship to
	pos('F[VBKD-BSTKD]','F[RV45A-TXT_VBELN]+[2,1]');	//PO Number
	pos('F[VBKD-BSTDK]','F[RV45A-TXT_VBELN]+[3,1]');	//PO Date text
	pos('F[VBKD-BSTDK]','F[RV45A-TXT_VBELN]+[3,18]',{'value':true});	//PO Date value

	pos('F[VBAK-NETWR]', 'F[RV45A-TXT_VBELN]+[0,132]',{'value':true});	// Net value 
	pos('F[VBAK-NETWR]', 'F[RV45A-TXT_VBELN]+[0,115]',{'text':true});	// Net Value text
	pos('F[VBAK-WAERK]', 'F[RV45A-TXT_VBELN]+[0,154]');					// Net Value description

	del('P[BT_HEAD]');		// Header push button
	del('P[BT_IAAN]');		// Create Sold-to Party push button
	
	pushbutton('F[RV45A-TXT_VBELN]+[0,82]','@6C@Sales Details','KKAU',{"size":[1,27]});
	pushbutton('F[RV45A-TXT_VBELN]+[1,82]','@FD@Pricing Information','KKO1',{"size":[1,27]});
	pushbutton('F[RV45A-TXT_VBELN]+[2,82]','@F8@Partners Details','KPAR_SUB',{"size":[1,27]});
	pushbutton('F[RV45A-TXT_VBELN]+[3,82]','@0Q@Internal Order Comments','KTEX_SUB',{"size":[1,27]});
	
	inputfield('F[RV45A-TXT_VBELN]+[1,115]',"Tax",'F[RV45A-TXT_VBELN]+[1,132]',{'name':'z_vaxx_tax',"size":20,"readonly":true});
	inputfield('F[RV45A-TXT_VBELN]+[2,115]',"Total",'F[RV45A-TXT_VBELN]+[2,132]',{'name':'z_vaxx_total',"size":20,"readonly":true});
	inputfield('F[RV45A-TXT_VBELN]+[3,115]',"Price List",'F[RV45A-TXT_VBELN]+[3,132]',{"size":2,"name":'z_va01_price_list',"searchhelp":'H_T189'});

	//Modifications in Sales Tab
	if(_page.exists('Sales')) {
		noscrollbar({'removeall':true});
		del('F[RV45A-BTGEW]',{"triple":true}); //Total Weight
		del('F[RV45A-VOLUM]',{"triple":true}); //Total Volume
		del('F[CCDATA-CCINS]',{"triple":true}); //Payment card
		del('F[VBKD-ZTERM]',{"triple":true}); //Payment Terms
		del('F[CCARD_CVV-CVVAL]',{"triple":true}); //Card. Verfication Values
		del('F[VBAK-LIFSK]'); //Delivery block
		del('F[VBAK-FAKSK]'); //Billing block
		del('F[CCDATA-CCNUM]'); //Card Number
		del('C[VBAK-AUTLF]'); //Complete dlv.
		del('F[RV45A-DWERK]',{"triple":true}); //Deliver Plant
		del('F[VBKD-PRSDT]'); //Pricing Date
		del('F[CCDATA-DATBI]'); //EXP. date
		
		del('P[BT_ITEM]');	//display item detail
		del('P[BT_POAN]');	//create item
		del('P[BT_POLO]');	//Delete item
		del('P[BT_POPO]');	//Position item
		del('P[BT_MKLO]');	//Deselect item
		del('P[BT_MKAL]');	//Select item
		del('P[BT_PORE]');	//Check item availability
		del('P[BT_IVFP]');	//Display availability
		del('P[BT_PEIN]');	//Schedule line for item
		del('P[BT_PKON]');	//Item conditions
		del('P[BT_CHFD]');	//Item batch deter
		del('P[BT_POCO]');	//Item batch Configuration 
		del('P[BT_CRLT]');	//APO Delivery GRP Correlation
		
		pos('F[VBKD-INCO1]', 'F[RV45A-KETDAT]+[1,0]');	//Incoterms
		pos('F[VBKD-INCO2]', 'F[RV45A-KETDAT]+[1,20]');	//Incoterms 2
		pos('F[VBAK-AUGRU]', 'F[RV45A-KETDAT]+[2,0]');	//Order reason
		pos('F[RV45A-TXT_VTRBER]', 'F[RV45A-KETDAT]+[3,0]',{"triple":true});	//Sales area
		pos('F[SLASH1]', 'F[RV45A-KETDAT]+[3,21]',{"triple":true});	//Sales area
		pos('F[SLASH2]', 'F[RV45A-KETDAT]+[3,26]',{"triple":true});	//Sales area
		
		inputfield('F[RV45A-KETDAT]+[5,0]',"Overall Order Status",'F[RV45A-KETDAT]+[5,22]',{"name":'z_vaxx_overallStatus',"size":20,"readonly":true});
		inputfield('F[RV45A-KETDAT]+[6,0]',"Rejection Status ",'F[RV45A-KETDAT]+[6,22]',{"name":'z_vaxx_rejectionStatus',"size":20,"readonly":true});
		inputfield('F[RV45A-KETDAT]+[7,0]',"Delivery Status",'F[RV45A-KETDAT]+[7,22]',{"name":'z_vaxx_deliveryStatus',"size":20,"readonly":true});
		inputfield('F[RV45A-KETDAT]+[8,0]',"Credit Status",'F[RV45A-KETDAT]+[8,22]',{"name":'z_vaxx_creditStatus',"size":20,"readonly":true});
		pushbutton('F[RV45A-KETDAT]+[6,50]',"@2K@Update Status","?",{"size":[2,20],"process":update_status});
		
		pushbutton('P[BT_ITEM]+[0,0]',"@18@Delete Item","POLO",{"size":[1,20]});
		pushbutton('P[BT_ITEM]+[0,22]',"@FC@Check Item Availability","PORE",{"size":[1,20]});
		pushbutton('P[BT_ITEM]+[0,44]',"@FF@Display Availability","IVFP",{"size":[1,20]});
		pushbutton('P[BT_ITEM]+[0,66]',"@FE@Schedule lines for Item","PEIN",{"size":[1,22]});
		pushbutton('P[BT_ITEM]+[0,90]',"@FD@Conditions","PKO1",{"size":[1,22]});
		pushbutton('P[BT_ITEM]+[0,114]',"@AU@Comments at Item level","PTEX_SUB",{"size":[1,22]});

		columnorder('[All items,Order Quantity]',3);
	}
	
	//Modifications in Item overview
	if(_page.exists('Item overview')) {
		del('P[BT_ITEM]');	//display item detail
		del('P[BT_POAN]');	//create item
		del('P[BT_POLO]');	//Delete item
		del('P[BT_POPO]');	//Position item
		del('P[BT_MKLO]');	//Deselect item
		del('P[BT_MKAL]');	//Select item
		del('P[BT_PORE]');	//Check item availability
		del('P[BT_IVFP]');	//Display availability
		del('P[BT_PEIN]');	//Schedule line for item
		del('P[BT_PKON]');	//Item conditions
		del('P[BT_CHFD]');	//Item batch deter
		del('P[BT_POCO]');	//Item batch Configuration 
		del('P[BT_CRLT]');	//APO Delivery GRP Correlation
		
		pushbutton('P[BT_ITEM]+[0,0]',"@18@Delete Item","POLO",{"size":[1,20]});
		pushbutton('P[BT_ITEM]+[0,22]',"@FC@Check Item Availability","PORE",{"size":[1,20]});
		pushbutton('P[BT_ITEM]+[0,44]',"@FF@Display Availability","IVFP",{"size":[1,20]});
		pushbutton('P[BT_ITEM]+[0,66]',"@FE@Schedule lines for Item","PEIN",{"size":[1,22]});
		pushbutton('P[BT_ITEM]+[0,90]',"@FD@Conditions","PKO1",{"size":[1,22]});
		pushbutton('P[BT_ITEM]+[0,114]',"@AU@Comments at Item level","PTEX_SUB",{"size":[1,22]});
		
	}
	
	//Modifications in Reason for rejection
	if(_page.exists('Reason for rejection')) {
		del('P[BT_ITEM]');	//display item detail
		del('P[BT_POAN]');	//create item
		del('P[BT_POLO]');	//Delete item
		del('P[BT_POPO]');	//Position item
		del('P[BT_MKLO]');	//Deselect item
		del('P[BT_MKAL]');	//Select item
		del('P[BT_PORE]');	//Check item availability
		del('P[BT_IVFP]');	//Display availability
		del('P[BT_PEIN]');	//Schedule line for item
		del('P[BT_PKON]');	//Item conditions
		del('P[BT_CHFD]');	//Item batch deter
		del('P[BT_POCO]');	//Item batch Configuration 
		del('P[BT_CRLT]');	//APO Delivery GRP Correlation
	}
	
	del('M[/3]');
	del('M[/15]');
	del('M[/12]');
	
	onUIEvents['/3']={"process":disable};
	onUIEvents['/15']={"process":disable};
	onUIEvents['/12']={"process":disable};
	onUIEvents['/n*']={"process":blockUnrequired}
	if(_transaction =='VA01')
		onUIEvents['/11']={"fcode":'/11',"process":va01Save}
	if(_transaction =='VA02')
		onUIEvents['/11']={"fcode":'/11',"process":va02Save}
}