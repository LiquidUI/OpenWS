function toggleUI(param) {
	set('V[SHOWSCREEN]',param.l_scrn);
	return;
}

// Purpose: Displays Material Description
// Where Used:Goods Receipt-Purchase Order
// (rapid_WM_materials_all_MIGOpurchaseorder.sjs)
// When Used: Upon entering the material on the screen, or when tabbing out of the field
function migopoMaterialDesc(){
	z_migo_error = '';
	cursorPosition = '';
	z_migo_matdesc = '';
	
	if(isBlank(z_migo_matl)){
		set("V[cursorPosition]","V[z_migo_matl]");
		message("E: Please enter Material.");
		enter("?");
		goto ERROR;
		}
	
// Display Material (Initial Screen)
onscreen 'SAPLMGMM.0060'
	set("F[RMMG1-MATNR]","&V[z_migo_matl]"); //Material
	enter('/5');

onmessage
	if(_message){
		set("V[z_migo_error]",_message);
		set("V[z_migo_matdesc]","");
		message(z_migo_error);
		enter("/n");
		set("V[cursorPosition]","V[z_migo_matl]");
		goto ERROR;
		}
	
// Display Material (Initial Screen)
onscreen 'SAPLMGMM.0070'
	set('cell[SAPLMGMM_TC_VIEW,0,1]','X');
	enter();

onscreen 'SAPLMGMM.4004'
	set("V[z_migo_matdesc]","&F[MAKT-MAKTX]"); //material description
	set("V[cursorPosition]","V[z_migo_batch]");
	enter('/n');
	
	ERROR:{};
}

// Purpose: To create new purchase order and empty the fields
// Where Used:Goods Receipt-Purchase Order
// (rapid_WM_chemicals_all_MIGOpurchaseorder.sjs)
// When Used: Upon clicking 'New' button on the screen
function newDoc(){
	set('V[z_migo_*]','');
}


// Purpose: Display in a table the materials belonging to the Purchase Order number
// Where Used:Goods Receipt-Purchase Order
// (rapid_WM_materials_all_MIGOpurchaseorder.sjs)
// When Used: Upon clicking 'Show Materials' button on the screen
function displayMaterial(){
	set("V[cursorPosition]","");
	set("V[z_migo_msg]","");
		
	if(isBlank(z_migo_ponum)){
		set("V[cursorPosition]","V[z_migo_ponum]");
		message("E:Please enter PO number.");
		enter('?');
		goto END;
	}
	
	//Return Delivery Material Document - BENJAMIN
	onscreen 'SAPLMIGO.0001'
		set('F[GODYNPRO-ACTION]', 'A01');					//Select Goods Receipts from dropdown
		enter('=MIGO_OK_ACTION');

	onscreen 'SAPLMIGO.0001'
		set('F[GODYNPRO-REFDOC]', 'R01');					//Select Purchase Order from dropdown
		enter('=MIGO_OK_REFDOC');

	onscreen 'SAPLMIGO.0001'
		set('F[GODYNPRO-PO_NUMBER]', '&V[z_migo_ponum]'); 	//PO Number
		enter();
	onmessage
		if(_message){
			set('V[z_migo_msg]',_message);
			message('E:'+ z_migo_msg);
			enter('/n');
			goto END;
		}
		
	onscreen 'SAPLMIGO.0001'
		if(_message){
			set('V[z_migo_msg]',_message);
			message('E:'+ z_migo_msg);
			enter('/n');
			goto END;
		} else{
			enter();
		}
		
	//Goods Receipt Purchase Order - BENJAMIN
	onscreen 'SAPLMIGO.0001'
		relrow=1;
		absrow=1;
		dm_tot=0;
		col=0;
		if(typeof migo_lnitems == 'object'){
			clear_values(migo_lnitems,["z_migo_matl","z_migo_desc","z_migo_opqty","z_migo_ordqty"],dm_tot);
		}

		gettableattribute('T[SAPLMIGO_TV_GOITEM]', {'firstvisiblerow':'FVisRow', 'lastvisiblerow':'LVisRow', 'lastrow':'LastRow'});
		if(FVisRow==1){
			goto NEW_ROW;
		} else{
			enter('/ScrollToLine=&V[absrow]',{'table':'T[SAPLMIGO_TV_GOITEM]'});
		}
	NEW_SCREEN:;
	onscreen 'SAPLMIGO.0001'
		gettableattribute('T[SAPLMIGO_TV_GOITEM]', {'firstvisiblerow':'FVisRow', 'lastvisiblerow':'LVisRow', 'lastrow':'LastRow'});
		relrow=1;
		NEW_ROW:;
		if(absrow>LastRow){
			goto END_OF_TABLE;
		}
		if(absrow>LVisRow){
			enter('/ScrollToLine=&V[absrow]',{'table':'T[SAPLMIGO_TV_GOITEM]'});
			goto NEW_SCREEN;
		}
		set('V[z_count]','cell[SAPLMIGO_TV_GOITEM,GODYNPRO-DETAIL_ZEILE,&V[relrow]]');
		if(z_count.trim()==''){
			goto END_OF_TABLE;
		}
		set('V[z_mtrl_&V[col]]','&cell[SAPLMIGO_TV_GOITEM,GOITEM-MATNR,&V[relrow]]');
		set('V[z_mtst_&V[col]]','&cell[SAPLMIGO_TV_GOITEM,GOITEM-MAKTX,&V[relrow]]');
		set('V[z_qty_&V[col]]','&cell[SAPLMIGO_TV_GOITEM,GOITEM-ERFMG,&V[relrow]]');
		set('V[z_poqty_&V[col]]','&cell[SAPLMIGO_TV_GOITEM,GOITEM-BSMNG,&V[relrow]]');
		absrow++;
		relrow++;
		col++;
		goto NEW_ROW;
		END_OF_TABLE:;
		dm_tot=absrow-1;
		dm_tot = parseInt(dm_tot);
		enter();

	onscreen 'SAPLMIGO.0001'
		if(_message){
			set('V[z_migo_msg]',_message);
			message("E:"+z_migo_msg);
		} else{
			z_data_match=true;
		}
		enter('/n');
		
	onscreen 'SAPLSMTR_NAVIGATION.0101'
		goto CONTINUE_PROCESSING;

	onscreen 'SAPLSMTR_NAVIGATION.0100'
		CONTINUE_PROCESSING:;
		if(!isBlank(z_migo_msg)){
			message('E:'+z_migo_msg);
		} else{
			set('V[SHOWSCREEN]','DISPLAYMATERIAL');
		}
		enter();
	END:{};
}

// Purpose: Display in a table the materials belonging to the Purchase Order number
// Where Used:Goods Receipt-Purchase Order
// (rapid_WM_materials_all_MIGOpurchaseorder.sjs)
// When Used: Upon clicking 'Show Materials' button on the screen
function getTableData(){
	// clearTable(migo_lnitems);
	for(var col=0;col<dm_tot;col++){
		set('V[z_tmp_read]','&V[z_mtrl_&V[col]]');
		migo_lnitems.z_migo_matl[col] = z_tmp_read;
		set('V[z_tmp_read]','&V[z_mtst_&V[col]]');
		migo_lnitems.z_migo_desc[col] = z_tmp_read;

		set('V[z_tmp_read]','&V[z_qty_&V[col]]');
		z_tmp_read = decimalNotationFormat(USERDECIMALFORMAT,z_tmp_read,3);
		z_tmp_read = userSAPDecimalFormat(z_tmp_read,USERDECIMALFORMAT);
		migo_lnitems.z_migo_opqty[col] = z_tmp_read;

		set('V[z_tmp_read]','&V[z_poqty_&V[col]]');
		z_tmp_read = decimalNotationFormat(USERDECIMALFORMAT,z_tmp_read,3);
		z_tmp_read = userSAPDecimalFormat(z_tmp_read,USERDECIMALFORMAT);
		migo_lnitems.z_migo_ordqty[col] = z_tmp_read;
	}
}

// Purpose: To Post on the Purchase Order Number
// Where Used:Goods Receipt-Purchase Order
// (rapid_WM_materials_all_MIGOpurchaseorder.sjs)
// When Used: Upon clicking 'Post' button on the screen
function postDoc(){
	set('V[migo_message]','');
	set('V[cursorPosition]','');
	
	if(isBlank(z_migo_ponum)){
		set("V[cursorPosition]","V[z_migo_ponum]");
		message("E:Please enter PO number.");
		enter('?');
		goto END;
	}
		
	if(isBlank(z_migo_matl)){
		set("V[cursorPosition]","V[z_migo_matl]");
		message("E:Please enter Material.");
		enter('?');
		goto END;
	}
	
	if(isBlank(z_migo_batch)){
		set("V[cursorPosition]","V[z_migo_batch]");
		message("E:Please enter Batch/Lot.");
		enter('?');
		goto END;
	}
		
	if(isBlank(z_migo_mfgd)){
		set("V[cursorPosition]","V[z_migo_mfgd]");
		message("E:Please enter Manufactured Date.");
		enter('?');
		goto END;
	}else {
		if(!isValidDate(z_migo_mfgd,parseInt(USERDATEFORMAT))) {
			set("V[cursorPosition]","V[z_migo_mfgd]");
			message('E: Enter Date in format ' + USERDATEFORMATMSG);
			enter('?');
			goto END;
		}
	}
		
	if(!isBlank(z_migo_expd)){
		if(!isValidDate(z_migo_expd,parseInt(USERDATEFORMAT))) {
			set("V[cursorPosition]","V[z_migo_expd]");
			message('E: Enter Date in format ' + USERDATEFORMATMSG);
			enter('?');
			goto END;
		}
	}
	
	if(isBlank(z_migo_qnty)){
		set("V[cursorPosition]","V[z_migo_qnty]");
		message("E:Please enter Quantity.");
		enter('?');
		goto END;
		}	
		
	if(isBlank(z_migo_stloc)){
		set("V[cursorPosition]","V[z_migo_stloc]");
		message("E:Please enter Storage Location.");
		enter('?');
		goto END;
		}

// Return Delivery Material Document - BENJAMIN
onscreen 'SAPLMIGO.0001'
	set('F[GODYNPRO-ACTION]', 'A01');					// Select Goods Receipt (A01) from dropdown
	enter('=MIGO_OK_ACTION');

onscreen 'SAPLMIGO.0001'
	set('F[GODYNPRO-REFDOC]', 'R01');					// Select Purchase Order (R01) from dropdown
	enter('=MIGO_OK_REFDOC');

// Goods Receipt Purchase Order 4500190810 - BENJAMIN
onscreen 'SAPLMIGO.0001'
	enter('=MIGO_OK_HEADER_OPEN');
	
onscreen 'SAPLMIGO.0001'
	enter('=MIGO_OK_DETAIL_OPEN');
	
onscreen 'SAPLMIGO.0001'
	set('F[GODYNPRO-PO_NUMBER]', '&V[z_migo_ponum]');	// PO Number
	enter();
onmessage
	if(_message){
		set('V[migo_message]',_message);
		message('E:'+ migo_message);
		enter('/n');
		goto END;
		}

onscreen 'SAPLMIGO.0001'
	if(_message){
		set('V[migo_message]',_message);
		message('E:' + migo_message);
		enter('/n');
		goto END;
	} else{
		enter();
	}

// Goods Receipt Purchase Order - BENJAMIN
onscreen 'SAPLMIGO.0001'
	set('F[GOHEAD-WEVER]','3');							// Select Collective Slip from dropdown
	set('F[GOHEAD-BKTXT]', '&V[z_migo_htxt]');
	set('F[GODEFAULT_TV-BWART]', '101');				// Movement Type 101 for GR against PO
	enter();
onmessage
	if(_message){
		set('V[migo_message]',_message);
		message(migo_message);
		enter('/n');
		goto END;
		}
	
onscreen 'SAPLMIGO.0001'
	material_found = false;
	migo_message = "";
	absrow=1;
	relrow=1;
	gettableattribute("T[SAPLMIGO_TV_GOITEM]", {"firstvisiblerow":"FVisRow","lastvisiblerow":"LVisRow","lastrow":"LastRow"});
	if(FVisRow == 1){
		goto NEW_ROW;
	} else{
		enter('/ScrollToLine=&V[absrow]',{"table":"T[SAPLMIGO_TV_GOITEM]"});
	}

	NEW_SCREEN:;
onscreen 'SAPLMIGO.0001'
		gettableattribute("T[SAPLMIGO_TV_GOITEM]", {"firstvisiblerow":"FVisRow","lastvisiblerow":"LVisRow","lastrow":"LastRow"});
		relrow = 1;
		NEW_ROW:;
		if(absrow > LastRow) {
			goto END_OF_TABLE;
		}

		if(absrow > LVisRow) {
			enter('/ScrollToLine=&V[absrow]',{"table":"T[SAPLMIGO_TV_GOITEM]"});
			goto NEW_SCREEN;
			}

		set("V[z_migo_mtr]","&cell[SAPLMIGO_TV_GOITEM,GOITEM-MATNR,&V[relrow]]");
		z_migo_mtr=z_migo_mtr.trim();
		if(isBlank(z_migo_mtr)){
			set("V[z_migo_mtr]","&cell[SAPLMIGO_TV_GOITEM,GOITEM-MAKTX,&V[relrow]]");
			if(isBlank(z_migo_mtr)){
				goto END_OF_TABLE;
				}
			}	
				
		if(z_migo_mtr.trim() == z_migo_matl.trim()) {
			material_found = true;
			set('V[z_maxqty]','&cell[SAPLMIGO_TV_GOITEM,GOITEM-ERFMG,&V[relrow]]');
			set('F[GODYNPRO-DETAIL_ZEILE]', '&V[relrow]');
			enter();
			goto POST_GOODS;
			}
		absrow++;
		relrow++;
		goto NEW_ROW;
		END_OF_TABLE:;
		
		if(material_found == false) {
			migo_message = "E: Material '" +z_migo_matl+"' does not exist on Purchase Order";
			message(migo_message);
			enter('/n');
			goto SCRIPT_END;
		}

	POST_GOODS:;
// Goods Receipt Purchase Order 4500017653 - BENJAMIN
onscreen 'SAPLMIGO.0001'
	if(_database == 'TRX'){
		set('F[GOHEAD-BUDAT]', '12.12.2006'); //Hard-coded for testing purposes on TRX
	}
	set('F[GOITEM-ERFMG]', '&V[z_migo_qnty]');
	set('F[GOITEM-MIGO_INSMK]', ''); //Stock type
	set('F[GOITEM-LGOBE]', '&V[z_migo_stloc]');
	set('F[GOITEM-CHARG]', '&V[z_migo_batch]');
	set('F[GOITEM-HSDAT]', '&V[z_migo_mfgd]');
	set('F[GOITEM-VFDAT]', '&V[z_migo_expd]');
	set('C[GODYNPRO-DETAIL_TAKE]', 'X');
	enter('/23');				//Post button clicked		
onmessage
	if(_message){
		set('V[migo_message]',_message);
		message(migo_message);
		enter('/n');
		goto SCRIPT_END;
		}
	
onscreen 'SAPLSBAL_DISPLAY.0120'		//Error pop-up screen: Invalid quantity
	var arrMessage = [];
	arrMessage=_listrows("Typ,Item,Message text,LTxt",false,0,true,"Message text")
	migo_message = "E:"+arrMessage;
	enter('/12');

onscreen 'SAPLKKBL.0120'				//Error pop-up screen: Invalid storage location
	set("V[migo_message]","&F[MESSTXT1]");
	enter('/12');

onscreen 'SAPLMIGO.0001'
	if(_message){
		set('V[migo_message]',_message);
		message(migo_message);
	}
	enter('/n');
	
	SCRIPT_END:{};
onscreen 'SAPLSMTR_NAVIGATION.0101'
	goto CONTINUE_PROCESSING;
	
onscreen 'SAPLSMTR_NAVIGATION.0100'
	CONTINUE_PROCESSING:;
	if(!isBlank(migo_message)){
		message(migo_message);
		if(migo_message.substring(0,2)!='E:'){
			set('V[z_temp_migo_ponum]','&V[z_migo_ponum]');
			set('V[z_temp_migo_po_readonly]','&V[z_migo_po_readonly]');		
			
			set('V[z_migo*]','');
			set('V[z_migo_ponum]','&V[z_temp_migo_ponum]');
			set('V[z_migo_po_readonly]','&V[z_temp_migo_po_readonly]');	
			}
		} else{
			set('V[migo_message]',_message);
			message(migo_message);
		}
	enter();
	END:{};	
}

