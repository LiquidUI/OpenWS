
function cpyTextBox3(){

		copytext({"fromstring":"z_mm01_po_txt","toscreen":"X[LONGTEXT_BESTELL]"});
		// copytext({"fromscreen":"X[LONGTEXT_BESTELL]","tostring":"z_mm01_po_txt"});
	// enter('/3');
}

	pushbutton([TOOLBAR], "Refresh", "?");
	pushbutton([TOOLBAR], "LongText Copy", "?", {"process":cpyTextBox3});
		textbox([6,100],[12,150],{"name":"z_mm01_po_txt"})