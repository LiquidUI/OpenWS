//Function to clear all variables
function setFlag(param){
	// bugprint(z_flag + " to " + param.flag);
	set("V[z_flag]", param.flag);


}
///////////////////////////////////////////////

//Function to navigate to create
function create(){
	bugprint("create FUNCTION");

	onscreen 'SAPLIQS0.0100'
	if(left_Col == 1){
		set("F[Notification type]", "M1");
	}
	else if(left_Col == 3){
		set("F[Notification type]", "M2");	
	}
	enter();
	
	set("V[z_flag]", "1");
	
}
///////////////////////////////////////////////

//Function to navigate to list_timeconf
function list_timeconf(param){
	bugprint("list_timeconf FUNCTION");
	
	set("V[z_check]", param.check);
	
	onscreen 'RI_ORDER_OPERATION_LIST.1000'
	//Breakdown
	if(left_Col == 1){
		set("F[Order Type]", "PM01");
	}
	//Preventive
	else if(left_Col == 2){
		set('F[Order Type]', 'PM03');
	}
	//Corrective
	else if(left_Col == 3){
		set('F[Order Type]', 'PM01');
	}
	//Capex
	else if(left_Col == 4){
		set('F[Order Type]', 'PM04');
	}
	//Any Orders
	else if(left_Col == 6){
		set('F[Order Type]', 'PM01')
		set('F[S_AUART-HIGH]', 'PM04');
	}
	
	if(!isBlank(z_default_funcloc)){
		set("F[Functional loc.]", "&V[z_default_funcloc]");
	}
	
	if(!isBlank(z_default_mainworkcenter)){
		set("F[Main work center]", "&V[z_default_mainworkcenter]");
	}
	
	if(left_Col == 2 || left_Col == 4) {
		set("F[Period]", "01.09.2013");
		set("F[Period to]", "31.10.2015");
	} else {
		set("F[Period]", "01.09.2015");
		set("F[Period to]", "31.10.2015");
	}
	enter('=S_TAB2');

	onscreen 'RI_ORDER_OPERATION_LIST.1000'
	
	if(!isBlank(z_default_planningplant)){
		set("F[Planning plant]", "&V[z_default_planningplant]");
	}
	
	if(param.check == "timeconf"){
		set("F[Status inclusive]", 'REL');
		set('F[Status exclusive]', 'CNF');
	}
	
	enter('/8');
	set("V[z_flag]", 1);

	onscreen 'RI_ORDER_OPERATION_LIST.1000'
		if(_message == "No objects were selected"){
			message("E:"+_message + ". Check your defaults.");
			enter("/n");
		}
		else{
			enter();
		}
		set("V[z_flag]", 1);
}
///////////////////////////////////////////////

//Function for debugging
function bugprint(str){
	println("---------------------------------------------------------");
	println(str);
	println("---------------------------------------------------------");
}
///////////////////////////////////////////////

//Function to Display Left Column
function leftCol(nav){
	
	
	box([5,0], [27,29], "");
	
	if(left_Col == 1){
		pushbutton([6,2], "@AF@Breakdown             ", {"size":[2,25]});
	}
	else{
		if(nav){
			pushbutton([6,2], "Breakdown             ", {"process":change_left_Col, "size":[2,25], "using":{"button":"1"}});	
		}
		else{
			pushbutton([6,2], "Breakdown             ", "/n",{ "process":change_left_Col, "size":[2,25], "using":{"button":"1"}});
		}
		
	}

	if(left_Col == 2){
		pushbutton([9,2], "@AF@Preventive            ", {"size":[2,25]});
	}
	else{
		if(nav){
			pushbutton([9,2], "Preventive                ", {"process":change_left_Col, "size":[2,25], "using":{"button":"2"}});	
		}
		else{
			pushbutton([9,2], "Preventive                ", "/n",{ "process":change_left_Col, "size":[2,25], "using":{"button":"2"}});
		}
		
	}

	if(left_Col == 3){
		pushbutton([12,2], "@AF@Corrective            ", {"size":[2,25]});
	}
	else{
		if(nav){
			pushbutton([12,2], "Corrective                ", {"process":change_left_Col, "size":[2,25], "using":{"button":"3"}});	
		}
		else{
			pushbutton([12,2], "Corrective                ", "/n",{ "process":change_left_Col, "size":[2,25], "using":{"button":"3"}});
		}
		
	}

	if(left_Col == 4){
		pushbutton([15,2], "@AF@Capex                 ", {"size":[2,25]});
	}
	else{
		if(nav){
			pushbutton([15,2], "Capex                     ", {"process":change_left_Col, "size":[2,25], "using":{"button":"4"}});	
		}
		else{
			pushbutton([15,2], "Capex                     ", "/n",{ "process":change_left_Col, "size":[2,25], "using":{"button":"4"}});
		}
	}

	if(left_Col == 5){
		pushbutton([18,2], "@AF@Spare Parts           ", {"size":[2,25]});
	}
	else{
		if(nav){
			pushbutton([18,2], "Spare Parts               ",{"process":change_left_Col, "size":[2,25], "using":{"button":"5"}});	
		}
		else{
			pushbutton([18,2], "Spare Parts               ", "/n",{ "process":change_left_Col, "size":[2,25], "using":{"button":"5"}});
		}
		
	}
	
	if(left_Col == 6){
		pushbutton([21,2], "@AF@All Orders                ", {"size":[2,25]});	
	}
	else{
			if(nav){
				pushbutton([21,2], "All Orders                ",{"process":change_left_Col, "size":[2,25], "using":{"button":"6"}});	
			}
			else{
				pushbutton([21,2], "All Orders                ", "/n",{ "process":change_left_Col, "size":[2,25], "using":{"button":"6"}});
			}
	}
	
	if(left_Col == 7){
		pushbutton([24,2], "@AF@Your Settings                ", {"size":[2,25]});
	}
	else{
		pushbutton([24,2], "Your Settings                ", "/nsu3", {"process":change_left_Col, "size":[2,25], "using":{"button":"7"}});			
	}
}
///////////////////////////////////////////////


//Function to change left_Col to the correct value
function change_left_Col(param){
	set("V[left_Col]", param.button);
	
	if(param.button != 7){
		goto FUNC_END;
	}
	
	//Juneau
	onscreen 'SAPLSUU5.0100'
		enter("=PARAM");
		set("V[z_flag]", 1); //incase it skips the next onscreen and doesnt reach FUNC_END;
	//Helios
	onscreen 'SAPLSUID_MAINTENANCE.1100'
		enter('=PARAM');
		
FUNC_END:;
	set("V[z_flag]", 1);
}
///////////////////////////////////////////////

//Function to load the defaults
function paramLoad(){
	
	bugprint("LOADING PARAMETERS");
	println('------------------------------------------:' + _user.trim() + ':');
	//Use call method
	
	rfcResult = call("BAPI_USER_GET_DETAIL", {"in.USERNAME":_user.trim(),"table.PARAMETER(width:3000)":"z_parameters", "currentuser":true});
	
	if(!isBlank(rfcResult.exception)){
		message("E: " + rfcResult.exception +" Defaults did not load.");
		goto FUNC_END;
	}
	else if (isBlank(z_parameters)){
		message("E: Defaults did not load.");
		goto FUNC_END;
	}
	
	for(i=0; i<z_parameters.length; i++){
		var curr = z_parameters[i].toString();
		//println("PARID: "+  curr.substring(0,20) + " PARVA: "+ curr.substring(20,38));
		
		if(curr.substring(0,20).trim() == "IFL"){
			set("V[z_default_funcloc]", curr.substring(20,38).trim());
			// bugprint("Set funcloc to " +  curr.substring(20,38).trim());
		}
		else if(curr.substring(0,20).trim() == "VAP"){
			set("V[z_default_mainworkcenter]", curr.substring(20,38).trim());
			// bugprint("Set mainwork center to " +  curr.substring(20,38).trim());			
		}
		else if(curr.substring(0,20).trim() == "IWK"){
			set("V[z_default_planningplant]", curr.substring(20,38).trim());
			// bugprint("Set planningplant to " +  curr.substring(20,38).trim());			
		}
		else if(curr.substring(0,20).trim() == "GSB"){
			set("V[z_default_businessarea]", curr.substring(20,38).trim());
			// bugprint("Set businessarea to " +  curr.substring(20,38).trim());			
		}
		else if(curr.substring(0,20).trim() == "WRK"){
			set("V[z_default_plant]", curr.substring(20,38).trim());
			// bugprint("Set plant to " +  curr.substring(20,38).trim());			
		}
			
	}
	FUNC_END:;
	
	set("V[initial_load]", 1);
//	message("S: Parameters loaded");
	enter("?");
}
///////////////////////////////////////////////

//Function to Select an Order
function selectList(){
	//clear the M1 Flag
	set("V[m1Flag]", "");
	
	bugprint("Entered this function");
	onscreen 'SAPLCOIH.3000'
		//If Notification exists, load the data
		set("V[temp]", "&F[Notifctn]");
		if(isBlank(temp)){
			goto NO_NOTIF;
		}
		enter('=IHOM');
	onscreen "SAPLIQS0.7200"
		set("V[z_change_date1]", "&F[Notif.date]");
		set("V[z_change_date2]", "&F[VIQMEL-MZEIT]");
		
		set("V[z_change_damagecode1]", "&F[VIQMFE-FEGRP]");
		set("V[z_change_damagecode2]", "&F[VIQMFE-FECOD]");
		set("V[z_change_damagecode3]", "&F[RIWO00-TXTCDFE]");
		
		set("V[z_change_causecode1]", "&F[VIQMUR-URGRP]");
		set("V[z_change_causecode2]", "&F[VIQMUR-URCOD.2]");
		set("V[z_change_causecode3]", "&F[RIWO00-TXTCDUR]");
		
		set("V[temp]", "&F[VIQMEL-QMART]");
		if(temp == "M1"){//Display the Breakdown start and end
			set("V[m1Flag]", 1);
			goto M1_TRUE;
		}
		else{
			set("V[m1Flag]", "");
			goto M1_NOTTRUE;
		}
		
	
M1_TRUE:;
	enter('=10\\TAB05');
	onscreen 'SAPLIQS0.7200'
		set("V[z_change_breakdownstart1]", "&F[Malfunction start]");
		set("V[z_change_breakdownstart2]", "&F[Start Malfn (T)]");
		set("V[z_change_breakdownend1]", "&F[Malfunction end]");
		set("V[z_change_breakdownend2]", "&F[Malfunctn End (Time)]");
		goto FUNC_END;
		
M1_NOTTRUE:;
	enter('=10\\TAB02');
	onscreen 'SAPLIQS0.7200'
		set("V[z_change_requiredstart1]", "&F[VIQMEL-STRMN]");
		set("V[z_change_requiredstart2]", "&F[VIQMEL-STRUR]");
		set("V[z_change_requiredend1]", "&F[VIQMEL-LTRMN]");
		set("V[z_change_requiredend2]", "&F[VIQMEL-LTRUR]");
		goto FUNC_END;

FUNC_END:;
	enter("/3")
	onscreen 'SAPLCOIH.3000'
NO_NOTIF:;
	bugprint("GOT HERE");
	enter();	
	set("V[z_flag]", 1);
	
	
	
}
///////////////////////////////////////////////

//Function to Select a Time Conf
function selectTimeConf(){
	
	//If the Status Management: Confirm Transaction screen occurs
	onscreen 'SAPLCO01.0300'
		enter('=OPT2');
	
	//If Status Management: Confirm Order "The business transaction cannot be carried out"
	onscreen 'SAPLCO01.0400'
		enter('=OPT2');
	onscreen 'SAPLCORU.3000'
		enter("/3");
		message("E: The business transaction cannot be carried out");
	
	
	//Load the FuncLoc, Equipment, Description
	onscreen 'SAPLCORU.3200'
		enter("/5")
	//If need to create a new notificaiton else this will skip
	onscreen 'SAPLIWOL.0102'
		set("F[Notifictn Type]", "m2");
		enter();
	onscreen 'SAPLSBAL_DISPLAY.0120'
		enter();
	onscreen 'SAPLIQS0.7200'
		set("V[z_timeconf_area1]", "&F[Functional loc.]");
		set("V[z_timeconf_area2]", "&F[RIWO1-PLTXT]");
		set("V[z_timeconf_equip1]", "&F[Equipment]");
		set("V[z_timeconf_equip2]", "&F[RIWO1-EQTXT]");
		set("V[z_timeconf_desc]", "&F[VIQMEL-QMTXT]");
		enter("/3");

}
///////////////////////////////////////////////