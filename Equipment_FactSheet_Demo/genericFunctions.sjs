
// Function to trim blank spaces at the end of the string
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,'');}

// Function to check if the string value is blank
function isBlank(jvar){
	if(typeof jvar == 'string') {
		jvar = jvar.trim();
	}
	if(typeof jvar == 'undefined') {
		jvar = '';
	}
	return(jvar == 'undefined' || jvar == undefined || jvar == null || jvar == "" || jvar == void 0);
}

//*******************************************************************************************************************
//Purpose: Function is called to remove blank spaces
//*******************************************************************************************************************
function trim(str){
	str = str.replace(/^\s+|\s+$/g,"");
	return str;
}

// Function returns the current date without any specific format
function getCurrentDate(){
	var today = new Date();
	var tmp_cur_month = today.getMonth();
	var tmp_cur_date = today.getDate();
	var tmp_cur_year = today.getFullYear();
	
	if(tmp_cur_month<9){
		tmp_cur_month = "0"+(tmp_cur_month+1);
	} else{
		tmp_cur_month = (tmp_cur_month+1).toString();
	}
	
	if(tmp_cur_date<10){
		tmp_cur_date = "0"+tmp_cur_date;
	}
	
	curDateStr = tmp_cur_year + tmp_cur_month + tmp_cur_date;
	return curDateStr;
}

// Function returns date in mm/dd/yyyy format
function mm_dd_yyyy(date){
	var date1 = "";
	month = date.substring(4,6);
	year = date.substring(0,4);
	date = date.substring(6,8);
	date1 = month + "/" + date + "/" + year;  
	return date1;
}


// Change date from 6 digit or 8 digit to correct format
function formatDate(date,dformat){
   var date1 = "";
   month = date.substring(4,6);
   year = date.substring(0,4);
   date = date.substring(6,8);
   switch (dformat){
         case '1':
            date1 = date + "." + month + "." + year;
            break;
         case '2':
            date1 = month + "/" + date + "/" + year;         
            break;
         case '3':
            date1 = month + "-" + date + "-" + year;                     
            break;
         case '4':
            date1 = year + "." + month + "." + date;         
            break;
         case '5':
            date1 = year + "/" + month + "/" + date;            
            break;
         case '6':
            date1 = year + "-" + month + "-" + date;
            break;
      }
      return (date1);   
}



//*******************************************************************************************************************
//Purpose: Function is called to read user SAP role and profile 
//*******************************************************************************************************************
function getAuthorizations(){
	rfcres = call('BAPI_USER_GET_DETAIL', {"in.USERNAME":"&V[_user]","table.ACTIVITYGROUPS":"Z_ROLES"});
	// BD - Not using the user date format currently as client specifically using mm/dd/yyyy format always. Need to check with client
	// rfcres = call('BAPI_USER_GET_DETAIL', {"in.USERNAME":"&V[_user]","OUT.DEFAULTS":"userDefaults","table.ACTIVITYGROUPS":"Z_ROLES"});
	// dateformat = userDefaults.substring(27,28);
	// z_currentformattedDate = formatDate(getCurrentDate(),dateformat);
}

//*******************************************************************************************************************
//Purpose: Function is called to see if current user has the roleName match
//*******************************************************************************************************************
function roleExists(roleName){
   for (i = 0; i < Z_ROLES.length; i++)   {
      var z_userrole = Z_ROLES[i].toString().substring(0,25).trim();
	  if(z_userrole.toUpperCase() == roleName.toUpperCase()) {
         return true;
      }
   }
   return false;
}

// Function returns future date based on the number of days passed
function getFutureDate(days){
	var curr_date = new Date();
	curr_date.setMilliseconds(curr_date.getMilliseconds()+(days*24*60*60*1000));
	
	var tmp_cur_month = curr_date.getMonth();
	var tmp_cur_date = curr_date.getDate();
	var tmp_cur_year = curr_date.getFullYear();
	
	if(tmp_cur_month<9){
		tmp_cur_month = "0"+(tmp_cur_month+1);
	} else{
		tmp_cur_month = (tmp_cur_month+1).toString();
	}
	
	if(tmp_cur_date<10){
		tmp_cur_date = "0"+tmp_cur_date;
	}
	
	var z_target_date = mm_dd_yyyy(tmp_cur_year+tmp_cur_month+tmp_cur_date);
	return z_target_date;
}



/**************************************************************************************************
*** Use this function to read a single line out of a list screen.
*** This function can only be used to read data rows that are visible on the current screen, and not header rows or other rows.
*** format: readListString(<OPTION>,<FIRST_DATA_ROW_NUMBER--OPTIONAL>);
	<OPTION>: Integer specifying an absolute row number
			  'last' specifying the last row of data in the list
			  'lastvisible' specifying the last row of data on the current page
*** eg:  var listString = readListString(5,3);  				// This will return the data in row 5 of the page 
***      var listString = readListString('last',3);			// This will return the last data row
***      var listString = readListString('lastvisible',3);	//This will return the data of last row on the current page

NOTE: For 'last' and 'lastvisible' we make use of the WS variables _listlastrow and _listlastvisiblerow. These variables 
return the last row number and the last visible row number, and does not take into account the header rows of the list table.
For example, if there is 1 row of headers, and the table data rows start at line 3 (headers will be rows 0,1,2), then you will need to
pass 3 as the 2nd argument in your function. 

If firstDataRow is not passed in, it will be calculated as the row after 644444... which denotes |------ junction
***************************************************************************************************/
function readListString(row,firstDataRow){
	retString = "";
	value = "";
	set("V[firstVisRow]", _listfirstvisiblerow);
	set("V[lastVisRow]", _listlastvisiblerow);
	set("V[lastRow]", _listlastrow);
	firstVisRow = parseInt(firstVisRow,10);
	lastVisRow = parseInt(lastVisRow,10);
	lastRow = parseInt(lastRow,10);
	
	if (firstDataRow == void 0 || isBlank(firstDataRow.toString().trim())){
		nRow = 1;
		for (var iRow = 0; iRow < nRow; iRow++){
			objReeb = <"#["+iRow.toString()+",0]">;
			if (objReeb.name.label != void 0 && objReeb.name.label.indexOf('644444')>-1){
				firstDataRow = iRow + 1;
				break;
			}
			nRow++;
		}
	}

	if (row != 'lastvisible' && row != 'last'){
		if ((row > lastRow + firstDataRow - 1) || (row < firstDataRow)){
			return ('E: Cannot find data');
			goto SCRIPT_END;
		}
	}

	// if the firstDataRow is provided, check if the user is trying to read the lastRow or lastVisibleRow.
	if (firstDataRow != void 0 && !isBlank(firstDataRow.toString().trim())){
		if (row == 'last' || row == 'lastvisible'){
			if (row == 'last'){	
				row = lastRow;
			} else if (row == 'lastvisible'){	
				row = lastVisRow;
			} 
			row = parseInt(row,10);
			row += firstDataRow - 1;
		}	
		
		if ((row < (lastVisRow + firstDataRow)) && (row >= (firstVisRow + firstDataRow - 1))){
			//data to be read is on the same page.
			//adjust row number - must be relative to the current page
			row = row - firstVisRow + 1;
			goto CONTINUE_READ;
		} else if (row >= (lastVisRow + firstDataRow)){	//scroll page down
			enter({'process':scroll_down});
			goto SCRIPT_END;
		} else {	// scroll page up
			enter({'process':scroll_up});
			goto SCRIPT_END;
		}
	} 
	
	CONTINUE_READ:;
	for (var col=0; col<1000; col++){
		var objReeb = <"#["+row+","+col+"]">;
		if (objReeb.isValid){
			if (objReeb.name.label == '5'|| isBlank(objReeb.name.toString().trim())){
				retString += value + ' ';
				value = "";	
			} else if (objReeb.name != lastReebName){
				value = objReeb.name;
				lastReebName = value;
			}			
		} 
	}
	
	return(retString);
	SCRIPT_END:;
}


// The list screen specific to ZBULK transaction, set lastRow = lastRow*4
// Else always goes into 'Cannot find data' condition
function ZBULK_readListString(row,firstDataRow){
	retString = "";
	value = "";
	set("V[firstVisRow]", _listfirstvisiblerow);
	set("V[lastVisRow]", _listlastvisiblerow);
	set("V[lastRow]", _listlastrow);

	firstVisRow = parseInt(firstVisRow,10);
	lastVisRow = parseInt(lastVisRow,10);
	lastRow = parseInt(lastRow,10);
	lastRow = lastRow*4;
	
	if (firstDataRow == void 0 || isBlank(firstDataRow.toString().trim())){
		nRow = 1;
		for (var iRow = 0; iRow < nRow; iRow++){
			objReeb = <"#["+iRow.toString()+",0]">;
			if (objReeb.name.label != void 0 && objReeb.name.label.indexOf('644444')>-1){
				firstDataRow = iRow + 1;
				break;
			}
			nRow++;
		}
	}

	if (row != 'lastvisible' && row != 'last'){
		if ((row > lastRow + firstDataRow - 1) || (row < firstDataRow)){
			return ('E: Cannot find data');
			goto SCRIPT_END;
		}
	}

	// if the firstDataRow is provided, check if the user is trying to read the lastRow or lastVisibleRow.
	if (firstDataRow != void 0 && !isBlank(firstDataRow.toString().trim())){
		if (row == 'last' || row == 'lastvisible'){
			if (row == 'last'){	
				row = lastRow;
			} else if (row == 'lastvisible'){	
				row = lastVisRow;
			} 
			row = parseInt(row,10);
			row += firstDataRow - 1;
		}	
		
		if ((row < (lastVisRow + firstDataRow)) && (row >= (firstVisRow + firstDataRow - 1))){
			//data to be read is on the same page.
			//adjust row number - must be relative to the current page
			row = row - firstVisRow + 1;
			goto CONTINUE_READ;
		} else if (row >= (lastVisRow + firstDataRow)){	//scroll page down
			enter({'process':scroll_down});
			goto SCRIPT_END;
		} else {	// scroll page up
			enter({'process':scroll_up});
			goto SCRIPT_END;
		}
	} 
	
	CONTINUE_READ:;
	for (var col=0; col<1000; col++){
		var objReeb = <"#["+row+","+col+"]">;
		if (objReeb.isValid){
			if (objReeb.name.label == '5'|| isBlank(objReeb.name.toString().trim())){
				retString += value + ' ';
				value = "";	
			} else if (objReeb.name != lastReebName){
				value = objReeb.name;
				lastReebName = value;
			}			
		} 
	}
	
	return(retString);
	SCRIPT_END:;
}
