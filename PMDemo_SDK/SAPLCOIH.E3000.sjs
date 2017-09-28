﻿// Generated by Synactive Designer Version 2, 11, 210, 0
// Description:Edited by ACHIRAG
/////////////////////////////////////////////////////////////////////////////////////
// CHANGE LIST
/////////////////////////////////////////////////////////////////////////////////////


if(z_flag == 1){

	del('M[/3]');
	del('M[/12]');
	del('M[/15]');

	
	onUIEvents["/n*"] = {"process":setFlag, "using":{"flag":0}};

	//Delete Pushbuttons
	del("P[Schedule]");
	del("P[Determine costs]");
	del("P[Material availability, overall]");
	del("P[Paging/communication]");
	del("P[Complete (technically)]");
	del("P[Settlement rule]");
	del("P[Document flow]");
	del("P[Maintenance object address]");
	del("P[Permits...]");
	del("P[Notification]");
	del("P[Complete (business)]");

	if(<'P[Set user status]'>.isValid) {
		del('F[CAUFVD-ASTTX]');
		del('P[Set user status]');
	}
	
	if(<"P[Release]">.isValid){
		del("P[Release]");
	}
	if(<"P[Put in process...]">.isValid){
		del("P[Put in process...]");
	}
	if(<"P[No WC Application is Assigned]">.isValid){
		del("P[No WC Application is Assigned]");
	}
	if(<"P[Hide long text window]">.isValid){
		del("P[Hide long text window]");
	}
	if(<"P[WC Application]">.isValid){
		del("P[WC Application]");
	}
	if(<"P[Check for Maintenance Cost Budgeting]">.isValid){
		del("P[Check for Maintenance Cost Budgeting]");
	}
	if(<"P[Change]">.isValid){
	}
	if(<"P[Disconnect]">.isValid){
	}
	if(<"P[Change WCM Operations]">.isValid){
		del("P[Change WCM Operations]");
	}

	if(<"F[CAUFVD-UII]">.isValid){
		del("F[CAUFVD-UII]");
	}
	if(<"P[Copy Estimated Costs from Planned Costs]">.isValid){
			del("P[Copy Estimated Costs from Planned Costs]");
	}
		if(<"P[Functional Location Docs]">.isValid){
			del("P[Functional Location Docs]");
	}
	if(<"P[Change]">.isValid){
		del("P[Change]");
	}
	if(<"P[Disconnect]">.isValid){
		del("P[Disconnect]");
	}
	if(<"P[Text]">.isValid){
		del("P[Text]");
	}
	if(<"P[Equipment Documents]">.isValid){
		del("P[Equipment Documents]");
	}

	noscrollbar({"removeall":true});

	// Set nav to false, letting the Left Column buttons know 
	// What to do if they are clicked
	nav = false;
	// To display the Left Column
	leftCol(nav);

	//To display the Top Row
	box([5,32], [9,130], "");

	//Breakdown or Corrective
	if(left_Col == 1 || left_Col == 3){
		pushbutton([6,38], "Create          ", "/niw21",{ "process":create, "size":[2,15]});
	}

	pushbutton([6,60], "@AF@Change      ",{ "size":[2,15]});
	pushbutton([6,82], "List            ", "/niw37n",{ "process":list_timeconf, "size":[2,15], "using":{"check":"list"}});
	pushbutton([6,104], "Time Confirmation", "/niw37n",{ "process":list_timeconf, "size":[2,15], "using":{"check":"timeconf"}});

	image([0,0], "banner.jpg",{ "start":"http://www.guixt.com", "transparent":true});

	//Changing the Header Data Tab to Order Number
	if(_title.indexOf("Order") != -1){
		set("V[newtext]", "&V[_title]", {"search":"Order"});
	}
	else{
		set("V[newtext]", "&V[_title]", {"search":"Maintenance"});
	}
	newtext = newtext.substring(0, newtext.length-1);
	bugprint(newtext);
	text("P[HeaderData]", newtext);


	del("P[Operations]");
	del("P[Components]");
	del("P[Costs]");
	del("P[Partner]");
	del("P[Objects]");
	del("P[Addit. Data]");
	del("P[Location]");
	del("P[Planning]");
	del("P[Control]");
	del("P[StructureList]");
	del("P[Previous...]");
	del("P[Create]");
	del("P[Display addresses]");
	del("P[Object Info...]");
	del("P[Status]");
	del("P[Create text]");
	del("P[Show long text window]");
	del("P[Show further scheduling data]");
	del("P[Additional Data]");

	del("G[First operation]");
	del("G[Reference object]",{ "box":true});
	del("G[Dates]",{ "box":true});
	del("G[Person responsible]");

	del("F[Notifctn]");
	del("#[0,16]");
	del("F[Assembly]",{ "triple":true});
	del("F[Address]");
	del("F[Costs]",{ "triple":true});
	del("F[SystCond.]",{ "triple":true});
	del("F[Bsc start]");
	del("F[Basic fin.]");
	del("F[Revision]",{ "triple":true});

	pos("S[TS_1100]", [10,32]);
	box([12,33], [21,141], "");

	pos("F[Order]", [13,36],{ "text":true});
	pos("F[Order]", [13,55],{ "value":true});
	text("F[Order]", "WO Classification",{ "text":true});

	pos("F[Func. Loc.]", [14,36],{ "triple":true});
	pos("F[RIOT-PLTXT]", [14,70]);
	text("F[Func. Loc.]", "Area",{ "triple":true});
	
	pos("F[Equipment]", [15,36],{ "triple":true});
	pos("F[RIOT-EQTXT]", [15,70]);

	text([16,36], "Description",{ "size":14});
	pos("#[0,32]", [16,47]);

	pos("F[PMActType]", [17,36],{ "triple":true});

	inputfield( [18,36], "Damage Code", [18,50],{ "name":"z_change_damagecode1", "size":8});
	inputfield([18,59],{ "name":"z_change_damagecode2", "size":4, "NoLabel":true, "nolabel":true});
	pushbutton([18,64], "@13@",{ "process":getCode, "using":{"type":"damage"}});
	if(!isBlank(z_change_damagecode3)){
		text([18,70], "&V[z_change_damagecode3]",{ "size":24});
	}
	
	inputfield( [19,36], "Cause Code", [19,50],{ "name":"z_change_causecode1", "size":8});
	inputfield([19,59],{ "name":"z_change_causecode2", "size":4, "NoLabel":true, "nolabel":true});
	pushbutton([19,64], "@13@",{ "process":getCode, "using":{"type":"cause"}});
	if(!isBlank(z_change_causecode3)){
		text([19,70], "&V[z_change_causecode3]",{ "size":23});
	}
	
	inputfield( [13,92], "Date", [13,108],{ "name":"z_change_date1", "size":10,  "date":true});
	inputfield([13,121],{ "name":"z_change_date2", "size":8, "NoLabel":true, "nolabel":true, "techname":"VIQMEL-MZEIT"});
	inputfield( [14,92], "Equip. Condition", [14,108],{ "name":"z_change_equipcond", "size":10});

	pos("F[Sys.Status]", [15,92]);
	text("F[Sys.Status]", "WO Status",{ "text":true});

	pos("F[Priority]", [16,92],{ "text":true});
	pos("F[Priority]", [16,108],{ "value":true});

	box([22,33], [29,141], "");
	text([22,34], "Comments",{ "size":20, "intensified":true});
	//pos("X[LTEXT]", {"field":"S[TS_1100]", "offset":[15,37]});
	pos("X[LTEXT]", [23,34]);
	
	if(!isBlank(m1Flag)){ //An M1 Notification
		inputfield([17,92],"Breakdown Start", [17,108], { "name":"z_change_breakdownstart1", "size":10,  "date":true});
		inputfield([17,121],{ "name":"z_change_breakdownstart2", "size":8, "NoLabel":true, "nolabel":true, "techname":"VIQMEL-AUZTV"});
		inputfield([18,92],"Breakdown End", [18,92], { "name":"z_change_breakdownend1", "size":10 , "date":true});
		inputfield([18,121],{ "name":"z_change_breakdownend2", "size":8, "NoLabel":true, "nolabel":true,  "techname":"VIQMEL-AUZTB"});
	}
	else{
		inputfield([17,92],"Required Start", [17,108], { "name":"z_change_requiredstart1", "size":10,  "date":true});
		inputfield([17,121],{ "name":"z_change_requiredstart2", "size":8, "NoLabel":true, "nolabel":true,"techname":"VIQMEL-STRUR" });
		inputfield([18,92],"Required End", [18,108], { "name":"z_change_requiredend1", "size":10,  "date":true});
		inputfield([18,121],{ "name":"z_change_requiredend2", "size":8, "NoLabel":true, "nolabel":true, "techname":"VIQMEL-LTRUR"});
	}
	pushbutton([19,104], "@01@Save          ",{ "process":save_changes, "size":[2,17]});
}

function getCode(param){
	
	// This function will retrieve the Damage/Cause Code screen
	
	bugprint("GOT IN THIS FUNCTION");
	onscreen 'SAPLCOIH.3000'
		enter("=IHOM");
	//If there isn't a notification
	onscreen 'SAPLIWOL.0102'
		set('F[Notifictn type]', 'm2');
		enter();
	onscreen 'SAPLIQS0.7200'
		if(param.type == "damage"){
			setcursor("F[Damage]");
		}
		else if(param.type == "cause"){
			setcursor("F[Cause code]");
		}

		enter("/4)");

	onscreen 'SAPLIQS0.7200'
		if(param.type == "damage"){
			set("V[z_change_damagecode1]", "&F[VIQMFE-FEGRP]");
			set("V[z_change_damagecode2]", "&F[VIQMFE-FECOD]");
			set("V[z_change_damagecode3]", "&F[RIWO00-TXTCDFE]");
		}

		else if(param.type == "cause"){
			set("V[z_change_causecode1]", "&F[VIQMUR-URGRP]");
			set("V[z_change_causecode2]", "&F[VIQMUR-URCOD.2]");
			set("V[z_change_causecode3]", "&F[RIWO00-TXTCDUR]");
		}

		enter("/3");

}

function save_changes(){
	
	//This function saves the changes made to the order
	
	onscreen 'SAPLCOIH.3000'
		enter("=IHOM");

		onmessage
			if(_message.substring(0,2) == "E:"){
				message("E:"+_message);
				enter("?");
				goto FUNC_END;
			}

	//If there isn't a notification
	onscreen 'SAPLIWOL.0102'
		set('F[Notifictn type]', 'm2');
		enter();

	onscreen 'SAPLIQS0.7200'

		set("F[VIQMEL-QMDAT]", "&V[z_change_date1]");
		set("F[VIQMEL-MZEIT]", "&V[z_change_date2]");

		set("F[VIQMFE-FEGRP]", "&V[z_change_damagecode1]");
		set("F[VIQMFE-FECOD]", "&V[z_change_damagecode2]");

		set("F[VIQMUR-URGRP]", "&V[z_change_causecode1]");
		set("F[VIQMUR-URCOD.2]", "&V[z_change_causecode2]");

		if(!isBlank(m1Flag)){//M1 Notification
			//Take me to Malfunction Tab
			enter('=10\\TAB05');
		}
		else{
			//Take me to Reference Object Tab
			enter('=10\\TAB02')
		}


		onscreen 'SAPLIQS0.7200'
			if(_message.substring(0,2) == "E:" || _message.substring(0,2) == "W:"){
				set("F[VIQMEL-QMDAT]", "");
				set("F[VIQMEL-MZEIT]", "");

				set("F[VIQMFE-FEGRP]", "");
				set("F[VIQMFE-FECOD]", "");

				set("F[VIQMUR-URGRP]", "");
				set("F[VIQMUR-URCOD.2]", "");

				enter("/3")
				message("E: "+_message);
				goto FUNC_END;
			}


			if(!isBlank(m1Flag)){//M1 Notification
				set("F[Malfunction start]", "&V[z_change_breakdownstart1]");
				set("F[Start Malfn (T)]", "&V[z_change_breakdownstart2]");
				set("F[Malfunction end]", "&V[z_change_breakdownend1]");
				set("F[Malfunctn End (Time)]", "&V[z_change_breakdownend2]");
			}
			else{
				set("F[VIQMEL-STRMN]", "&V[z_change_requiredstart1]");
				set("F[VIQMEL-STRUR]", "&V[z_change_requiredstart2]");
				set("F[VIQMEL-LTRMN]", "&V[z_change_requiredend1]");
				set("F[VIQMEL-LTRUR]", "&V[z_change_requiredend2]");
			}

			enter('=COAE');

			onmessage
				if(_message.substring(0,2) == "E:" || _message.substring(0,2) == "W:"){
					bugprint("MADE IT IN HERE");
					if(!isBlank(m1Flag)){//M1 Notification
						set("F[Malfunction start]", "");
						set("F[Start Malfn (T)]", "");
						set("F[Malfunction end]", "");
						set("F[Malfunctn End (Time)]", "");
					}
					else{
						set("F[VIQMEL-STRMN]", "");
						set("F[VIQMEL-STRUR]", "");
						set("F[VIQMEL-LTRMN]", "");
						set("F[VIQMEL-LTRUR]", "");
					}

					enter("/3");
					message("E: "+_message);
					goto FUNC_END;
				}

			onscreen 'SAPLCOIH.3000'
				enter("/11");
				set("V[z_change*]");

FUNC_END:;

}

