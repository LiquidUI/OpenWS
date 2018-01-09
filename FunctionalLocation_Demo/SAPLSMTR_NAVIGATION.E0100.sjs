


if(isBlank(z_il03_rowsperpage)){  //initially setting variables with default values
	z_il03_notif_startrow = 1;
	z_il03_order_startrow = 1;
	z_il03_item_startrow = 1;
	
	z_il03_rowsperpage = 4;
	
	z_il03_notif_endrow = z_il03_rowsperpage;
	z_il03_order_endrow = z_il03_rowsperpage;
	z_il03_item_endrow = z_il03_rowsperpage;
	
	z_ie03_notif_pageno = 1;
	z_ie03_order_pageno = 1;
	z_ie03_item_pageno = 1;    
}


del("P[User menu]"); //deleting controls on easy access screen
del("P[SAP menu]");
del("P[SAP Business Workplace]");
del("P[Display role menu]");
del("P[Add to Favorites]");
del("P[Create role]");
del("P[Assign users]");
del("P[Documentation]");
del("X[Image_container]");
del("P[Delete Favorites]");
del("P[Change Favorites]");
del("P[Move Favorites down]");
del("P[Move Favorites up]");


if(!z_il03_displaydetail_flag){  // initial screen to enter functional location using date range filteration
	title("Functional Location Fact Sheet Initial Screen");
	box([0,0], [13,52], "");
    inputfield([2,2], "Functional Location", [2,25], {"name":"z_il03_fnlocno", "searchhelp":"IFLM", "required":true, "size":26});
	box([5,2], [9,50], "Filter by");
	inputfield([7,6], "Date", [7,12], {"name":"z_il03_fromdate", "date":true, "techname":"DATUV", "size":10});
	inputfield([7,27], "to", [7,35], {"name":"z_il03_todate", "date":true, "techname":"DATUB", "size":10});
	pushbutton([11,12], "@10@View Details", "/nil03", {"process":il03GetFnLocDetails,"size":[2,29]});
	onUIEvents["Enter"] = {"fcode":"/nil03", "process":il03GetFnLocDetails};
}
else{  // next screen displaying details of chosen functional location
	title( "Functional Local Fact Sheet Details Screen");
	pushbutton([TOOLBAR],"@0D@Back", "?", {"process":il03Back});
	onUIEvents["/15"] = {"fcode":"?", "process":il03Back};
	
	text([1,0], "Functional Location");
	comment([2,0],"&V[z_il03_fnlocno]");
	text([3,0],"&V[z_il03_catdesc]");
	
	text([1,45], "System Status");
	comment([2,45], "&V[z_il03_systemstatus]");
    
	text([1,80], "User Status");
	comment([2,80], "&V[z_il03_usrstatus]");
	
	text([1,110], "Created");
	comment([2,110],"&V[z_il03_crtd]");
	
	
	box([5,0], [14,50], "General Information");
	text([7,2], "Category Description", {"size":33});
	text([7,20], ":    &V[z_il03_catdesc]", {"size":32});
	
	text([8,2], "Type", {"size":33});
	text([8,20], ":    &V[z_il03_type]", {"size":32});
	
	text([9,2], "Manufacturer", {"size":33});
	text([9,20], ":    &V[z_il03_manuf]", {"size":32});
	
	text([10,2], "Superior Func. Loc.", {"size":33});
	text([10,20], ":    &V[z_il03_supfnloc]", {"size":32});
	
	text([11,2], "Maintenance Plant", {"size":33});
	text([11,20], ":    &V[z_il03_mntplnt]", {"size":32});
	
	text([12,2], "Production Wrk. Ctr.", {"size":33});
	text([12,20], ":    &V[z_il03_prdnwrkcntr]", {"size":32});
	
	box([5,52], [14,130], "Maintenance Notifications ("+z_il03_notif_maxrows+")");
	if(z_il03_notif_maxrows > 0){
		z_il03_notif_totalpages = Math.ceil(z_il03_notif_maxrows / z_il03_rowsperpage);
			
		if(z_il03_notif_pageno == 1){
			if(z_il03_notif_totalpages > 1){
				pushbutton([6,120], "@0E@Next", "?", {"process":il03NextNotif, "size":[1,8]});
			}
		}
		else if(z_il03_notif_pageno > 1){
			if(z_il03_notif_pageno >= z_il03_notif_totalpages){
				pushbutton([6,110], "@0D@Prev", "?", {"process":il03PreviousNotif, "size":[1,8]});
			}			
			else{
				pushbutton([6,110], "@0D@Prev", "?", {"process":il03PreviousNotif, "size":[1,8]});
				pushbutton([6,120], "@0E@Next", "?", {"process":il03NextNotif, "size":[1,8]});
			}
		}
		
		text([6,54], "Notification");
		text([6,66], "Description");
		text([6,100], "Status");
		
		for(notifIdxi=z_il03_notif_startrow, notifIdxj=0; notifIdxi<=z_il03_notif_endrow; notifIdxi++, notifIdxj++){
			set("V[z_il03_tempparamnotif]","&V[z_il03_notif_&V[notifIdxi]]");
			pushbutton([7+notifIdxj*2,54], "&V[z_il03_notif_&V[notifIdxi]]", "?", {"process":il03DisplayNotificationDetails, "using":{"notif":eval("z_il03_notif_"+notifIdxi)}, "size":[1,10]});
			comment([7+notifIdxj*2,66], "&V[z_il03_notifdesc_&V[notifIdxi]]", {"size":24});
			text([7+notifIdxj*2,100], "&V[z_il03_notif_status_&V[notifIdxi]]", {"size":24});
		}
}
	
	box([15,0], [25,50], "Maintenance Items ("+z_il03_item_maxrows+")");
	if(z_il03_item_maxrows > 0){
		z_il03_item_totalpages = Math.ceil(z_il03_item_maxrows / z_il03_rowsperpage);
			
		if(z_il03_item_pageno == 1){
			if(z_il03_item_totalpages > 1){
				pushbutton([16,120], "@0E@Next", "?", {"process":il03NextItem, "size":[1,8]});
			}
		}
		else if(z_il03_item_pageno > 1){
			if(z_il03_item_pageno >= z_il03_item_totalpages){
				pushbutton([16,110], "@0D@Prev", "?", {"process":il03PreviousItem, "size":[1,8]});
			}			
			else{
				pushbutton([16,110], "@0D@Prev", "?", {"process":il03PreviousItem, "size":[1,8]});
				pushbutton([16,120], "@0E@Next", "?", {"process":il03NextItem, "size":[1,8]});
			}
		}
		
		text([16,2], "Item");
		text([16,22], "Description");
		
		for(itemIdxi=z_il03_item_startrow, itemIdxj=0; itemIdxi<=z_il03_item_endrow; itemIdxi++, itemIdxj++){
			text([17+itemIdxj*2,2], "&V[z_il03_item_&V[itemIdxi]]", {"size":19});
			text([17+itemIdxj*2,22], "&V[z_il03_itemdesc_&V[itemIdxi]]", {"size":35});
		}
	}
	
	box([15,52], [25,130], "Maintenance Orders ("+z_il03_order_maxrows+")");
	if(z_il03_order_maxrows > 0){
		z_il03_order_totalpages = Math.ceil(z_il03_order_maxrows / z_il03_rowsperpage);
			
		if(z_il03_order_pageno == 1){
			if(z_il03_order_totalpages > 1){
				pushbutton([16,120], "@0E@Next", "?", {"process":il03NextOrder, "size":[1,8]});
			}
		}
		else if(z_il03_order_pageno > 1){
			if(z_il03_order_pageno >= z_il03_order_totalpages){
				pushbutton([16,110], "@0D@Prev", "?", {"process":il03PreviousOrder, "size":[1,8]});
			}			
			else{
				pushbutton([16,110], "@0D@Prev", "?", {"process":il03PreviousOrder, "size":[1,8]});
				pushbutton([16,120], "@0E@Next", "?", {"process":il03NextOrder, "size":[1,8]});
			}
		}
		
		text([16,54], "Order");
		text([16,66], "Description");
		text([16,100], "Status");
		
		for(orderIdxi=z_il03_order_startrow, orderIdxj=0; orderIdxi<=z_il03_order_endrow; orderIdxi++, orderIdxj++){
			pushbutton([17+orderIdxj*2,54], "&V[z_il03_order_&V[orderIdxi]]", "?", {"process":il03DisplayOrderDetails, "using":{"order":eval("z_il03_order_"+orderIdxi)}, "size":[1,10]});
			comment([17+orderIdxj*2,66], "&V[z_il03_orderdesc_&V[orderIdxi]]", {"size":24});
			text([17+orderIdxj*2,100], "&V[z_il03_order_status_&V[orderIdxi]]", {"size":24});
		}
	}
}











