


//fetches details of equipment  
function ie03GetEqipDetails(){        
	
		z_ie03_change_display = true;
		var z_ie03_notiflist = 0;
		var z_ie03_orderlist = 0;
		var z_ie03_itemlist = 0;

		// Display Equipment : Initial Screen
		onscreen 'SAPMIEQ0.0100'
			set('F[Equipment]', '&V[z_ie03_eqipno]');
			enter();
			onerror
				z_ie03_change_display = false;
				message(_message);
				enter("/n");

		// Display Equipment : General Data
		onscreen 'SAPMIEQ0.0101'
			set("V[z_ie03_eqipdesc]","&F[ITOB-SHTXT]");
			set("V[z_ie03_systemstatus]","&F[ITOBATTR-STTXT]");
			set("V[z_ie03_usrstatus]","&F[ITOBATTR-STTXU]");
			set("V[z_ie03_catagory]","&F[ITOBATTR-TYPTX]");
			set("V[z_ie03_type]","&F[T370K_T-EARTX]");
			set("V[z_ie03_manufacturer]","&F[ITOB-HERST]");
			var z_ie03_noofclick = 0;
			enter('=T\\04');

		// Display Equipment : Structure
		onscreen 'SAPMIEQ0.0101'
			set("V[z_ie03_funcloc]","&F[ITOBATTR-TXT_TPLNR]");
			set("V[z_ie03_supeqp]","&F[ITOBATTR-TXT_HEQUI]");
			enter('/34');

		// Display Equipment : General Data
		onscreen 'SAPLIWO1.2100'
			enter('=R_ME');

		// Display Notifications: Selection of Notifications
		onscreen 'RIQMEL20.1000'
			//set('F[Notification date]', '11/24/2015');
			set('F[Notification date]', '&V[z_ie03_fromdate]');
			set('F[DATUB]','&V[z_ie03_todate]');
			enter('/8');
			onerror
				z_ie03_change_display = false;
				message(_message);
				enter("/n");

		// Display Notifications: List of Notifications
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/5');      //selects all notifications in grid

		// Display Notifications: List of Notifications
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/37');  //navigates to details of first notification

		// Display PM Notification: Maintenance request
FETCHNOTIF:;			//logic to fetch notification numbers and respective details by looping
		onscreen 'SAPLIQS0.7200' 
			z_ie03_notiflist++;
			set("V[z_ie03_notif_&V[z_ie03_notiflist]]","&F[VIQMEL-QMNUM]");
			set("V[z_ie03_notifdesc_&V[z_ie03_notiflist]]","&F[VIQMEL-QMTXT]");
			set("V[z_ie03_notif_status_&V[z_ie03_notiflist]]","&F[RIWO00-STTXT]");
			enter('/3');
			goto FETCHNOTIF;
			
		// Display Notifications: List of Notifications
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/3');

		// Display Notifications: Selection of Notifications
		onscreen 'RIQMEL20.1000'
			z_ie03_notif_maxrows = z_ie03_notiflist;
			
			if(z_il03_notif_endrow > z_il03_notif_maxrows)
				z_il03_notif_endrow = z_il03_notif_maxrows;
			enter('/3');

		// Display Equipment : General Data
		onscreen 'SAPLIWO1.2100'
			enter('=R_AU');

		onscreen 'RIAUFK20.1000'
			//set('F[Period]', '01/01/2012');
			set('F[Period]', '&V[z_ie03_fromdate]');
			set('F[DATUB]','&V[z_ie03_todate]');
			enter('/8');
			onerror
				z_ie03_change_display = false;
				message(_message);
				enter("/n");

		// Display PM orders: List of Orders
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/5');

		// Display PM orders: List of Orders
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/37');

		// Display Maintenance Order 819642: Central Header
FETCHORDER:;                    //logic to fetch order numbers and respective details by looping		
		onscreen 'SAPLCOIH.3000'
			z_ie03_orderlist++;
			set("V[z_ie03_order_&V[z_ie03_orderlist]]","&F[CAUFVD-AUFNR.2]");
			set("V[z_ie03_ordertype_&V[z_ie03_orderlist]]","&F[CAUFVD-AUART]");
			set("V[z_ie03_orderdesc_&V[z_ie03_orderlist]]","&F[CAUFVD-KTEXT]");
			set("V[z_ie03_order_status_&V[z_ie03_orderlist]]","&F[CAUFVD-STTXT]");
			enter('/3');
			goto FETCHORDER;

		// Display PM orders: List of Orders
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/3');

		// Display PM orders: Selection of Orders
		onscreen 'RIAUFK20.1000'
			z_ie03_order_maxrows = z_ie03_orderlist;
			
			if(z_il03_order_endrow > z_il03_order_maxrows)
				z_il03_order_endrow = z_il03_order_maxrows;
			enter('/3');

		// Display Equipment : General Data
		onscreen 'SAPLIWO1.2100'
			enter('/7');

		// Display Maintenance Item: Maintenance Item List
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/5');

		// Display Maintenance Item: Maintenance Item List
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/37');

		// Display Maintenance Item: Maintenance item 0000000000000810
FETCHITEM:;             //logic to fetch maintenance items numbers and respective details by looping		
		onscreen 'SAPLIWP3.0201'
				z_ie03_itemlist++;
				set("V[z_ie03_item_&V[z_ie03_itemlist]]","&F[RMIPM-WAPOS]");
				set("V[z_ie03_itemdesc_&V[z_ie03_itemlist]]","&F[RMIPM-PSTXT]");
				enter('/3');
				goto FETCHITEM;
			
		// Display Maintenance Item: Maintenance Item List
		onscreen 'SAPLSLVC_FULLSCREEN.0500'
			enter('/3');

		// Display Equipment : General Data
		onscreen 'SAPLIWO1.2100'
			z_ie03_item_maxrows = z_ie03_itemlist;
			
			if(z_il03_item_endrow > z_il03_item_maxrows)
				z_il03_item_endrow = z_il03_item_maxrows;
			enter();

		onscreen 'SAPMIEQ0.0101'
			enter('/n');

}


// clears all the variable value
function ie03Back(){                    
		z_ie03_change_display = false;
		set("V[z_ie03_*]","");
}


//navigates to notication details screen
function ie03DisplayNotificationDetails(param){       
		set("V[z_ie03_notifnumber]",param.notif);
		z_ie03_nav_details_flag = true;

		// Display Equipment : Initial Screen
		onscreen 'SAPMIEQ0.0100'
			set('F[Equipment]', '&V[z_ie03_eqipno]');
			enter();
			onerror
				z_ie03_nav_details_flag = false;
				message(_message);
				enter("/n");

		onscreen 'SAPMIEQ0.0101'
			enter('/34');

		onscreen 'SAPLIWO1.2100'
			enter('=R_ME');

		onscreen 'RIQMEL20.1000'
			set('F[Notification date]', '');
			set('F[QMNUM-LOW]', '&V[z_ie03_notifnumber]');
			enter('/8');
			onerror
				z_ie03_nav_details_flag = false;
				message(_message);
				enter("/n");
		
		onscreen 'RIAUFK20.1000'
			z_ie03_nav_details_flag = false;
			message("S:" + _message);
			enter("/n");
}


//navigates to order details screen
function ie03DisplayOrderDetails(param){             
		set("V[z_ie03_ordernumber]",param.order);
		z_ie03_nav_details_flag = true;

		// Display Equipment : Initial Screen
		onscreen 'SAPMIEQ0.0100'
			set('F[Equipment]', '&V[z_ie03_eqipno]');
			enter();
			onerror
				z_ie03_nav_details_flag = false;
				message(_message);
				enter("/n");

		onscreen 'SAPMIEQ0.0101'
			enter('/34');

		onscreen 'SAPLIWO1.2100'
			enter('=R_AU');

		onscreen 'RIAUFK20.1000'
			set('F[Period]', '');
			set('F[AUFNR-LOW]', '&V[z_ie03_ordernumber]');
			enter('/8');
			onerror
				z_ie03_nav_details_flag = false;
				message(_message);
				enter("/n");
				
		onscreen 'RIAUFK20.1000'
			z_ie03_nav_details_flag = false;
			message("S:" + _message);
			enter("/n");
}


// to load next page of notification numbers
function ie03NextNotif(){                    
	z_ie03_notif_endrow = z_ie03_notif_endrow + z_ie03_rowsperpage;
	z_ie03_notif_startrow = z_ie03_notif_startrow + z_ie03_rowsperpage;
	z_ie03_notif_pageno++;
	
	if(z_ie03_notif_endrow > z_ie03_notif_maxrows){
		z_ie03_notif_endrow = z_ie03_notif_maxrows;
	}
}


// to load previous page of notification numbers
function ie03PreviousNotif(){               
	z_ie03_notif_endrow = z_ie03_notif_endrow - z_ie03_rowsperpage;
	z_ie03_notif_startrow = z_ie03_notif_startrow - z_ie03_rowsperpage;
	z_ie03_notif_pageno--;
	
	if(z_ie03_notif_startrow < 1){
		z_ie03_notif_startrow = 1;
	}
	if(z_ie03_notif_endrow < z_ie03_rowsperpage){
		z_ie03_notif_endrow = z_ie03_rowsperpage;
	}
}


// to load next page of order numbers
function ie03NextOrder(){                  
	z_ie03_order_endrow = z_ie03_order_endrow + z_ie03_rowsperpage;
	z_ie03_order_startrow = z_ie03_order_startrow + z_ie03_rowsperpage;
	z_ie03_order_pageno++;
	
	if(z_ie03_order_endrow > z_ie03_order_maxrows){
		z_ie03_order_endrow = z_ie03_order_maxrows;
	}
}


// to load previous page of order numbers
function ie03PreviousOrder(){             
	z_ie03_order_endrow = z_ie03_order_endrow - z_ie03_rowsperpage;
	z_ie03_order_startrow = z_ie03_order_startrow - z_ie03_rowsperpage;
	z_ie03_order_pageno--;
	
	if(z_ie03_order_startrow < 1){
		z_ie03_order_startrow = 1;
	}
	if(z_ie03_order_endrow < z_ie03_rowsperpage){
		z_ie03_order_endrow = z_ie03_rowsperpage;
	}
}


 // to load next page of maintenance item numbers
function ie03NextItem(){                  
	z_ie03_item_endrow = z_ie03_item_endrow + z_ie03_rowsperpage;
	z_ie03_item_startrow = z_ie03_item_startrow + z_ie03_rowsperpage;
	z_ie03_pageno_itembox++;
	
	if(z_ie03_item_endrow > z_ie03_item_maxrows){
		z_ie03_item_endrow = z_ie03_item_maxrows;
	}
}


// to load previous page of maintenance item numbers
function ie03PreviousItem(){             
	z_ie03_item_endrow = z_ie03_item_endrow - z_ie03_rowsperpage;
	z_ie03_item_startrow = z_ie03_item_startrow - z_ie03_rowsperpage;
	z_ie03_pageno_itembox--;
	
	if(z_ie03_item_startrow < 1){
		z_ie03_item_startrow = 1;
	}
	if(z_ie03_item_endrow < z_ie03_rowsperpage){
		z_ie03_item_endrow = z_ie03_rowsperpage;
	}
}


//clears value of variable 'z_ie03_nav_details_flag'
function ie03Clr(){            
	z_ie03_nav_details_flag = false;
}