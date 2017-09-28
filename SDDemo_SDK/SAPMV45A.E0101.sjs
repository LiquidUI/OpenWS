/********************************************************************************************************
								Designed by : Adarsh Kesireddy
								Modified on : 12/10/2014
********************************************************************************************************/

if(_transaction == 'VA01'){	
	boxsize("G[TEXT]", [5,61]);
	del("F[VBAK-VKBUR]",{ "triple":true});
	del("F[RV45A-TXT_AUART]",{ "triple":true});
	del("F[VBAK-VKGRP]",{ "triple":true});
	del("P[/5]");	// Sales
	del("P[/6]");	// Item Overview
	del("P[/7]");	// Ordering party
	del("P[/8]");	// Create with reference

	set('V[z_va01_ordertype]','&F[VBAK-AUART]');
	if(isBlank(z_va01_ordertype))
		set('F[VBAK-AUART]','OR');
	
	pushbutton([TOOLBAR],"@2M@Back",'/3');
	
	box([0,0], [3,79], "Order Type");
	radiobutton("F[RV45A-TXT_AUART]+[0,0]", "Standard Order",{ "F[VBAK-AUART]":"OR"});
	radiobutton("F[RV45A-TXT_AUART]+[0,18]", "Sample Order",{ "F[VBAK-AUART]":"FD"});
	radiobutton("F[RV45A-TXT_AUART]+[0,34]", "Consignment Fill-up",{ "F[VBAK-AUART]":"KB"});
	radiobutton("F[RV45A-TXT_AUART]+[0,58]", "Request for RMA",{ "F[VBAK-AUART]":"ZREQ"});
	
	box([9,0], [14,79], "Details");

	set('F[VBAK-VKORG]','1000');
	set('F[VBAK-VTWEG]','10');
	set('F[VBAK-SPART]','00');

	z_va01_sold_to_party = '1460';
	z_va01_ship_to_party = '1460';
	z_va01_po_number = '123456';

	inputfield("F[RV45A-TXT_AUART]+[8,0]","Sold-to Party","F[RV45A-TXT_AUART]+[8,20]",{"name":"z_va01_sold_to_party","size":10,"searchhelp":"DEBI"});
	inputfield("F[RV45A-TXT_AUART]+[9,0]","Ship-to Party","F[RV45A-TXT_AUART]+[9,20]",{"name":"z_va01_ship_to_party","size":10,"searchhelp":"DEBI"});
	inputfield("F[RV45A-TXT_AUART]+[10,0]","Purchase Order Number","F[RV45A-TXT_AUART]+[10,20]",{"name":"z_va01_po_number","size":35});
	inputfield("F[RV45A-TXT_AUART]+[11,0]","Purchased Date","F[RV45A-TXT_AUART]+[11,20]",{"name":"z_va01_po_date","size":10,"numerical":true,"date":true});
	
	onUIEvents['Enter']={"process":va01OnEnter}
}
