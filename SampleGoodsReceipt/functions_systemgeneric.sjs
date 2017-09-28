
function isBlank(jvar){
	return (jvar==""||jvar==null||jvar==void 0);
}

String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g,"");
}

function clear_values(tablename, columnArray, rows){	
	for (var loop = 0; loop < rows; loop++){
		for (var col=0; col<columnArray.length; col++){	
			tablename[columnArray[col]][loop] = "";
		}
	}	
}
	
function _listrows(sColumns,allrowsFlg,numRows,retFlag,retArr,headerRow){
    var dbg = false;
    var arColnames = sColumns.split(',');
	var arCols     = [];
    var iCol;
	if (headerRow == void 0 || isBlank(headerRow)){
		var iRowHeader = 1;
		} 
	else{
		var iRowHeader = headerRow;
		}
	var arColVals  = [];
	var returnArr=retArr.split(',');
	
    // for each passed in col titls,
    // determine abs cols
    for(iCol=0; iCol<arColnames.length; iCol++) {
		print('    '+arColnames[iCol]+'   ');
		for(rb=new Reebok([iRowHeader]);rb.pos.row==iRowHeader; rb=rb.nextSibling) {
			if(dbg) println('name=*'+rb.name.label+'*');
				if(arColnames[iCol] == rb.name.label){
					arCols[iCol] = rb.pos.col;
				}	
			}
		}
	println();
	println('00arCols='+arCols);
	var iRow = iRowHeader+2;
	var nRows;
	if(allrowsFlg==true|| numRows==0){
		nRows=_listlastvisiblerow;
		}
	else{
		nRows=numRows;
		}
    for(iLRow = _listfirstvisiblerow; iLRow<=nRows;iLRow++,iRow++) {
		var rec = {};
		var temp1="";
		// now we'll yield each record
		for(iCol=0; iCol<arCols.length; iCol++) {
			if(arCols[iCol] != void 0) {
				//println('obj at:'+iRow+' '+ arCols[iCol]);
				rec[ arColnames[iCol] ] = Reebok([iRow,arCols[iCol]]).name;
				temp=rec[arColnames[iCol]];
				rec.row = iLRow;
				//yield(rec);
				}
			println(arColnames[iCol]);
			for(var ii=0;ii<returnArr.length;ii++){
				println(returnArr[ii]);
				if(arColnames[iCol]==returnArr[ii]){
					println('--temp='+temp);
					temp=temp.substring(temp.lastIndexOf("@")+1,temp.length).trim();
					temp1+=temp+" ";
				}
			}
		}
		arColVals.push(temp1);
		println('----arColVals = '+ arColVals + '-');
	}
	
	if(retFlag){
		return arColVals;
		}
}

function readUserDefaults() {
		enter('/nsu3');	
	
	onscreen 'SAPLSUID_MAINTENANCE.1100'
		goto EXECUTE_DEFA;
	onscreen 'SAPLSUU5.0100'
		EXECUTE_DEFA:;
		enter('=DEFA');
		
	onscreen 'SAPLSUID_MAINTENANCE.1100'
		goto READ_DEFAULTS;
		
	onscreen 'SAPLSUU5.0100'
		READ_DEFAULTS:;
		
		if(<'F[SUID_ST_NODE_DEFAULTS-DCPFM]'>.isValid) {
			set('V[USERDECIMALFORMAT]','&F[SUID_ST_NODE_DEFAULTS-DCPFM]'); //Decimal notation
			set('V[USERDATEFORMAT]','&F[SUID_ST_NODE_DEFAULTS-DATFM]');	
		} else {
			set('V[USERDECIMALFORMAT]','&F[USDEFAULTS-DCPFM]'); //Decimal notation
			set('V[USERDATEFORMAT]','&F[USDEFAULTS-DATFM]');
		}
		USERDATEFORMAT = parseInt(USERDATEFORMAT.trim());
		switch(USERDATEFORMAT) {
			case 1: {set('V[USERDATEFORMATMSG]','DD.MM.YYYY');} break;
			case 2: {set('V[USERDATEFORMATMSG]','MM/DD/YYYY');} break;
			case 3:	{set('V[USERDATEFORMATMSG]','MM-DD-YYYY');} break;
			case 4: {set('V[USERDATEFORMATMSG]','YYYY.MM.DD');} break;
			case 5: {set('V[USERDATEFORMATMSG]','YYYY/MM/DD');} break;
			case 6: {set('V[USERDATEFORMATMSG]','YYYY-MM-DD');} break;
			default: {set('V[USERDATEFORMATMSG]','*INVALID*');} break;
		}		
		enter('/n');
}

//This Function converts the user decimal format in SAP to a general decimal format (xxxxxx.xx)
function decimalNotationFormat(numberFormat,number,nDec){
	var str = "";

	if(nDec == void 0)	// Default for number of decimal places
		nDec = 2;
		
	switch(numberFormat)
	{
	case 'X':
		{
			str = number.replace(/\,/g, '');		// Replace , with nothing
		}
		break;
	case 'Y':
		{
			str = number.replace(/\s+/g,'');		// Remove Blank Spaces
			str = str.replace(/\,/g, '.');			// Replace , with .
		}
		break;
	default:
		{
			str = number.replace(/\./g, '');		// Replace . with nothing
			str = str.replace(/\,/g, '.');			// Replace , with .
		}
		break;
	}
	return parseFloat(str.trim()).toFixed(3);
}

//This Function converts the general decimal format to user decimal format in SAP
function userSAPDecimalFormat(nStr,nSeparator){
	var str = nStr.split('.');
    var offset = str[0].length % 3;

	if(nSeparator == ' ')
		str[0] = str[0].substring(0, offset) + str[0].substring(offset).replace(/([0-9]{3})/g, ".$1");
	if(nSeparator == 'X')
		str[0] = str[0].substring(0, offset) + str[0].substring(offset).replace(/([0-9]{3})/g, ",$1");
	if(nSeparator == 'Y')
		str[0] = str[0].substring(0, offset) + str[0].substring(offset).replace(/([0-9]{3})/g, " $1");
	
	if(offset == 0) 
		str[0] = str[0].substring(0,str[0].length);

	if(nSeparator == 'Y' || nSeparator == ' ') {
		return str.join(',');
	} else {
		return str.join('.');
	}		
}	

//This Function assumes that the date output is in the format yyyymmdd from the FM call
function formatDate(dformat, ddate) {
	var str = "";
	var vdate = ddate.substring(6,8);
	var vmonth = ddate.substring(4,6);
	var vyear = ddate.substring(0,4);
	switch(dformat) 
	{
	case 1:
		{
			str = padString(vdate,2,PADDING_LEFT,"0") + "." + padString(vmonth,2,PADDING_LEFT,"0") + "." + vyear;
		}
		break;
		
	case 2:
		{
			str = padString(vmonth,2,PADDING_LEFT,"0") + "/" + padString(vdate,2,PADDING_LEFT,"0") + "/" + vyear;
		}
		break;

	case 3:
		{
			str = padString(vmonth,2,PADDING_LEFT,"0") + "-" + padString(vdate,2,PADDING_LEFT,"0") + "-" + vyear;
		}
		break;

	case 4:
		{
			str = vyear + "." + padString(vmonth,2,PADDING_LEFT,"0") + "." + padString(vdate,2,PADDING_LEFT,"0");
		}
		break;

	case 5:
		{
			str = vyear + "/" + padString(vmonth,2,PADDING_LEFT,"0") + "/" + padString(vdate,2,PADDING_LEFT,"0");
		}
		break;
		
	case 6:
		{
			str = vyear + "-" + padString(vmonth,2,PADDING_LEFT,"0") + "-" + padString(vdate,2,PADDING_LEFT,"0");
		}
		break;
	}

	return str;
}

function isValidDate(date,dformat){
	switch (dformat){
	case 1:
		var matches = /^(\d{2})[-\.](\d{2})[-\.](\d{4})$/.exec(date);
		if (matches == null) return false;
		else return true;
		break;
	case 2:
		var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
		if (matches == null) return false;
		else return true;
		break;
	case 3:
		var matches = /^(\d{2})-(\d{2})-(\d{4})$/.exec(date);
		if (matches == null){ return false;}
		else{  return true;}
		break;	
	case 4:
		var matches = /^(\d{4})[-\.](\d{2})[-\.](\d{2})$/.exec(date);
		if (matches == null) return false;
		else return true;
		break;
	case 5:
		var matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(date);
		if (matches == null) return false;
		else return true;
		break;
	case 6:
		var matches = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
		if (matches == null) return false;
		else return true;
		break;
	}		
}
