


//fetching details of functional location
function il03GetFnLocDetails(){ 

	z_il03_displaydetail_flag = true;
	var z_il03_notiflist = 0;
	var z_il03_orderlist = 0;
	var z_il03_itemlist = 0;

	// Display Functional Location: Initial screen
	onscreen 'SAPMILO0.1110'
		set('F[Functional loc.]', '&V[z_il03_fnlocno]');
		enter();
		onerror
			z_il03_displaydetail_flag = false;
			message(_message);
			enter("/n");

	// Display Functional Location: Master data
	onscreen 'SAPMILO0.2100'
		set("V[z_il03_catdesc]","&F[IFLO-PLTXT]");
		set("V[z_il03_type]","&F[ITOB-EQART]");
		set("V[z_il03_manuf]","&F[ITOB-HERST]");
		set("V[z_il03_systemstatus]","&F[RILO0-STTXT]");
		set("V[z_il03_usrstatus]","&F[RILO0-STTXU]");
		enter('=T\\02');

	// Display Functional Location: Master data
	onscreen 'SAPMILO0.2100'
		set("V[z_il03_mntplnt]","&F[ITOB-SWERK]");
		set("V[z_il03_prdnwrkcntr]","&F[ITOBATTR-ARBPL]");
		enter('=T\\04');
		
	// Display Functional Location: Master data
	onscreen 'SAPMILO0.2100'
		set("V[z_il03_supfnloc]","&F[ITOB-TPLMA]");
		z_il03_notif_maxrows = 0;
		z_il03_order_maxrows = 0;
		z_il03_item_maxrows = 0;
		enter('/34');
		
	onscreen "SAPMSDYP.0010"
		enter();

	// Display Functional Location: Master data
	onscreen 'SAPLIWO1.2100'
		enter('=R_ME');

	// Display Notifications: Selection of Notifications
	onscreen 'RIQMEL20.1000'
		set('F[Notification date]', '&V[z_il03_fromdate]');
		set('F[DATUB]','&V[z_il03_todate]');
		enter('/8');
		onerror
			z_il03_displaydetail_flag = false;
			message(_message);
			enter("/n");

	// Display Notifications: List of Notifications
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/5');  //All the notifications within the grid get selected 

	// Display Notifications: List of Notifications
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/37');  

	// Display PM Notification: Maintenance request
FETCHNOTIF:;		
	onscreen 'SAPLIQS0.7200'
		z_il03_notiflist++;
		set("V[z_il03_notif_&V[z_il03_notiflist]]", "&F[VIQMEL-QMNUM]");
		set("V[z_il03_notifdesc_&V[z_il03_notiflist]]", "&F[VIQMEL-QMTXT]");
		set("V[z_il03_notif_status_&V[z_il03_notiflist]]", "&F[RIWO00-STTXT]");
		enter('/3');
		goto FETCHNOTIF;

	// Display Notifications: List of Notifications
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/3');

	// Display Notifications: Selection of Notifications
	onscreen 'RIQMEL20.1000'
		z_il03_notif_maxrows = z_il03_notiflist;
		
		if(z_il03_notif_endrow > z_il03_notif_maxrows)
			z_il03_notif_endrow = z_il03_notif_maxrows;
		enter('/3');

	// Display Functional Location: Master data
	onscreen 'SAPLIWO1.2100'
		enter('=R_AU');

	// Display PM orders: Selection of Orders
	onscreen 'RIAUFK20.1000'
		set('F[Period]', '&V[z_il03_fromdate]');
		set('F[DATUB]','&V[z_il03_todate]');
		enter('/8');
		onerror
			z_il03_displaydetail_flag = false;
			message(_message);
			enter("/n");

	// Display Notifications: List of Notifications
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/5');  //All the notifications within the grid get selected 

	// Display PM orders: List of Orders
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/37');

	// Display Maintenance Order 816943: Central Header
FETCHORDER:;                    //logic to fetch order numbers and respective details by looping		
	onscreen 'SAPLCOIH.3000'
		z_il03_orderlist++;
		set("V[z_il03_order_&V[z_il03_orderlist]]","&F[CAUFVD-AUFNR.2]");
		set("V[z_il03_ordertype_&V[z_il03_orderlist]]","&F[CAUFVD-AUART]");
		set("V[z_il03_orderdesc_&V[z_il03_orderlist]]","&F[CAUFVD-KTEXT]");
		set("V[z_il03_order_status_&V[z_il03_orderlist]]","&F[CAUFVD-STTXT]");
		enter('/3');
		goto FETCHORDER;

	// Display PM orders: List of Orders
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/3');

	// Display PM orders: Selection of Orders
	onscreen 'RIAUFK20.1000'
		z_il03_order_maxrows = z_il03_orderlist;
		
		if(z_il03_order_endrow > z_il03_order_maxrows)
			z_il03_order_endrow = z_il03_order_maxrows;
		
		enter('/3');

	// Display Functional Location: Master data
	onscreen 'SAPLIWO1.2100'
		enter('/7');
		
	// Display Maintenance Item: Maintenance Item List
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/5');  //All the notifications within the grid get selected 

	// Display Maintenance Item: Maintenance Item List
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/37');

	// Display Maintenance Item: Maintenance item 0000000000000730
FETCHITEM:;             //logic to fetch maintenance items numbers and respective details by looping		
	 onscreen 'SAPLIWP3.0201'
		z_il03_itemlist = z_il03_itemlist+1;
		set("V[z_il03_item_&V[z_il03_itemlist]]","&F[RMIPM-WAPOS]");
		set("V[z_il03_itemdesc_&V[z_il03_itemlist]]","&F[RMIPM-PSTXT]");
		enter('/3');
		goto FETCHITEM;

	// Display Maintenance Item: Maintenance Item List
	onscreen 'SAPLSLVC_FULLSCREEN.0500'
		enter('/3');

	// Display Functional Location: Master data
	onscreen 'SAPLIWO1.2100'
		z_il03_item_maxrows = z_il03_itemlist;
		
		if(z_il03_item_endrow > z_il03_item_maxrows)
			z_il03_item_endrow = z_il03_item_maxrows;
		
		enter();
		
	onscreen 'SAPMILO0.2100'
		enter('/n');
}

	
// clears all the variable value
function il03Back(){                    
	set("V[z_il03_*]","");
	z_il03_displaydetail_flag = false;
}


//navigates to notification details screen
function il03DisplayNotificationDetails(param){       
	set("V[z_il03_notifnumber]",param.notif);
	z_il03_return_flag = true;
		
	onscreen 'SAPLSMTR_NAVIGATION.0100'
		enter('/nil03');

	// Display Functional Location: Initial screen
	onscreen 'SAPMILO0.1110'
		set('F[Functional loc.]', '&V[z_il03_fnlocno]');
		enter();
		onerror
			z_il03_return_flag = false;
			message(_message);
			enter("/n");

	onscreen 'SAPMILO0.2100'
		enter('/34');

	onscreen 'SAPLIWO1.2100'
		enter('=R_ME');

	onscreen 'RIQMEL20.1000'
		set('F[Notification date]', '');
		set('F[QMNUM-LOW]', '&V[z_il03_notifnumber]');
		enter('/8');
		onerror
			z_il03_return_flag = false;
			message(_message);
			enter("/n");
}


//navigates to order details screen
function il03DisplayOrderDetails(param){             
	set("V[z_il03_ordernumber]",param.order);
	z_il03_return_flag = true;
	
	onscreen 'SAPLSMTR_NAVIGATION.0100'
		enter('/nil03');

	// Display Functional Location: Initial screen
	onscreen 'SAPMILO0.1110'
		set('F[Functional loc.]', '&V[z_il03_fnlocno]');
		enter();
		onerror
			z_il03_return_flag = false;
			message(_message);
			enter("/n");

	 onscreen 'SAPMILO0.2100'
		enter('/34');

	 onscreen 'SAPLIWO1.2100'
		enter('=R_AU');

	 onscreen 'RIAUFK20.1000'
		set('F[Period]', '');
		set('F[AUFNR-LOW]', '&V[z_il03_ordernumber]');
		enter('/8');
		onerror
			z_il03_return_flag = false;
			message(_message);
			enter("/n");
}


// to load next page of Maintenance notification numbers
function il03NextNotif(){                    
	z_il03_notif_endrow = z_il03_notif_endrow + z_il03_rowsperpage;
	z_il03_notif_startrow = z_il03_notif_startrow + z_il03_rowsperpage;
	z_il03_notif_pageno++;
	
	if(z_il03_notif_endrow > z_il03_notif_maxrows){
		z_il03_notif_endrow = z_il03_notif_maxrows;
	}
}


// to load previous page of Maintenance notification numbers
function il03PreviousNotif(){               
	z_il03_notif_endrow = z_il03_notif_endrow - z_il03_rowsperpage;
	z_il03_notif_startrow = z_il03_notif_startrow - z_il03_rowsperpage;
	z_il03_notif_pageno--;
	
	if(z_il03_notif_startrow < 1){
		z_il03_notif_startrow = 1;
	}
	if(z_il03_notif_endrow < z_il03_rowsperpage){
		z_il03_notif_endrow = z_il03_rowsperpage;
	}
}


// to load next page of Maintenance order numbers
function il03NextOrder(){                  
	z_il03_order_endrow = z_il03_order_endrow + z_il03_rowsperpage;
	z_il03_order_startrow = z_il03_order_startrow + z_il03_rowsperpage;
	z_il03_order_pageno++;
	
	if(z_il03_order_endrow > z_il03_order_maxrows){
		z_il03_order_endrow = z_il03_order_maxrows;
	}
}


// to load previous page of Maintenance order numbers
function il03PreviousOrder(){             
	z_il03_order_endrow = z_il03_order_endrow - z_il03_rowsperpage;
	z_il03_order_startrow = z_il03_order_startrow - z_il03_rowsperpage;
	z_il03_order_pageno--;
	
	if(z_il03_order_startrow < 1){
		z_il03_order_startrow = 1;
	}
	if(z_il03_order_endrow < z_il03_rowsperpage){
		z_il03_order_endrow = z_il03_rowsperpage;
	}
}


// to load next page of Maintenance item numbers
function il03NextItem(){                  
	z_il03_item_endrow = z_il03_item_endrow + z_il03_rowsperpage;
	z_il03_item_startrow = z_il03_item_startrow + z_il03_rowsperpage;
	z_il03_pageno_itembox++;
	
	if(z_il03_item_endrow > z_il03_item_maxrows){
		z_il03_item_endrow = z_il03_item_maxrows;
	}
}


// to load previous page of Maintenance item numbers
function il03PreviousItem(){             
	z_il03_item_endrow = z_il03_item_endrow - z_il03_rowsperpage;
	z_il03_item_startrow = z_il03_item_startrow - z_il03_rowsperpage;
	z_il03_pageno_itembox--;
	
	if(z_il03_item_startrow < 1){
		z_il03_item_startrow = 1;
	}
	if(z_il03_item_endrow < z_il03_rowsperpage){
		z_il03_item_endrow = z_il03_rowsperpage;
	}
}


//clears value of variable 'z_il03_return_flag'
function il03ClearFlag(){
	z_il03_return_flag = false;
}

