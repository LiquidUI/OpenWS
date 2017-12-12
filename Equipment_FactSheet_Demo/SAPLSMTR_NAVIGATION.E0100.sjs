

if(isBlank(z_ie03_rowsperpage)){   //setting variables with initial values
	z_ie03_notif_startrow = 1;
	z_ie03_order_startrow = 1;
	z_ie03_item_startrow = 1;
	
	z_ie03_rowsperpage = 4;
	
	z_ie03_notif_endrow = z_ie03_rowsperpage;
	z_ie03_order_endrow = z_ie03_rowsperpage;
	z_ie03_item_endrow = z_ie03_rowsperpage;
	
	z_ie03_notif_pageno = 1;
	z_ie03_order_pageno = 1;
	z_ie03_item_pageno = 1;
}

del("P[User menu]");   //deleting toolbar,menu and image from easy access screen 
del("P[SAP menu]");
del("P[SAP Business Workplace]");
del("P[Other menu]");
del("P[Add to Favorites]");
del("P[Delete Favorites]");
del("P[Change Favorites]");
del("P[Move Favorites down]");
del("P[Move Favorites up]");
del("P[Create role]");
del("P[Assign users]");
del("P[Documentation]");
del("X[IMAGE_CONTAINER]");

if(! z_ie03_change_display){                      //initial display to enter eqipment number of which details are fetched 
	title("Equipment Fact sheet Initial Screen");
	box([0,0], [13,52], "");
	inputfield([2,2], "Equip. number", [2,21],{"name":"z_ie03_eqipno", "size":26, "searchhelp":"EQUI", "required":true});
	
	box([5,2], [9,50], "Filter by");
	inputfield([7,6], "Date", [7,15], {"name":"z_ie03_fromdate", "size":10, "date":true, "techname":"DATUV"});
	inputfield([7,27], "to", [7,35], {"name":"z_ie03_todate", "size":10, "date":true, "techname":"DATUB"});
	
	pushbutton([11,16], "@10@View Details", "/nIE03", {"process":ie03GetEqipDetails, "size":[2,27]});
	onUIEvents["Enter"] = {"fcode":"/nie03", "process":ie03GetEqipDetails};
}
else{                                              // display with details of equipment
	title("Equipment Fact sheet Details Screen");
	pushbutton([TOOLBAR], "@0D@Back", {"fcode":"/n", "process":ie03Back});
	onUIEvents["/15"] = {"process":ie03Back};
	
	text([1,1], "Equipment");
	text([1,45], "System Status");
	text([1,80], "User Status");
	
	comment([2,1], "&V[z_ie03_eqipno]");
	comment([2,45], "&V[z_ie03_systemstatus]");
	comment([2,80], "&V[z_ie03_usrstatus]");
	
	text([3,1], "&V[z_ie03_eqipdesc]", {"size":44});
	
	box([5,0], [14,50], "General Information");
	
	text([7,2], "Catagory Description");
	text([7,20], ":   &V[z_ie03_catagory]");
	
	text([8,2], "Type");
	text([8,20], ":   &V[z_ie03_type]");
	
	text([9,2], "Manufacturer");
	text([9,20], ":   &V[z_ie03_manufacturer]");
	
	text([10,2], "Functional Location");
	text([10,20], ":   &V[z_ie03_funcloc]");
	
	text([11,2], "Superord.Equip.");
	text([11,20], ":   &V[z_ie03_supeqp]");
	
	text([12,2], "System Status");
	text([12,20], ":   &V[z_ie03_systemstatus]");
	
	text([13,2], "User Status");
	text([13,20], ":   &V[z_ie03_usrstatus]");
	
	box([5,52], [14,130], "Maintenance Notification ("+z_ie03_notif_maxrows+")");
	if(z_ie03_notif_maxrows > 0){
		z_ie03_notif_totalpages = Math.ceil(z_ie03_notif_maxrows / z_ie03_rowsperpage);
		
		if(z_ie03_notif_pageno == 1){
			if(z_ie03_notif_totalpages > 1){
				pushbutton([6,120], "@0E@Next", "?", {"process":ie03NextNotif, "size":[1,8]});
			}
		}
		else if(z_ie03_notif_pageno > 1){
			if(z_ie03_notif_pageno >= z_ie03_notif_totalpages){
				pushbutton([6,110], "@0D@Prev", "?", {"process":ie03PreviousNotif, "size":[1,8]});
			}			
			else{
				pushbutton([6,110], "@0D@Prev", "?", {"process":ie03PreviousNotif, "size":[1,8]});
				pushbutton([6,120], "@0E@Next", "?", {"process":ie03NextNotif, "size":[1,8]});
			}
		}
		
		text([6,54], "Notification");
		text([6,66], "Description");
		text([6,100], "Status");

		for(notifIdxi=z_ie03_notif_startrow, notifIdxj=0; notifIdxi<=z_ie03_notif_endrow; notifIdxi++, notifIdxj++){
			pushbutton([7+notifIdxj*2,54], "&V[z_ie03_notif_&V[notifIdxi]]", "/nie03", {"process":ie03DisplayNotificationDetails, "using":{"notif":eval("z_ie03_notif_"+notifIdxi)}, "size":[1,10]});
			comment([7+notifIdxj*2,66], "&V[z_ie03_notifdesc_&V[notifIdxi]]", {"size":24});
			text([7+notifIdxj*2,100], "&V[z_ie03_notif_status_&V[notifIdxi]]", {"size":24});
		}
	}
	
	
	box([15,0], [24,50], "Maintenance Items ("+z_ie03_item_maxrows+")");
	if(z_ie03_item_maxrows>0){
		z_ie03_item_totalpages = Math.ceil(z_ie03_item_maxrows / z_ie03_rowsperpage);
		
		if(z_ie03_item_pageno == 1){
			if(z_ie03_item_totalpages > 1){
				pushbutton([16,50], "@0E@Next", "?", {"process":ie03NextItem, "size":[1,8]});
			}
		}
		else if(z_ie03_item_pageno > 1){
			if(z_ie03_item_pageno >= z_ie03_item_totalpages){
				pushbutton([16,40], "@0D@Prev", "?", {"process":ie03PreviousItem, "size":[1,8]});
			}			
			else{
				pushbutton([16,30], "@0D@Prev", "?", {"process":ie03PreviousItem, "size":[1,8]});
				pushbutton([16,40], "@0E@Next", "?", {"process":ie03NextItem, "size":[1,8]});
			}
		}
		
		text([16,2], "Item");
		text([16,22], "Description");
		
		for(itemIDXi=z_ie03_item_startrow, itemIDXj=0; itemIDXi<=z_ie03_item_endrow; itemIDXi++, itemIDXj++){
			text([17+itemIDXj*2,2], "&V[z_ie03_item_&V[itemIDXi]]", {"size":18});
			comment([17+itemIDXj*2,22], "&V[z_ie03_itemdesc_&V[itemIDXi]]", {"size":30});
		}
	}
	
	
	box([15,52], [24,130], "Maintenance Orders ("+z_ie03_order_maxrows+")");
	if(z_ie03_order_maxrows>0){
		z_ie03_order_totalpages = Math.ceil(z_ie03_order_maxrows / z_ie03_rowsperpage);
			
		if(z_ie03_order_pageno == 1){
			if(z_ie03_order_totalpages > 1){
				pushbutton([16,120], "@0E@Next", "?", {"process":ie03NextOrder, "size":[1,8]});
			}
		}
		else if(z_ie03_order_pageno > 1){
			if(z_ie03_order_pageno >= z_ie03_order_totalpages){
				pushbutton([16,110], "@0D@Prev", "?", {"process":ie03PreviousOrder, "size":[1,8]});
			}			
			else{
				pushbutton([16,110], "@0D@Prev", "?", {"process":ie03PreviousOrder, "size":[1,8]});
				pushbutton([16,120], "@0E@Next", "?", {"process":ie03NextOrder, "size":[1,8]});
			}
		}

		text([16,54], "Order");
		text([16,66], "Description");
		text([16,100], "Status");
		
		for(orderIdxi=z_ie03_order_startrow, orderIdxj = 0; orderIdxi<=z_ie03_order_endrow; orderIdxi++, orderIdxj++){
			set("V[z_ie03_tempparamorder]","&V[z_ie03_order_&V[orderIdxi]]");
			pushbutton([17+orderIdxj*2,54], "&V[z_ie03_order_&V[orderIdxi]]", "/nie03", {"process":ie03DisplayOrderDetails, "using":{"order":z_ie03_tempparamorder}, "size":[1,10]});
			comment([17+orderIdxj*2,66], "&V[z_ie03_orderdesc_&V[orderIdxi]]", {"size":24});
			text([17+orderIdxj*2,100], "&V[z_ie03_order_status_&V[orderIdxi]]", {"size":24});
		}
	}
	
	

}












