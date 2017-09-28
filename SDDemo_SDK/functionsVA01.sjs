//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			Navigate to Sales Order Overview Screen
//**************************************************************************************************//
function va01OnEnter(){
		//Takes you to overview screen
	onscreen 'SAPMV45A.4001'
		goto SAPMV45A_4008;
	onscreen 'SAPMV45A.4008'
		SAPMV45A_4008:;
		set("F[KUAGV-KUNNR]","&V[z_va01_sold_to_party]");
		set("F[KUWEV-KUNNR]","&V[z_va01_ship_to_party]");
		set("F[VBKD-BSTKD]","&V[z_va01_po_number]");
		set("F[VBKD-BSTDK]","&V[z_va01_po_date]");
		enter('=KKAU');
		onerror
			message(_message);
			enter('/nva01');
			goto SCRIPT_END;

	onscreen 'SAPMV45A.4002'
		set("V[z_va01_price_list]","&F[VBKD-PLTYP]");
		enter('KRPL');

	onscreen 'SAPLV60F.4001'
		set('V[z_vaxx_total]','&F[FPLAA-ENDWR]');
		enter('T\\06');

	onscreen 'SAPMV45A.5002'
		set('V[z_vaxx_tax]','&F[KOMP-MWSBP]');
		enter('KSTA');

	onscreen 'SAPMV45A.4002'
		//Overall status
		if(<'F[VBUK-GBSTK]'>.isValid) set('V[z_vaxx_overallStatus]','&F[VBUK-GBSTK]');
		//Rejection status
		if(<'F[VBUK-ABSTK]'>.isValid) set('V[z_vaxx_rejectionStatus]','&F[VBUK-ABSTK]');
		//Delivery status
		if(<'F[VBUK-LFSTK]'>.isValid) set('V[z_vaxx_deliveryStatus]','&F[VBUK-LFSTK]');
		//Credit status
		if(<'F[VBUK-CMGST]'>.isValid) set('V[z_vaxx_creditStatus]','&F[VBUK-CMGST]');
		enter('/3');
			
	SCRIPT_END:;
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			Disable SAP Functions and F Keys
//**************************************************************************************************//
function disable(){
	return;
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			Update Sales Order Status and Data
//**************************************************************************************************//
function update_status(){
	set('V[z_vaxx_overallStatus]','');
	set('V[z_vaxx_rejectionStatus]','');
	set('V[z_vaxx_deliveryStatus]','');
	set('V[z_vaxx_creditStatus]','');
	onscreen 'SAPMV45A.4001'
		goto SAPMV45A_4008;
	onscreen 'SAPMV45A.4008'
		SAPMV45A_4008:;
		enter('KRPL');
	onscreen 'SAPLV60F.4001'
		set('V[z_vaxx_total]','&F[FPLAA-ENDWR]');
		enter('T\\06');
	onscreen 'SAPMV45A.5002'
		set('V[z_vaxx_tax]','&F[KOMP-MWSBP]');
		enter('KSTA');
	onscreen 'SAPMV45A.4002'
		//Overall status
		if(<'F[VBUK-GBSTK]'>.isValid) set('V[z_vaxx_overallStatus]','&F[VBUK-GBSTK]');
		//Rejection status
		if(<'F[VBUK-ABSTK]'>.isValid) set('V[z_vaxx_rejectionStatus]','&F[VBUK-ABSTK]');
		//Delivery status
		if(<'F[VBUK-LFSTK]'>.isValid) set('V[z_vaxx_deliveryStatus]','&F[VBUK-LFSTK]');
		//Credit status
		if(<'F[VBUK-CMGST]'>.isValid) set('V[z_vaxx_creditStatus]','&F[VBUK-CMGST]');
		enter('/3');	
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			Reset Variables
//**************************************************************************************************//
function blockUnrequired(){
	set("V[z_vaxx_*]","");
	set("V[z_va01_*]","");
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			Save Sales Order from VA01 Transaction
function va01Save(){

	onscreen 'SAPLSPO2.0300'
		HANDLE_POPUP_0300:;
		enter('=OPT1');

	onscreen 'SAPLATP4.0500'
		enter('=WEIT');

	onscreen 'SAPLSPO2.0300'
		goto HANDLE_POPUP_0300
		
	onscreen 'SAPMV45A.4001'
		goto SAPMV45A_3;
	onscreen 'SAPMV45A.4008'
		SAPMV45A_3:;	
		if(_message){
			println('----------------------------------:' + _message);
			if(_message.indexOf('has been saved') > -1) {	// If String is found
				message("S: "+_message);
				set("V[z_vaxx_*]","");
				set("V[z_va01_*]","");
				set('V[z_va02_order]', _message.replace(/\D/g,''));
				enter('/n');
				goto SCRIPT_END;
			}
			if(_message.substring(0,2) == 'E:'){
				message(_message);
				enter('?');
				goto SCRIPT_END;
			}
		}
	SCRIPT_END:;
	
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			Save Sales Order from VA02 Transaction
function va02Save(){

	onscreen 'SAPLSPO2.0300'
		HANDLE_POPUP_0300:;
		enter('=OPT1');

	onscreen 'SAPLATP4.0500'
		enter('=WEIT');

	onscreen 'SAPLSPO2.0300'
		goto HANDLE_POPUP_0300

	onscreen 'SAPMV45A.0102'	
		if(_message){
			message("S:"+_message);	
			enter('/n');
		}	
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			Enables Screen Flow and Navigation (Controls Screen Displays)
//**************************************************************************************************//
function toggleUI(param) {
	set('V[screenMODE]',param.l_mode);
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			When Enter is pressed on VA02, VA03 transaction
//**************************************************************************************************//
function va0xEnter(){
	if(isBlank(z_va02_order)) {
		if(_language == 'E') {
			message('E: Enter Order Number');
		}
		if(_language == 'J') {
			message('E: 注文番号を入力してください');		
		}
		enter('?');
		goto SCRIPT_END;
	}

	// Change Sales Order: Initial Screen
	onscreen 'SAPMV45A.0102'
		set('F[VBAK-VBELN]','&V[z_va02_order]');
		enter();
		onmessage
		if(_message.substring(0,2) == 'E:') {
			message(_message);
			enter('/n');
			goto SCRIPT_END;
		}

	// Change Sales Order: Initial Screen
	onscreen 'SAPMSDYP.0010'
		enter();
	
	onscreen 'SAPMV45A.4001'
		goto SAPMV45A_4008;

	onscreen 'SAPMV45A.4008'
		SAPMV45A_4008:;
		enter('=KKAU');
		HANDLE_WARNINGS:;
		onmessage
		if(_message.substring(0,2) == 'W:') {
			message(_message);
			enter();
			goto HANDLE_WARNINGS;
		}

	onscreen 'SAPMV45A.4002'
		set("V[z_va01_price_list]","&F[VBKD-PLTYP]");
		enter('KRPL');

	onscreen 'SAPLV60F.4001'
		set('V[z_vaxx_total]','&F[FPLAA-ENDWR]');
		enter('T\\06');

	onscreen 'SAPMV45A.5002'
		set('V[z_vaxx_tax]','&F[KOMP-MWSBP]');
		enter('KSTA');

	onscreen 'SAPMV45A.4002'
		//Overall status
		if(<'F[VBUK-GBSTK]'>.isValid)
			set('V[z_vaxx_overallStatus]','&F[VBUK-GBSTK]');
		//Rejection status
		if(<'F[VBUK-ABSTK]'>.isValid)
			set('V[z_vaxx_rejectionStatus]','&F[VBUK-ABSTK]');
		//Delivery status
		if(<'F[VBUK-LFSTK]'>.isValid)
			set('V[z_vaxx_deliveryStatus]','&F[VBUK-LFSTK]');
		//Credit status
		if(<'F[VBUK-CMGST]'>.isValid)
			set('V[z_vaxx_creditStatus]','&F[VBUK-CMGST]');
		enter('/3');

	SCRIPT_END:;
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.
//Version: 			1.0
//Purpose: 			Navigate to Delivery Overview Screen VL02N
//**************************************************************************************************//
function vl02nEnter(){
	if(isBlank(z_vl02n_dlv)) {
		if(_language == 'E') { 
			message('E: Enter Delivery Number');
		}
		if(_language == 'J') { 
			message('E: 配達番号を入力してください');
		}
		enter('?');
		goto SCRIPT_END;
	}
	
	//onscreen v102n
	onscreen 'SAPMV50A.4004'
		set('F[LIKP-VBELN]','&V[z_vl02n_dlv]');
		enter();
		onmessage
		if(_message.substring(0,2) == 'E:') {
			message(_message);
			enter('/n');
			goto SCRIPT_END;
		}
	
	SCRIPT_END:;
}
//**************************************************************************************************//
//Developed By:		Synactive, Inc.																	
//Version: 			1.0																				
//Purpose: 			SAPMV45A_TCTRL_U_ERF_AUFTRAG Table Layouts based on Regions
//**************************************************************************************************//
function allItemsUI(){
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-PROFL]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-UEPOS]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-PRGBZ]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-CHARG]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,KOMV-KSCHL]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-NETPR]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-KPEIN]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-KMEIN]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-NETWR]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-WAERK]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-KSTBS]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-WMINR]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ABFOR]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-ABGESP]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBSN-AESKD]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-PRCTR]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-LGORT]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBSTT-GBSTA_BEZ]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-SERNR]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-KATPMN]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBSTT-FSSTA_BEZ]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-PERFK]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-CROSL_EXIST]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-ADDIT_EXIST]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-DELCO]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-MVGR1]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-MVGR2]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-MVGR3]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-MVGR4]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-MVGR5]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-KDKG1]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-KDKG2]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-KDKG3]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-KDKG4]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-KDKG5]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-WGRU1]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-WGRU2]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,GATP Sort Priority]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,GATP Tier]',0); 
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,	VBAP-PRODH]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-SPART]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-PS_PSP_PNR]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-AUFNR]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-KONDM]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-KDGRP]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-KONDA]',0);
	// columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-PLTYP]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-BZIRK]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-BSTDK]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-BSARK]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-BSTKD_E]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-BSTDK_E]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-BSARK_E]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-POSEX_E]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-LPRIO]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,TPRIT-BEZEI]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-VSTEL]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-KZTLF]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-NTGEW]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-GEWEI]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-BRGEW]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-BRGEW]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-VOLEH]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-INCO1]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-INCO2]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-ZTERM]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-FAKSP]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-FKREL]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-KFREL]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,FPLT-FAKSP]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBSTT-UVALL_BEZ]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,Billing block.2]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-KURSK]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-MATWA]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,Sustitution Reason]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-PMATN]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ABGRS]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-KALSM_K]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ZSCHL_K]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-EMPST]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-ABTNR]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ANTLF]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-UEBTO]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-UNTTO]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-VALDT]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-VALTG]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-PERFK]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-FKDAT]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBKD-FBUDA]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-KTGRM]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-KMPMG]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-CCODE]',0);
	columnwidth('[SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBSTT-LSSTA_BEZ]',0);
	
	switch(allItemsLayout){
		case 'AMERICAS':
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-BSTKD",1);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-POSNR",2);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-POSEX",3);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-MATNR",4);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ARKTX",5);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, Customer Material Numb",6);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-KOEIN",24);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-KWMENG",8);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VRKME",9);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-WERKS ",11);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-ETDAT",13);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-EPMEH ",16);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ROUTE ",17);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, KOMV-KBETR",18);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PLTYP",19);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PRSDT",20);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, ItCa",21);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VKAUS",22);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ABGRU",23);
			break;
		
		case 'ASIA':
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ARKTX",3);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, Customer Material Numb",4);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-KWMENG",5);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VRKME",6);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, KOMV-KBETR",7);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-EPMEH ",8);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-ETDAT",9);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-WERKS ",13);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ROUTE ",14);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ABGRU",15);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PRSDT",16);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, ItCa",18);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VKAUS",19);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-KOEIN",21);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-BSTKD",22);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-POSEX",23);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PLTYP",24);
			break;
			
		case 'JAPAN':
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ARKTX",3);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-KWMENG",4);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-BSTKD",5);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-WERKS ",6);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ROUTE ",7);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-ETDAT",8);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, Customer Material Numb",12);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-EPMEH ",13);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, KOMV-KBETR",14);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ABGRU",16);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, ItCa",17);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VKAUS",18);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PLTYP",20);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PRSDT",21);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-KOEIN",22);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-POSEX",23);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VRKME",24);
			break;
		
		case 'EMEA':
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-POSNR",1);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-MATNR",2);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ARKTX",3);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, Customer Material Numb",4);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-KWMENG",5);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-ETDAT",7);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, KOMV-KBETR",10);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ROUTE ",12);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-WERKS ",13);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VRKME",14);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-EPMEH ",16);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PLTYP",17);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PRSDT",18);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, ItCa",19);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VKAUS",20);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ABGRU",21);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-KOEIN",22);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-BSTKD",23);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-POSEX",24);
			break;
		
		default:
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-BSTKD",1);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-POSNR",2);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-POSEX",3);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-MATNR",4);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ARKTX",5);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, Customer Material Numb",6);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,RV45A-KOEIN",24);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-KWMENG",8);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VRKME",9);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-WERKS ",11);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, RV45A-ETDAT",13);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAPD-EPMEH ",16);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG,VBAP-ROUTE ",17);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, KOMV-KBETR",18);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PLTYP",19);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBKD-PRSDT",20);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, ItCa",21);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-VKAUS",22);
			columnorder("SAPMV45A_TCTRL_U_ERF_AUFTRAG, VBAP-ABGRU",23);
	}	
}
