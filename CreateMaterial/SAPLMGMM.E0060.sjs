if(isBlank(FILESLOADED)) {
	load('mm01Functions.sjs');
	FILESLOADED = 'X';
}
if(_transaction=='MM01'){
	pushbutton([TOOLBAR], "Refresh", "?");
    if(!isBlank(liquidUIActive)){
		
        pushbutton([TOOLBAR], '@2W@Show Standard SAP', {"process":toggleLiquidUI, using:{"l_set":""}});
    
		/*************************************************
		******** Reference  Material Group Box ***********
		**************************************************/
		del("F[Material]");
		del("F[Change number]");
		if(<'P[Select view(s)]'>.isValid)
			del("P[Select view(s)]");
		if(<'P[Organizational levels]'>.isValid)
			del("P[Organizational levels]");
		del("P[Data]");

		set("F[Industry sector]", 'M');
		set("F[Material type]", 'FERT');
		del("F[Industry sector]");
		del("F[Material type]");

		pos("G[Copy from...]","F[RMMG1-MATNR]+[-1,2]");
		text("G[Copy from...]","Reference Material");
		boxsize("G[Copy from...]",[9,45]);
		text("F[RMMG1_REF-MATNR]","Copy Material Number");
		pos("F[RMMG1_REF-MATNR]","G[Copy from...]+[1,2]");
		pos("F[RMMG1_REF-MATNR]","F[RMMG1_REF-MATNR]+[0,22]",{"value":true});

		inputfield("F[RMMG1_REF-MATNR]+[1,0]", 'Copy Plant', "F[RMMG1_REF-MATNR]+[1,22]", {"name":"z_mm01_cpy_plnt", "size":18,"searchhelp":"H_T001W"});
		inputfield("F[RMMG1_REF-MATNR]+[2,0]", 'Copy Storage Loc.', "F[RMMG1_REF-MATNR]+[2,22]", {"name":"z_mm01_cpy_sloc", "size":18,"searchhelp":"H_T001L"});
		pushbutton("F[RMMG1_REF-MATNR]+[3,10]", "@13@      Get Copy Material Values", "/nMM03",{"process":getCopyMaterialVal, "size":[1,30]});

		inputfield("F[RMMG1_REF-MATNR]+[5,0]", 'Copy Extended Material', "F[RMMG1_REF-MATNR]+[5,22]", {"name":"z_mm01_cpy_ext_mat", "size":18,"searchhelp":"MAT1"});
		pushbutton("F[RMMG1_REF-MATNR]+[6,10]", "@13@  Get Extended Material Values", "/nMM03",{"process":getExtMaterialVal, "size":[1,30]});

		/*************************************************
		************* Execute Group Box ******************
		**************************************************/
		box("F[RMMG1-MATNR]+[-1,50]","F[RMMG1-MATNR]+[7,98]","Execute");
		pushbutton("G[Execute]+[1,2]", "@2L@        Create New Material", "?",{"process":createMaterial,"size":[1,25]});
		inputfield("G[Execute]+[1,28]", {"name":"z_mm01_new_mat", "nolabel":true, "size":18,"readonly":true});
		pushbutton("G[Execute]+[3,2]", "@2L@   Extend Material to Plant", "/nMM01",{"process":extMaterialToPlant,"size":[1,25]});
		inputfield("G[Execute]+[3,28]", {"name":"z_mm01_ext_mat_plnt", "nolabel":true, "size":18,"searchhelp":"H_T001W"});
		pushbutton("G[Execute]+[5,2]", "@2L@   Extend Material to SLoc", "?",{"process":extMaterialToSLoc,"size":[1,25]});
		inputfield("G[Execute]+[5,28]", {"name":"z_mm01_ext_mat_sloc", "nolabel":true, "size":18,"searchhelp":"H_T001L","shselname1":"WERKS","shselvalue1":"V[z_mm01_ext_mat_plnt]"});
		pushbutton("G[Execute]+[7,2]", "@2L@       Change Existing Mat'l", "/nMM02",{"process":chgExtMaterial,"size":[1,25]});
		inputfield("G[Execute]+[7,28]", {"name":"z_mm01_chng_ext_mat", "nolabel":true, "size":18,"searchhelp":"MAT1"});

		/*************************************************
		*********** Instruction View screen **************
		**************************************************/
		box("G[Execute]+[0,52]","G[Execute]+[8,100]","Instructions");
		view([1.8,102], [8.8,150],"\\\\athena\\PERSONAL\\Rahul\\Demo\\Scripts\\Instructions.html");
		// view("G[Instructions]+[1,1]","G[Instructions]+[7,47]","\\\\athena\\PERSONAL\\Rahul\\Demo\\Scripts\\Instructions.html");
		// view([1,103], [9,150], "http://liquid-ui.com",{"title":"Instructions"});

		/*************************************************
		********** Material Values Group Box *************
		**************************************************/
		box("G[Copy from...]+[2,2]","G[Copy from...]+[33,46]","Material Values");
		inputfield("G[Material Values]+[1,2]", 'Material', "G[Material Values]+[1,24]", {"name":"z_mm01_matl", "size":18,"searchhelp":"MAT1"});
		inputfield("G[Material Values]+[2,2]", 'Plant', "G[Material Values]+[2,24]", {"name":"z_mm01_plnt", "size":18,"searchhelp":"H_T001W","shname1":"WERKS","shdest1":"V[z_mm01_plnt]"});
		inputfield("G[Material Values]+[3,2]", 'Storage Loc.', "G[Material Values]+[3,24]", {"name":"z_mm01_sloc", "size":18,"searchhelp":"H_T001L","shname":"LGORT","shselname1":"WERKS","shselvalue1":"V[z_mm01_plnt]"});
		inputfield("G[Material Values]+[4,2]", 'Base Unit of Meas.', "G[Material Values]+[4,24]", {"name":"z_mm01_buom", "size":18,"searchhelp":"H_T006"});
		inputfield("G[Material Values]+[5,2]", 'Material Group', "G[Material Values]+[5,24]", {"name":"z_mm01_mtlgrp", "size":18,"searchhelp":"H_T023"});
		inputfield("G[Material Values]+[6,2]", 'Old Material Number', "G[Material Values]+[6,24]", {"name":"z_mm01_old_matl", "size":18});
		inputfield("G[Material Values]+[7,2]", 'Cros. Plnt.Ma. Stat', "G[Material Values]+[7,24]", {"name":"z_mm01_crs_plnt_mtl_stat", "size":18,"searchhelp":"H_T141"});
		inputfield("G[Material Values]+[8,2]", 'Dang. Goods Indicat', "G[Material Values]+[8,24]", {"name":"z_mm01_dng_gds_ind", "size":18,"techname":"MARA-PROFL"});
		inputfield("G[Material Values]+[9,2]", 'Profit Center', "G[Material Values]+[9,24]", {"name":"z_mm01_prf_ctr", "size":18,"searchhelp":"PRCTR_EMPTY"});
		inputfield("G[Material Values]+[10,2]", 'Country of Origin', "G[Material Values]+[10,24]", {"name":"z_mm01_coo", "size":18,"techname":"MARC-HERKL"});
		inputfield("G[Material Values]+[11,2]", 'Order Unit of Meas.', "G[Material Values]+[11,24]", {"name":"z_mm01_oum", "size":18,"readonly":true});
		inputfield("G[Material Values]+[12,2]", 'Plnt Spc. MM/PP Stat.', "G[Material Values]+[12,24]", {"name":"z_mm01_plnt_spe", "size":18,"searchhelp":"H_T141"});
		inputfield("G[Material Values]+[13,2]", 'Tax Indicator', "G[Material Values]+[13,24]", {"name":"z_mm01_tx_ind", "size":18,"techname":"MG03STEUMM-TAXIM"});
		inputfield("G[Material Values]+[14,2]", 'Mfr. Part Num.', "G[Material Values]+[14,24]", {"name":"z_mm01_mfr_ptnum", "size":18});
		inputfield("G[Material Values]+[15,2]", 'ABC Indicator', "G[Material Values]+[15,24]", {"name":"z_mm01_abc_ind", "size":18,"techname":"MARC-MAABC"});
		inputfield("G[Material Values]+[16,2]", 'MRP Controller', "G[Material Values]+[16,24]", {"name":"z_mm01_mrp_ctl", "size":18,"searchhelp":"H_T024D"});
		inputfield("G[Material Values]+[17,2]", 'Min. Lot Size', "G[Material Values]+[17,24]", {"name":"z_mm01_min_ltsz", "size":18});
		inputfield("G[Material Values]+[18,2]", 'Rounding Values', "G[Material Values]+[18,24]", {"name":"z_mm01_rndval", "size":18});
		inputfield("G[Material Values]+[19,2]", 'Special Proc Key', "G[Material Values]+[19,24]", {"name":"z_mm01_spl_proky", "size":18,"searchhelp":"H_T460A"});
		inputfield("G[Material Values]+[20,2]", 'Stor. Loc. for Ext. Proc.', "G[Material Values]+[20,24]", {"name":"z_mm01_sloc_ext_pro", "size":18,"searchhelp":"H_T001L"});
		inputfield("G[Material Values]+[21,2]", 'Planned Del Time', "G[Material Values]+[21,24]", {"name":"z_mm01_pln_del_time", "size":18});
		inputfield("G[Material Values]+[22,2]", 'Safety Stock', "G[Material Values]+[22,24]", {"name":"z_mm01_sfty_stk", "size":18});
		inputfield("G[Material Values]+[23,2]", 'Storage Bin', "G[Material Values]+[23,24]", {"name":"z_mm01_sbin", "size":18,"searchhelp":"H_T001L"});
		inputfield("G[Material Values]+[24,2]", 'Unit of Issue', "G[Material Values]+[24,24]", {"name":"z_mm01_uoi", "size":18,"readonly":true,"searchhelp":"H_T006"});
		inputfield("G[Material Values]+[25,2]", 'Discontin Ind.', "G[Material Values]+[25,24]", {"name":"z_mm01_disc_ind", "size":18,"techname":"MARC-KZAUS"});
		inputfield("G[Material Values]+[26,2]", 'Eff.-out', "G[Material Values]+[26,24]", {"name":"z_mm01_eff_out", "size":18,"techname":"MARC-AUSDT"});
		inputfield("G[Material Values]+[27,2]", 'Follow-up Matl', "G[Material Values]+[27,24]", {"name":"z_mm01_fol_matl", "size":18,"searchhelp":"MAT1"});
		inputfield("G[Material Values]+[28,2]", 'SLoc MRP Indicator', "G[Material Values]+[28,24]", {"name":"z_mm01_sloc_mrp_ind", "size":18,"searchhelp":"H_T001L"});
		inputfield("G[Material Values]+[29,2]", 'Reorder Point', "G[Material Values]+[29,24]", {"name":"z_mm01_rop", "size":18,"searchhelp":"H_T001L"});
		inputfield("G[Material Values]+[30,2]", 'Replenishment Qty', "G[Material Values]+[30,24]", {"name":"z_mm01_rpl_qty", "size":18,"searchhelp":"H_T001L"});

		/*************************************************
		******** Material Description Group Box **********
		**************************************************/
		box("G[Material Values]+[0,48]","G[Material Values]+[4,96]","Material Description");
		comment("G[Material Description]+[1,1]","Language");
		comment("G[Material Description]+[1,14]","Cd");
		comment("G[Material Description]+[1,18]","Description");

		inputfield("G[Material Description]+[2,1]", {"name":"z_def_lang_en", "nolabel":true, "default":"English", "readonly":true, "size":12});
		inputfield("G[Material Description]+[2,14]", {"name":"z_def_cd_en", "nolabel":true, "default":"EN", "readonly":true, "size":3});
		// println("\n=====screen====="+z_mm01_cd+"=====script=====\n");
		if(!isBlank(z_mm01_cd)){
			// println("\n=====screen====="+z_mm01_desc+"=====script=====\n");
			var z_lang_idx = z_mm01_cd.indexOf("EN");
			z_mm01_desc_en = z_mm01_desc[z_lang_idx];
			var z_lang_idx = z_mm01_cd.indexOf("DE");
			z_mm01_desc_de = z_mm01_desc[z_lang_idx];
		} else{
			var z_mm01_cd = [];
			var z_mm01_desc = [];
		}
		inputfield("G[Material Description]+[2,18]", {"name":"z_mm01_desc_en", "nolabel":true, "size":30});

		inputfield("G[Material Description]+[3,1]", {"name":"z_def_lang_de", "nolabel":true, "default":"German", "readonly":true, "size":12});
		inputfield("G[Material Description]+[3,14]", {"name":"z_def_cd_de", "nolabel":true, "default":"DE", "readonly":true, "size":3});
		inputfield("G[Material Description]+[3,18]", {"name":"z_mm01_desc_de", "nolabel":true, "size":30});

		/*************************************************
		****** Purchase Order Text List Group Box ********
		**************************************************/
		box("G[Material Description]+[0,52]","G[Material Description]+[12,100]","Purchase Order Text");
		text("G[Purchase Order Text]+[1,1]","Language",{"intensified":true});
		set("V[z_mm01_language]","EN=English;DE=German;");
		dropdownlist("G[Purchase Order Text]+[2,1]", "z_mm01_language",{"width":10});
		pushbutton("G[Purchase Order Text]+[2,12]", "@2L@Apply Text to Language", "?",{"size":[1,22]});
		inputfield("G[Purchase Order Text]+[2,35]", {"name":"z_mm01_txt_lang_01", "nolabel":true, "readonly":true, "size":6});
		inputfield("G[Purchase Order Text]+[2,42]", {"name":"z_mm01_txt_lang_02", "nolabel":true, "readonly":true, "size":6});
		pushbutton("G[Purchase Order Text]+[3,1]", "@13@ Get Existing PO Text", "/nMM03",{"process":getExtPOText,"size":[1,20]});
		pushbutton("G[Purchase Order Text]+[3,22]", "@03@Review Text", "/nMM03",{"size":[1,12]});
		inputfield("G[Purchase Order Text]+[3,35]", {"name":"z_mm01_rv_txt_01", "nolabel":true, "readonly":true, "size":6});
		inputfield("G[Purchase Order Text]+[3,42]", {"name":"z_mm01_rv_txt_02", "nolabel":true, "readonly":true, "size":6});
		pushbutton("G[Purchase Order Text]+[4,1]", "@2L@ Update PO Text", "/nMM02",{"size":[1,20]});
		inputfield("G[Purchase Order Text]+[4,22]", {"name":"z_mm01_updt_potxt_mtrl", "nolabel":true, "size":25});
		textbox("G[Purchase Order Text]+[6,1]","G[Purchase Order Text]+[12,48]",{"name":"z_mm01_po_txt"})

		/*************************************************
		**** Existing Material Description Group Box *****
		**************************************************/
		box("G[Material Description]+[5,0]","G[Material Description]+[10,48]","Existing Material Description");
		// inputfield("G[Existing Material Description]+[1,6]", {"name":"z_mm01_cd_3", "nolabel":true, "readonly":true, "size":4});
		// inputfield("G[Existing Material Description]+[1,11]", {"name":"z_mm01_desc_3", "nolabel":true, "readonly":true, "size":32});
		// inputfield("G[Existing Material Description]+[2,6]", {"name":"z_mm01_cd_4", "nolabel":true, "readonly":true, "size":4});
		// inputfield("G[Existing Material Description]+[2,11]", {"name":"z_mm01_desc_4", "nolabel":true, "readonly":true, "size":32});
		// inputfield("G[Existing Material Description]+[3,6]", {"name":"z_mm01_cd_5", "nolabel":true, "readonly":true, "size":4});
		// inputfield("G[Existing Material Description]+[3,11]", {"name":"z_mm01_desc_5", "nolabel":true, "readonly":true, "size":32});
		// inputfield("G[Existing Material Description]+[4,6]", {"name":"z_mm01_cd_6", "nolabel":true, "readonly":true, "size":4});
		// inputfield("G[Existing Material Description]+[4,11]", {"name":"z_mm01_desc_6", "nolabel":true, "readonly":true, "size":32});
		
		// inputfield("G[Existing Material Description]+[1,6]", {"name":"z_mm01_cd_xx_1", "nolabel":true, "readonly":true, "size":4});
		// inputfield("G[Existing Material Description]+[1,11]", {"name":"z_mm01_desc_xx_1", "nolabel":true, "readonly":true, "size":32});
		// inputfield("G[Existing Material Description]+[2,6]", {"name":"z_mm01_cd_xx_2", "nolabel":true, "readonly":true, "size":4});
		// inputfield("G[Existing Material Description]+[2,11]", {"name":"z_mm01_desc_xx_2", "nolabel":true, "readonly":true, "size":32});
		// inputfield("G[Existing Material Description]+[3,6]", {"name":"z_mm01_cd_xx_2", "nolabel":true, "readonly":true, "size":4});
		// inputfield("G[Existing Material Description]+[3,11]", {"name":"z_mm01_desc_xx_3", "nolabel":true, "readonly":true, "size":32});
		// inputfield("G[Existing Material Description]+[4,6]", {"name":"z_mm01_cd_xx_4", "nolabel":true, "readonly":true, "size":4});
		// inputfield("G[Existing Material Description]+[4,11]", {"name":"z_mm01_desc_xx_4", "nolabel":true, "readonly":true, "size":32});
		for(idx=2;idx<6;idx++){
			z_mm01_cd_temp = z_mm01_cd[idx];
			z_mm01_desc_temp = z_mm01_desc[idx];
			inputfield([13+idx,56], {"name":"z_mm01_cd_temp", "nolabel":true, "readonly":true, "size":4});
			inputfield([13+idx,61], {"name":"z_mm01_desc_temp", "nolabel":true, "readonly":true, "size":32});
		}
		
		
		/*************************************************
		**** Additional Data Group Box *****
		**************************************************/
		box("G[Existing Material Description]+[6,0]","G[Existing Material Description]+[18,48]","Additional Data");
		text("G[Additional Data]+[1,1]","Units of Measure",{"intensified":true});

		inputfield("G[Additional Data]+[1,16]", 'Base UoM', "G[Additional Data]+[1,25]", {"name":"z_mm01_add_buom", "size":6, "readonly":true, "searchhelp":"MAT1"});
		inputfield("G[Additional Data]+[2,16]", 'Base Qty', "G[Additional Data]+[2,25]", {"name":"z_mm01_add_bqty", "size":6,"searchhelp":"MAT1"});
		checkbox("G[Additional Data]+[3,16]","Order UoM");

		inputfield("G[Additional Data]+[1,32]", 'Alt UoM', "G[Additional Data]+[1,40]", {"name":"z_mm01_add_alt_buom", "size":6, "readonly":true, "searchhelp":"MAT1"});
		inputfield("G[Additional Data]+[2,32]", 'Alt Qty', "G[Additional Data]+[2,40]", {"name":"z_mm01_add_alt_bqty", "size":6,"searchhelp":"MAT1"});
		checkbox("G[Additional Data]+[3,32]","Unit of Issue");

		text("G[Additional Data]+[4,1]","Internal Comments",{"intensified":true});
		textbox("G[Additional Data]+[5,1]","G[Additional Data]+[12,49]",{"name":"z_mm01_add_int_com"})

		/*************************************************
		 New Material Classification Information Group Box
		**************************************************/
		box("G[Additional Data]+[2,52]","G[Additional Data]+[13,100]","New Material Classification Information");
		inputfield("G[New Material Classification Information]+[1,1]", 'Drawing Number', "G[New Material Classification Information]+[1,24]", {"name":"z_mm01_drw_nbr", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[2,1]", 'Old Kholer Material Number', "G[New Material Classification Information]+[2,24]", {"name":"z_mm01_old_khlr_mat_nbr", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[3,1]", 'Manufacturer Name', "G[New Material Classification Information]+[3,24]", {"name":"z_mm01_mfr_nm", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[4,1]", 'Mfgr part number', "G[New Material Classification Information]+[4,24]", {"name":"z_mm01_mfgr_pt_nbr", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[5,1]", 'XREF Reference_1', "G[New Material Classification Information]+[5,24]", {"name":"z_mm01_xref_01", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[6,1]", 'XREF Reference_2', "G[New Material Classification Information]+[6,24]", {"name":"z_mm01_xref_02", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[7,1]", 'XREF Reference_3', "G[New Material Classification Information]+[7,24]", {"name":"z_mm01_xref_03", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[8,1]", 'Vendor Material Number', "G[New Material Classification Information]+[8,24]", {"name":"z_mm01_vndr_mat_nbr", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[9,1]", 'Plant Material Created In', "G[New Material Classification Information]+[9,24]", {"name":"z_mm01_plnt_mt_crt_in", "size":24,"searchhelp":"H_T001L"});
		inputfield("G[New Material Classification Information]+[10,1]", 'Cost Center (Sanimex)', "G[New Material Classification Information]+[10,24]", {"name":"z_mm01_cc", "size":24,"searchhelp":"H_T001L"});

		/*************************************************
		***** Material Values (Accounting) Group Box *****
		**************************************************/
		box("G[Additional Data]+[13,0]","G[Additional Data]+[20,48]","Material Values (Accounting)");
		inputfield("G[Material Values (Accounting)]+[1,2]", 'Valuation Cat.', "G[Material Values (Accounting)]+[1,24]", {"name":"z_mm01_val_cat", "size":18,"searchhelp":"H_T149"});
		inputfield("G[Material Values (Accounting)]+[2,2]", 'Valuation Class', "G[Material Values (Accounting)]+[2,24]", {"name":"z_mm01_val_cls", "size":18,"searchhelp":"H_T025"});
		inputfield("G[Material Values (Accounting)]+[3,2]", 'Price Control Indicator', "G[Material Values (Accounting)]+[3,24]", {"name":"z_mm01_prc_ctrl_ind", "size":18,"techname":"MBEW-VPRSV"});
		inputfield("G[Material Values (Accounting)]+[4,2]", 'Price Unit', "G[Material Values (Accounting)]+[4,24]", {"name":"z_mm01_prc_unt", "size":18});
		inputfield("G[Material Values (Accounting)]+[5,2]", 'Mov. Avg Price/Period', "G[Material Values (Accounting)]+[5,24]", {"name":"z_mm01_prc_prd", "size":18});
		inputfield("G[Material Values (Accounting)]+[6,2]", 'Standard Price', "G[Material Values (Accounting)]+[6,24]", {"name":"z_mm01_std_prc", "size":18});


		/*****************************************************
		Existing Material Classification Information Group Box
		******************************************************/
		box("G[Material Values (Accounting)]+[1,52]","G[Material Values (Accounting)]+[18,100]","Existing Material Classification Information");
		text("G[Existing Material Classification Information]+[1,1]","Drawing Number",{"intensified":true});
		inputfield("G[Existing Material Classification Information]+[2,1]", {"name":"z_mm01_drw_nbr_01", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		text("G[Existing Material Classification Information]+[3,1]","Old Kholer Material Number",{"intensified":true});
		inputfield("G[Existing Material Classification Information]+[4,1]", {"name":"z_mm01_old_khlr_mat_nbr_01", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[5,1]", {"name":"z_mm01_old_khlr_mat_nbr_02", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[6,1]", {"name":"z_mm01_old_khlr_mat_nbr_03", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[7,1]", {"name":"z_mm01_old_khlr_mat_nbr_04", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[8,1]", {"name":"z_mm01_old_khlr_mat_nbr_05", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		text("G[Existing Material Classification Information]+[9,1]","Manufacturer Name",{"intensified":true});
		inputfield("G[Existing Material Classification Information]+[10,1]", {"name":"z_mm01_mfr_nm_01", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		text("G[Existing Material Classification Information]+[11,1]","Manufacturer part number",{"intensified":true});
		inputfield("G[Existing Material Classification Information]+[12,1]", {"name":"z_mm01_mfgr_pt_nbr_01", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[13,1]", {"name":"z_mm01_mfgr_pt_nbr_02", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[14,1]", {"name":"z_mm01_mfgr_pt_nbr_03", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[15,1]", {"name":"z_mm01_mfgr_pt_nbr_04", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[16,1]", {"name":"z_mm01_mfgr_pt_nbr_05", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});

		text("G[Existing Material Classification Information]+[1,26]","XREF Reference",{"intensified":true});
		inputfield("G[Existing Material Classification Information]+[2,26]", {"name":"z_mm01__ex_xref_01", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[3,26]", {"name":"z_mm01__ex_xref_02", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[4,26]", {"name":"z_mm01__ex_xref_03", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[5,26]", {"name":"z_mm01__ex_xref_04", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[6,26]", {"name":"z_mm01__ex_xref_05", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});

		text("G[Existing Material Classification Information]+[7,26]","Vendor Material Number",{"intensified":true});
		inputfield("G[Existing Material Classification Information]+[8,26]", {"name":"z_mm01_vndr_mat_nbr_01", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[9,26]", {"name":"z_mm01_vndr_mat_nbr_02", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[10,26]", {"name":"z_mm01_vndr_mat_nbr_03", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[11,26]", {"name":"z_mm01_vndr_mat_nbr_04", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[12,26]", {"name":"z_mm01_vndr_mat_nbr_05", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});

		text("G[Existing Material Classification Information]+[13,26]","Cost Center (Sanimex)",{"intensified":true});
		inputfield("G[Existing Material Classification Information]+[14,26]", {"name":"z_mm01_cc_01", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[15,26]", {"name":"z_mm01_cc_02", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
		inputfield("G[Existing Material Classification Information]+[16,26]", {"name":"z_mm01_cc_03", "nolabel":true, "readonly":true, "size":22,"searchhelp":"H_T001L"});
	} else{
		pushbutton([TOOLBAR], '@3C@Show Liquid UI Screen', {"process":toggleLiquidUI, using:{"l_set":"X"}});
	}
}