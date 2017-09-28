//**************************************************************************************************//
//Developed By:		Synactive, Inc.																	
//Version: 			1.0																				
//Purpose: 			Generic Functions
//
//**************************************************************************************************//

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, "");}	//Creates a string prototype function

String.prototype.removeLeadZeros = function() { return this.replace(/^0+/, "");}	

function isBlank(jvar){		//checks the value of a variable
	if(typeof jvar == 'string') {
		jvar = jvar.trim();
	}
	return(jvar == null || jvar == "" || jvar == '?' || jvar == void 0);
}

const PADDING_LEFT = 0;
const PADDING_RIGHT = 1;
function padString(source,length,direction,character) {
	var loop;
	var output = "";
	var sourceLength = 0;
	set('V[z_source]',source);
	println('--z_source='+z_source);
	if(z_source) {
		sourceLength = z_source.length;
	}
	println('---sourceLength = ' + sourceLength);
	switch(direction) {
	case PADDING_LEFT:
		println('----paddd..... left. length='+length + ' and source length =' + sourceLength);
		for(loop = 0; loop < (length - sourceLength); loop++) {
			output += character;
		}
		println('-output='+output);
		output = output + z_source;
		println('---output='+output);
		break;
		
	case PADDING_RIGHT:
		for(loop = 0; loop < (length - sourceLength); loop++) {
			output += character;
		}
		output = z_source + output;
		break;
	}
	return output;
}


function getTodaysDate(dformat) {
	var z_date = new Date();
	println(">>>>>>>>>>>>>>>>>",z_date);
	var str = "";
	switch(dformat) 
	{
		case 1:
		{
			str = padString(z_date.getDate(),2,PADDING_LEFT,"0") + "." + padString((z_date.getMonth()+1),2,PADDING_LEFT,"0") + "." + z_date.getFullYear();
		}
		break;
		
		case 2:
		{
		   str = padString((z_date.getMonth()+1),2,PADDING_LEFT,"0") + "/" + padString(z_date.getDate(),2,PADDING_LEFT,"0") + "/" + z_date.getFullYear();
		}
		break;

		case 3:
		{
		   str = padString((z_date.getMonth()+1),2,PADDING_LEFT,"0") + "-" + padString(z_date.getDate(),2,PADDING_LEFT,"0") + "-" + z_date.getFullYear();
		}
		break;

		case 4:
		{
		   str = z_date.getFullYear() + "." + padString((z_date.getMonth()+1),2,PADDING_LEFT,"0") + "." + padString(z_date.getDate(),2,PADDING_LEFT,"0");
		}
		break;

		case 5:
		{
		   str = z_date.getFullYear() + "/" + padString((z_date.getMonth()+1),2,PADDING_LEFT,"0") + "/" + padString(z_date.getDate(),2,PADDING_LEFT,"0");
		}
		break;
		
		case 6:
		{
		   str = z_date.getFullYear() + "-" + padString((z_date.getMonth()+1),2,PADDING_LEFT,"0") + "-" + padString(z_date.getDate(),2,PADDING_LEFT,"0");
		}
		break;
		case 7:
		{
			str = padString(z_date.getDate(),2,PADDING_LEFT,"0") + padString((z_date.getMonth()+1),2,PADDING_LEFT,"0") +z_date.getFullYear();
		}
		break;
	}
	println(str);
	return str;
}

