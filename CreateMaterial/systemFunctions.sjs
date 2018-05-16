// Array for SAP Field to Liquid UI Field Mapping
arrMM01FieldMapping = [];
arrMM01FieldMapping.push('MARC-ELGRP:z_mm01_pulgrp');
arrMM01FieldMapping.push('MARC-EKGRP:z_mm01_purgrp');

function testFn() {
	set('V[cursorFieldName]',getLUIField(arrMM01FieldMapping,'MARC-EKGRP',0));
}

function wsToNumber(strInput) {
	var strVal = getString(strInput);
	return parseFloat(strVal.replace(/,/g,''));

}

function getLUIField(arrName,strSAPField,nRow) {
	var LUIFieldName = '';
	var nIndex = -1;
	for(i=0;i<arrName.length;i++) {
		if(arrName[i].indexOf(strSAPField)>-1) {
			nIndex = i;
		}
	}
	if(nIndex > -1) {
		LUIFieldName = arrName[nIndex].split(':');
		LUIFieldName = LUIFieldName[1];
		if(nRow!=0)	LUIFieldName = LUIFieldName+'_'+nRow;
	}
	return LUIFieldName;
}

function getUserParameters(){
	rfcres = call('BAPI_USER_GET_DETAIL',{'IN.USERNAME':'&V[_user]','OUT.DEFAULTS':'userDefaults'});
	set('V[USERDATEFORMAT]',userDefaults.substring(27,28));
	today_user = getDateInUserFormat(getCurrentDate(),USERDATEFORMAT);	// Variable holds current date in user date format	[today_user]
}

// Function returns the current date without any specific format
function getCurrentDate(){
	var d = new Date();
	var tmp_cur_month = d.getMonth();
	var tmp_cur_date = d.getDate();
	var tmp_cur_year = d.getFullYear();
	
	if(tmp_cur_month<9){
		tmp_cur_month = "0"+(tmp_cur_month+1);
	} else{
		tmp_cur_month = (tmp_cur_month+1).toString();
	}
	
	if(tmp_cur_date<10){
		tmp_cur_date = "0"+tmp_cur_date;
	}
	
	curDateStr = tmp_cur_year + '' + tmp_cur_month + '' + tmp_cur_date;
	return curDateStr;
}

// Capture the date from object and transform it to targeting format
function getCurrentDateInUserFormat(dateformat){
	var today = new Date();
	if(today.getMonth()<9){				//getMoth returns month value from 0~11, add "0" before actual month value if is JAN~SEP(1~9)
		var curDateStr = today.getFullYear() + "0" + (today.getMonth()+1).toString() + today.getDate();
	} else{								//No need to add "0" if actual month value is OCT~DEC (10~12)
		var curDateStr = today.getFullYear() + (today.getMonth()+1).toString() + today.getDate();
	}
	println('\n\n$$$$$$$$$$$$$:'+curDateStr+':');
	return(getDateInUserFormat(curDateStr,dateformat));		
}


// Change date from 6 digit or 8 digit to correct format:
function getDateInUserFormat(date,dformat){
	var userDateFormat = "";
	var month = date.substring(4,6);
	var year = date.substring(0,4);
	var date = date.substring(6,8);
	switch (dformat){
		case '1':
			userDateFormat = date + "." + month + "." + year;
			break;
		case '2':
			userDateFormat = month + "/" + date + "/" + year;			
			break;
		case '3':
			userDateFormat = month + "-" + date + "-" + year;							
			break;
		case '4':
			userDateFormat = year + "." + month + "." + date;			
			break;
		case '5':
			userDateFormat = year + "/" + month + "/" + date;				
			break;
		case '6':
			userDateFormat = year + "-" + month + "-" + date;
			break;
	}
	return (userDateFormat);	
}

/**
 * Utilities.sjs - Common functions used across multiple scripts.
 */

/**
 * PADDING CONSTANTS
 */
const PADDING_LEFT = 0;
const PADDING_RIGHT = 1;

/**
 * trim()			
 */
String.prototype.trim = function () {
   return this.replace(/^\s+|\s+$/g, "");
}

Array.prototype.indexOf = function (p){
	for(i=0;i<this.length;i++)	if(this[i] == p) return i;
	return -1;
}
function getString(strInput) {
	return (typeof(strInput) == 'undefined') ? "" : strInput.toString().trim();
}


//Function to check if longtext is blank
function isTextBoxBlank(longText) {
   var bTextExist = true;
   var arrText = longText.split('\n');
   for(var iCount=0; iCount<arrText.length; iCount++) {
      if(!isBlank(arrText[iCount].trim())) {
         bTextExist = false;
         break;
      }
   }
   return bTextExist;
}

//Function to split a string into an array with specified char size   
function splitText(longText, charSize){
   charSize = parseInt(charSize);
   var textArray = longText.split('\n');
   var resultArray = [], matchedArray = [];
   var new_line_content = "", remained_line_content = "", cur_line = "";
   
   for(var iCount=0; iCount<textArray.length; iCount++){
      new_line_content = textArray[iCount].replace(/\t+/g," ").trim();      //Text editor doesn't support Tab content
      
      do{
         remained_line_content = "";
         if(new_line_content.length > charSize){
            cur_line = new_line_content.substring(0,charSize);
            matchedArray = cur_line.match(/((\S*\s+\S*)+\s)|(\S*)/g);
            remained_line_content = new_line_content.substring(matchedArray[0].length, new_line_content.length)
            new_line_content = matchedArray[0];
         }
         resultArray.push(new_line_content);
         new_line_content = remained_line_content;
      } while(new_line_content.length > 0)
   }
                  
   return resultArray;
}


/*
function isBlank(jvar){
	if(typeof jvar == 'string') {
		jvar = jvar.trim();
	}
	if(typeof jvar == 'undefined') {
		jvar = '';
	}
	return(jvar == 'undefined' || jvar == undefined || jvar == null || jvar == "" || jvar == void 0);
}
*/
function isBlank(strInput) {
	var strVal = getString(strInput);
	var blank = strVal == "";
	return blank;
}

function padString(strInput, length, direction, character) {
	var loop;
	var output = "";
	var sourceLength = 0;
	var source = getString(strInput);

	if (source) {
		sourceLength = source.length;
	}
    switch (direction) {
		case PADDING_LEFT:
			for (loop = 0; loop < (length - sourceLength); loop++) {
				output += character;
			}
			output = output + source;
			break;
		case PADDING_RIGHT:
			for (loop = 0; loop < (length - sourceLength); loop++) {
				output += character;
			}
			output = source + output;
			break;
	}
	return output;
}

// Usage: 	arrNum = retrieveNumbersFromString('Order 2893292 saved and 983029320 retrived');
function retrieveNumbersFromString(strMessage) {
	var myarr = [];
    var res = strMessage.match(/[-+]?[0-9]*\.?[0-9]+/g);
    myarr = res.toString().split(',');
	return myarr;
}

function isNumeric(num){
    return !isNaN(num);
}

/*********************************************************************************
** Check passed in date against the passed in date format.
**********************************************************************************/
function check_date_format(date,dformat){
	arValues = [];
	arTmpValues = [];
	switch(parseInt(dformat)){
		case 1:
			// DD.MM.YYYY
			var matches = /^\d{1,2}[.]\d{1,2}.\d{4}$/.exec(date);
		//	var matches = /^([0]?[1-9]|[12][0-9]|3[01])\.([0]?[1-9]|1[012])\.[0-9]{4}/.exec(date);
			if (matches == null) return ([]);
			else {
				arTmpValues = date.toString().split(".");
				return (arTmpValues);
			}
			break;
		case 2:
			// MM/DD/YYYY
			var matches = /^\d{1,2}\/\d{1,2}\/\d{4}$/.exec(date);
		//	var matches = /^([0]?[1-9]|1[012])\/([0]?[1-9]|[12][0-9]|3[01])\/[0-9]{4}/.exec(date);
			if (matches == null) return ([]);
			else {				
				arTmpValues = date.toString().split("/");
				return ([arTmpValues[1],arTmpValues[0],arTmpValues[2]]);
			}
			break;
		case 3:
			// MM-DD-YYYY
			var matches = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(date);
		//	var matches = /^([0]?[1-9]|1[012])\-([0]?[1-9]|[12][0-9]|3[01])\-[0-9]{4}/.exec(date);
			if (matches == null) return ([]);
			else {
				arTmpValues = date.toString().split("-");
				return ([arTmpValues[1],arTmpValues[0],arTmpValues[2]]);
			}
			break;	
		case 4:
			// YYYY.MM.DD
			var matches = /^\d{4}[.]\d{1,2}[.]\d{1,2}$/.exec(date);
		//	var matches = /^[0-9]{4}\.([0]?[1-9]|1[012])\.([0]?[1-9]|[12][0-9]|3[01])/.exec(date);
			if (matches == null) return ([]);
			else {
				arTmpValues = date.toString().split(".");
				return ([arTmpValues[2],arTmpValues[1],arTmpValues[0]]);
			}
			break;
		case 5:
			// YYYY/MM/DD
			var matches = /^\d{4}\/\d{1,2}\/\d{1,2}$/.exec(date);
		//	var matches = /^[0-9]{4}\/([0]?[1-9]|1[012])\/([0]?[1-9]|[12][0-9]|3[01])/.exec(date);
			if (matches == null) return ([]);
			else {
				arTmpValues = date.toString().split("/");
				return ([arTmpValues[2],arTmpValues[1],arTmpValues[0]]);
			}
			break;
		case 6:
			// YYYY-MM-DD
			var matches = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date);
		//	var matches = /^[0-9]{4}\-([0]?[1-9]|1[012])\-([0]?[1-9]|[12][0-9]|3[01])/.exec(date);
			if (matches == null) return ([]);
			else {
				arTmpValues = date.toString().split("-");
				return ([arTmpValues[2],arTmpValues[1],arTmpValues[0]]);
			}
			break;
	}
}

/*********************************************************************************
** Checks if the passed in date is a valid date according to the passed in date format
**********************************************************************************/
function isValidDate(date,dformat){
	var flag = true;
	//gets back an array with date, month, year as the first 3 elements if it is in the valid format.		
	arDateValues = check_date_format(date,dformat);
	if(arDateValues.length == 0){
		return false;
	}
	day = arDateValues[0];
	month = arDateValues[1];
	year = arDateValues[2];
	
	var days_in_feb = (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
	
	if (((month > 12) || (month < 0)) || (day < 1) || ((month == 1) && (day > 31)) || ((month == 2) && (day > days_in_feb)) || ((month == 3) && (day > 31)) || ((month == 4) && (day > 30)) 
		|| ((month == 5) && (day > 31)) || ((month == 6) && (day > 30)) || ((month == 7) && (day > 31)) || ((month == 8) && (day > 31)) || ((month == 9) && (day > 30)) 
		|| ((month == 10) && (day > 31)) || ((month == 11) && (day > 30)) || ((month == 12) && (day > 31))){ 
			flag = false;
	}
	
	return flag;
}

function dateSubstraction(date1, date2){
	//Get 1 day in milliseconds
	var one_day=1000*60*60*24;

	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
	//take out milliseconds
	difference_ms = difference_ms/1000;
	var seconds = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60; 
	var minutes = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60; 
	var hours = Math.floor(difference_ms % 24);  
	var days = Math.floor(difference_ms/24);

	return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
}

/**************************************************************************************
change date from one format to another
formats: 
	// 1. DD.MM.YYYY
	// 2. MM/DD/YYYY
	// 3. MM-DD-YYYY
	// 4. YYYY.MM.DD
	// 5. YYYY/MM/DD
	// 6. YYYY-MM-DD
****************************************************************************************/
function changeFormat(date,dformat,outformat){
	arDateValues = check_date_format(date,dformat);
	if (arDateValues.length == 0){
		return ("Invalid Format");
	}
	day = arDateValues[0];
	month = arDateValues[1];
	year = arDateValues[2];
	date1 = "";
	switch (outformat){
			case '1':
				date1 = day + "." + month + "." + year;
				break;
			case '2':
				date1 = month + "/" + day + "/" + year;			
				break;
			case '3':
				date1 = month + "-" + day + "-" + year;							
				break;
			case '4':
				date1 = year + "." + month + "." + day;			
				break;
			case '5':
				date1 = year + "/" + month + "/" + day;				
				break;
			case '6':
				date1 = year + "-" + month + "-" + day;
				break;
		}
		return (date1);	
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

// This function is used for the "search" option in a set command in Legacy
// It will return the next word after the searching word
// It will return an empty string if not found
function search_option(str1, search){
	var arr = str1.split(" ");
	for (var i = 0; i<arr.length; i++){
		if(arr[i] == search){
			if(i+1 != arr.length){
				return arr[i+1];
			}
		}
	}
	return "";
}


