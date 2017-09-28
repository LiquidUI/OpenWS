if(isBlank(Value)){
	del("P[Details]");
	del("P[Change <-> Display]");
	del("P[Update]");
	del("P[Select All]");
	del("P[Deselect All]");
	del("P[Sort in Ascending Order]");
	del("P[Sort in Descending Order]");
	del("P[Set Filter]");
	del("P[Graphic]");
	del("P[Spreadsheet]");
	del("P[Order]");
	del("P[Long Text]");
	del("P[Release Order]");
	del("P[Complete (Technically)]");
	del("P[Operation List]");
	del("P[Current...]");
	del("P[Refresh]");
	del("P[Select all]");
	del("P[Deselect all]");
	del("P[Sort in ascending order]");
	del("P[Sort in descending order]");
	del("P[Set filter]");
	del("P[Long text]");
	del("P[Individual confirmation]");
	del("P[/34]");
	del("P[Notification]");
	del("P[/48]");
	del("P[/33]");

	set("V[launch_tcode]","&V[_transaction]");

	if(_transaction == 'VA05') {
		pushbutton([TOOLBAR], "@2M@Back","/3");
	} else {
		pushbutton([TOOLBAR], "@2M@Back","/n");
		onUIEvents['/3']={'fcode':'/n'};
	}
}