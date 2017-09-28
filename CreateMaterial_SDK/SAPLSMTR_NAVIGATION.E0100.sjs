////////////////////////////////////////////////////////////////////////////////////////////
//Project: PDF Form Input
//Developed By: Synactive, Inc.
//File Version: 1.0
//File Purpose: 'Z' Transaction on which PDF Form is defined (GuiXT Front End Interface)
//Match pdffield in the miscobject with field name in PDF
////////////////////////////////////////////////////////////////////////////////////////////

function setMM01Defaults() {
	z_mm01_industry_sector = 'M';
	z_mm01_material_type = 'FERT';
	z_mm01_plant = '1000';
	z_mm01_storloc = '0001';
	z_mm01_matdesc = 'Liquid UI Material';
	z_mm01_uom = 'EA';
	z_mm01_matgrp = '0001';

	z_mm01_purchgrp = '001';
	z_mm01_mrptype = 'ND';
	z_mm01_mrpcontroller = '001';
	z_mm01_prodstorloc = '0001';
	z_mm01_planneddelivtime = '1';
	z_mm01_schedmarginkey = '000';
	z_mm01_availcheck = '01';

	z_mm01_price_unit = '1';
	z_mm01_price_control = 'S';
	z_mm01_standard_price = '110';
	z_mm01_moving_price = '100';
	z_mm01_valuation_class = '7920';
	
}


title('Create Material');
del('X[IMAGE_CONTAINTER]');
delScreenElements();
setMM01Defaults();
inputfield([1,1], "Industry sector", [1,20], {"name":"z_mm01_industry_sector", "size":1});

inputfield([2,1], "Material Type", [2,20], {"name":"z_mm01_material_type", "size":4});

onUIEvents["Enter"] = {"process":mm01_DisableEnter, "using":{"l_event":"/0"}, "fcode":"/0"};

box([0,0], [3,64], "Create Material");

box([4,0], [7,64], "Organizational levels");
inputfield([5,1], "Plant", [5,20], {"name":"z_mm01_plant", "size":4, "techname":"RMMG1-WERKS"});
inputfield([6,1], "Stor. Location", [6,20], {"name":"z_mm01_storloc", "size":4, "techname":"RMMG1-LGORT", "required":false});

box([8,0], [12,64], "Basic data 1");
inputfield([9,1], "Description", [9,20], {"name":"z_mm01_matdesc", "size":40, "required":false});
inputfield([10,1], "UoM", [10,20], {"name":"z_mm01_uom", "size":3, "techname":"MARA-MEINS", "required":false});
inputfield([11,1], "Mat. Group", [11,20], {"name":"z_mm01_matgrp", "size":9, "techname":"MARA-MATKL", "required":false});

box([13,0], [16,64], "Purchasing");
inputfield([14,1], "Purchasing group", [14,20], {"name":"z_mm01_purchgrp", "size":3, "techname":"MARC-EKGRP"});
inputfield([15,1], "Mfr Part Number", [15,20], {"name":"z_mm01_mfrpartno", "size":37});

box([17,0], [20,64], "MRP 1");
inputfield([18,1], "MRP Type", [18,20], {"name":"z_mm01_mrptype", "size":2, "techname":"MARC-DISMM", "required":false});
inputfield([19,1], "MRP Controller", [19,20], {"name":"z_mm01_mrpcontroller", "size":3, "techname":"MARC-DISPO", "required":false});
	
box([0,66], [4,128], "MPR 2");
inputfield([1,67], "Product stor. loc.", [1,86], {"name":"z_mm01_prodstorloc", "size":4, "techname":"MARC-LGPRO"});
inputfield([2,67], "Planned Deliv. Time", [2,86], {"name":"z_mm01_planneddelivtime", "size":3});
text([2,92], "days");
inputfield([3,67], "SchedMargin key", [3,86], {"name":"z_mm01_schedmarginkey", "size":3, "techname":"MARC-FHORI"});

box([5,66], [7,128], "MPR 3");
inputfield([6,67], "Availablility check", [6,86], {"name":"z_mm01_availcheck", "size":2, "techname":"MARC-MTVFP"});

box([8,66], [10,128], "Plant data / stor. 1");
inputfield([9,67], "Storage Bin", [9,86], {"name":"z_mm01_storagebin", "size":10});

box([11,66], [13,128], "Plant data / stor. 2");
inputfield([12,67], "Profit Center", [12,86], {"name":"z_mm01_profitcenter", "size":10, "required":false});

box([14,66], [20,128], "Accounting 1");
inputfield([15,67], "Price Unit", [15,86], {"name":"z_mm01_price_unit", "size":15});
inputfield([16,67], "Price Control", [16,86], {"name":"z_mm01_price_control", "size":15});
inputfield([17,67], "Standard Price", [17,86], {"name":"z_mm01_standard_price", "size":15});
inputfield([18,67], "Moving Price", [18,86], {"name":"z_mm01_moving_price", "size":15});
inputfield([19,67], "Valuation Class", [19,86], {"name":"z_mm01_valuation_class", "size":15});

pushbutton([21,45], "@2L@Submit", "/nmm01",{"size":[3,40],"process":mm01CreateMaterial});
	

function delScreenElements(){
	for (a = firstChild; a!=null ; a=a.nextSibling) 
		a.del();
}
	
function isBlank(jvar) {
    if (jvar== void 0 || jvar=="" || jvar==null) {
       return true;
    } else {
       return false;
    }	

}

function mm01CreateMaterial() {

onscreen 'SAPLMGMM.0060'
	set('F[Industry sector]','&V[z_mm01_industry_sector]');
	set('F[Material Type]','&V[z_mm01_material_type]');
	enter('/5');
	
	onscreen 'SAPLMGMM.0070'
		enter('=RESA');
	
	// Create Material (Initial Screen)
	onscreen 'SAPLMGMM.0070'
		enter('=SELA');	//select all

	onscreen 'SAPLMGMM.0070'		
		enter('=SCHL');
	
	// Create Material (Initial Screen)
	onscreen 'SAPLMGMM.0080'
		set('F[Plant]', '&V[z_mm01_plant]');
		set('F[Stor. Location]', '&V[z_mm01_storloc]');
		println('-------inside plant----');
		enter();
	
	//Popup Message Error
	onscreen 'SAPMSDYP.0010'
		set('V[z_mm01_message]', "&[0,0]");
		if(z_mm01_message.indexOf("Error") != -1) {
			set('V[z_mm01_message]', "&[0,5]");
		}
		enter();
	
		// Create Material (Initial Screen)
	onscreen 'SAPLMGMM.0080'
		if(z_mm01_message) {
			message('E: ' + z_mm01_message + ' (Organizational levels)');
			enter('/12');
			goto FUNC_END
		}
		enter();
		
	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4004'
		println('-------inside basic data 1---%-'+z_mm01_movingprice);
	
		set('F[MAKT-MAKTX]', '&V[z_mm01_matdesc]');
		set('F[Base Unit of Measure]', '&V[z_mm01_uom]');
		set('F[Material Group]', '&V[z_mm01_matgrp]');
	//	set('F[Division]', '&V[z_mm01_division]');
	//	enter('=SP09');
		enter();
	
	onmessage
	if(!isBlank(_message)){
			if(_message.indexOf("E:") != -1) {
				message(_message + ' (Basic Data 1)');		
				enter('/nmm01');
				//goto FUNC_END
			} else {
				enter();
			}
		}	

		

	onscreen 'SAPLMGMM.4004'
	println('-------------------\n\n---');
		enter('=SP04');


	onscreen 'SAPLMGMM.4000'
	println('-------------------\n\n---');
		set('cell[TABLE,Tax classification,1]', '1');
		enter('=SP06');

	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4000'
	println('-------------------\n\n---');
		set('F[Trans. Grp]','0001');
		set('F[LoadingGrp]','0001');
		enter('=SP09');

	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4000'
		println('-------inside Purchasing----');
		set('F[Purchasing Group]', '&V[z_mm01_purchgrp]');
	//	set('F[Purchasing value key]', '&V[z_mm01_purchvaluekey]');
		set('F[Mfr Part Number]', '&V[z_mm01_mfrpartno]');
		enter('=SP12');
		
			onmessage
		if(!isBlank(_message)){
			if(_message.indexOf("E:") != -1) {
				message(_message + ' (Purchasing)');		
				enter('/nmm01');
				//goto FUNC_END
			} else {
				enter();
			}
		}
		
	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4000'
		println('-------inside MRP1----');
		set('F[MRP Type]', '&V[z_mm01_mrptype]');
		set('F[MRP Controller]', '&V[z_mm01_mrpcontroller]');
		println('-------just before enter.... \n');
		enter();
		onmessage
		if(!isBlank(_message)){
			if(_message.indexOf("E:") != -1) {
				message(_message + ' (MRP 1)');		
				enter('/nmm01');
				//goto FUNC_END
			} else {
				enter();
			}
		}
		
	onscreen 'SAPLMGMM.4000'	
		enter('=SP13');
				
		onmessage
		if(!isBlank(_message)){
			if (_message.indexOf("E:") != -1) {
				message(_message + ' (MRP 1)');		
				enter('/nmm01');
				goto FUNC_END
			} 
		}	

	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4000'
		println('-------inside MRP2----');
		set('F[Prod. stor. location]', '&V[z_mm01_prodstorloc]');
		set('F[Planned Deliv. Time]', '&V[z_mm01_planneddelivtime]');
		set('F[SchedMargin key]', '&V[z_mm01_schedmarginkey]');
		enter('=SP14');

	onmessage
		if(!isBlank(_message)){
			if(_message.indexOf("E:") != -1) {
				message(_message + ' (MPR 2)');		
				enter('/nmm01');
				//goto FUNC_END
			} else {
				enter();
			}
		}
		//enter();
		
	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4000'
		println('-------inside MRP3----');
		set('F[Availability check]', '&V[z_mm01_availcheck]');
		enter('=SP16');

	onmessage
		if(!isBlank(_message)){
			if(_message.indexOf("E:") != -1) {
				message(_message + ' (MPR 3)');		
				enter('/nmm01');
				//goto FUNC_END
			} else {
				enter();
			}
		}
		//enter();

	onscreen 'SAPLMGMM.4000'
		println('-------inside Forecast Model----');
		set('F[Forecast model]', 'D');
		enter('=SP18');

	onscreen 'SAPLMGMM.4000'
		println('-------inside MRP3----');
		set('F[Task list usage]', '000');
		enter('=SP19');

	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4000'
		println('-------inside plant 1----');
		set('F[Storage Bin]', '&V[z_mm01_storagebin]');
		enter('=SP20');
	
	onmessage
		if(!isBlank(_message)){
			if(_message.indexOf("E:") != -1) {
				message(_message + ' (Plant data/stor.1)');		
				enter('/nmm01');
				//goto FUNC_END
			} else {
				enter();
			}
		}
		//enter();
		
	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4000'
		println('-------inside plant 2----');
		set('F[Profit Center]', '&V[z_mm01_profitcenter]');
		enter('=SP24');
	
	onmessage
		if(!isBlank(_message)){
			if(_message.indexOf("E:") != -1) {
				message(_message + ' (Plant data/stor.2)');		
				enter('/nmm01');
				//goto FUNC_END
			} else {
				enter();
			}
		}
		//enter();
	
	// Create Material 50179042 (Production Eng. spares)
	onscreen 'SAPLMGMM.4000'
		println('-------inside accounting 1----');
		set('F[Price Unit]', '&V[z_mm01_price_unit]');
		set('F[Price control]', '&V[z_mm01_price_control]');
		set('F[Standard price]', '&V[z_mm01_standard_price]');
		set('F[Moving price]', '&V[z_mm01_moving_price]');
		set('F[Valuation Class]', '&V[z_mm01_valuation_class]');
		//set("V[z_mm01_*]", "");
		enter("/11");
	
	onmessage
	println('------inside onmessage block after accounting 1');
		set("V[z_mm01_message]", _message);
		if(!isBlank(_message)){
			if(_message.indexOf("E:") != -1) {
				message(_message + ' (Accounting 1)');		
				enter('/nmm01');
				//goto FUNC_END
			} else {
				enter();
			}
		}
		
		onscreen 'SAPLMGMM.0060'
	println('------inside SAPLMGMM.0060');
			message('S: '+_message);
			enter('/n');
		
		onscreen 'SAPLSPO1.0300'
			enter("=YES");
			
	
	FUNC_END:{
	onscreen 'SAPLMGMM.0070'
		enter('/12');
	}
}
