
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

function cpyTextBox(){
	
	copytext({"fromscreen":"X[LONGTEXT_IVERM]","totext":"z_mm01_add_int_com"});
	// return;
}
function cpyTextBox2(){
	
	copytext({"fromscreen":"X[LONGTEXT_IVERM]","totext":"z_mm01_add_int_com"});
	return;
      if(isTextBoxBlank(z_mm01_po_txt.trim())){      //Skip copy text if textbox is blank
         enter('?');
         goto FUNC_END;
      }
		z_longtextarray = splitText(z_mm01_po_txt,72);
         
         println('array--'+z_longtextarray);
         var start_line = 1;
         var save_line_count = 0;
         var line_count = z_longtextarray.length; 
	   
   onscreen 'SAPLSTXX.2102'
      enter('/Menu=3,3');                           //Change editor
      
   onscreen 'SAPLSTXX.1100'
      enter("/Menu=1,7");                           //Cancel existing content
      
   onscreen 'SAPLSPO1.0100'
      enter("=YES");                              //Select "yes" in the popup
      
NEXT_LINE:;
   onscreen "SAPLSTXX.1100"      
      //Form editable lines according to the length of operation long text 
      if(!(start_line > line_count)){
         save_line_count = start_line + 1;
         if(save_line_count<10){
            setcursor("cell[SAPLSTXX_EDITAREA,3,"+save_line_count+"]");
         } else{
            setcursor("cell[SAPLSTXX_EDITAREA,3,10]");
         }
      
         start_line++;
         enter();
         goto NEXT_LINE;
      } else {
         var ltrelrow = 1;
         var ltabsrow = 1;
         enter("/ScrollToLine=1", {"table":"T[SAPLSTXX_EDITAREA]"});         // Scroll table to top before copying value
      }
                               
NEW_SCREEN:;
   onscreen 'SAPLSTXX.1100'      
      gettableattribute("T[SAPLSTXX_EDITAREA]", {"firstvisiblerow":"FVisRow", "lastvisiblerow":"LVisRow", "lastrow":"LRow"});

      for(ltrelrow=1; ltrelrow<11; ltrelrow++, ltabsrow++){         // Copy long text to table
         if(ltabsrow > line_count){                  // If ltabsrow counter exceeds the total line value, Click "Back" to exit editing
            enter("/11");
            goto COPY_TEXT_END;
         }                                             
         start_copy_line = ltrelrow + 1;                              // Set targeting row
         tmp_line = z_longtextarray[ltabsrow-1];                                   // Copy current line content to a temp variable                  
         if(!isBlank(tmp_line))
            set('cell[SAPLSTXX_EDITAREA,3,&V[start_copy_line]]', '&V[tmp_line]');
         else
            set('cell[SAPLSTXX_EDITAREA,3,&V[start_copy_line]]', '');
      }
      enter("/ScrollToLine="+((ltabsrow--)-1), {"table":"T[SAPLSTXX_EDITAREA]"});                 // Scroll to show more editable line
      goto NEW_SCREEN;
 
COPY_TEXT_END:;
   onscreen 'SAPLSTXX.1100'
      enter('/3');
   
   onscreen 'SAPLSPO1.0100'                                       // Popup handling
      enter('=YES');    
      
   onscreen 'SAPLSTXX.2101'
      enter('/3');
      
FUNC_END:;
         
}


//Function to copy text content to SAP text editor screen
function va01SaveText(param){
   var z_va0x_find_text_counter = param.l_seq;               //Copy passed sequence parameter

   onscreen "SAPMV45A.4001"
      if(isTextBoxBlank(z_va01_term_of_delivery_text.trim())){      //Skip copy text if textbox is blank
         enter('?');
         goto FUNC_END;
      }
      enter('/Menu=3,2,11');                        //Go to Header Data-> Text tab
      onmessage                              //Error handling
         if(_message.substring(0,2) == "E:"){
            message(_message);
            enter('?');
            goto FUNC_END;
         } else
            enter();
      
   onscreen 'SAPMV45A.4002'
      enter('=TP_FIRST');                           //Go to first option in the list
      
RECHECK_FIND_TEXT:;
   onscreen 'SAPMV45A.4002'
      if(z_va0x_find_text_counter > 0){                  //According to sequence value
         z_va0x_find_text_counter--;
         enter('=TP_NEXT');                        //Go to next text in the list
         goto RECHECK_FIND_TEXT;
      } else{
         z_longtextarray = splitText(z_va01_term_of_delivery_text,72);
         
         println('array--'+z_longtextarray);
         var start_line = 1;
         var save_line_count = 0;
         var line_count = z_longtextarray.length; 
         
         enter('=TP_DETAIL');                        //Go to text editor
      }
      
   onscreen 'SAPLSTXX.2102'
      enter('/Menu=3,3');                           //Change editor
      
   onscreen 'SAPLSTXX.1100'
      enter("/Menu=1,7");                           //Cancel existing content
      
   onscreen 'SAPLSPO1.0100'
      enter("=YES");                              //Select "yes" in the popup
      
NEXT_LINE:;
   onscreen "SAPLSTXX.1100"      
      //Form editable lines according to the length of operation long text 
      if(!(start_line > line_count)){
         save_line_count = start_line + 1;
         if(save_line_count<10){
            setcursor("cell[SAPLSTXX_EDITAREA,3,"+save_line_count+"]");
         } else{
            setcursor("cell[SAPLSTXX_EDITAREA,3,10]");
         }
      
         start_line++;
         enter();
         goto NEXT_LINE;
      } else {
         var ltrelrow = 1;
         var ltabsrow = 1;
         enter("/ScrollToLine=1", {"table":"T[SAPLSTXX_EDITAREA]"});         // Scroll table to top before copying value
      }
                               
NEW_SCREEN:;
   onscreen 'SAPLSTXX.1100'      
      gettableattribute("T[SAPLSTXX_EDITAREA]", {"firstvisiblerow":"FVisRow", "lastvisiblerow":"LVisRow", "lastrow":"LRow"});

      for(ltrelrow=1; ltrelrow<11; ltrelrow++, ltabsrow++){         // Copy long text to table
         if(ltabsrow > line_count){                  // If ltabsrow counter exceeds the total line value, Click "Back" to exit editing
            enter("/11");
            goto COPY_TEXT_END;
         }                                             
         start_copy_line = ltrelrow + 1;                              // Set targeting row
         tmp_line = z_longtextarray[ltabsrow-1];                                   // Copy current line content to a temp variable                  
         if(!isBlank(tmp_line))
            set('cell[SAPLSTXX_EDITAREA,3,&V[start_copy_line]]', '&V[tmp_line]');
         else
            set('cell[SAPLSTXX_EDITAREA,3,&V[start_copy_line]]', '');
      }
      enter("/ScrollToLine="+((ltabsrow--)-1), {"table":"T[SAPLSTXX_EDITAREA]"});                 // Scroll to show more editable line
      goto NEW_SCREEN;
 
COPY_TEXT_END:;
   onscreen 'SAPLSTXX.1100'
      enter('/3');
   
   onscreen 'SAPLSPO1.0100'                                       // Popup handling
      enter('=YES');    
      
   onscreen 'SAPLSTXX.2101'
      enter('/3');
      
FUNC_END:;
}

	pushbutton([TOOLBAR], "Refresh", "?");
	pushbutton([TOOLBAR], "LongText Copy", "?", {"process":cpyTextBox});
	// pushbutton([TOOLBAR], "LongText Copy", "=LTEX", {"process":cpyTextBox});
		// textbox([6,100],[12,150],{"name":"z_mm01_po_txt"})
		textbox([6,100],[12,150],{"name":"z_mm01_add_int_com"});