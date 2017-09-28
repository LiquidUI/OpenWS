
/////////////////////////////////////////////////////////////////////////////////////
//YOUR SETTINGS HELIOS
/////////////////////////////////////////////////////////////////////////////////////

//If the flag is high, the display the script
if(z_flag == 1){
	
	pushbutton([TOOLBAR],"@2M@Main Menu","/n/d1="+dirDemoLP);
	//clear the flag if the user types in a transaction
	onUIEvents["/n*"] = {"process":setFlag, "using":{"flag":0}};
	
	del("P[Password]");
	del("P[Address]");
	del("P[Defaults]");
	del("P[Delete Row]");
	del("P[Select All]");
	del("P[Deselect All]");



	del("F[User]");
	del("F[Last Changed On]",{ "triple":true});
	del("F[USCHANGE-MODTI]");
	del("F[Status]");
	del("F[Changed By]", {"triple":true});
	del("F[SUID_ST_NODE_ADMINDATA-MODTIME]");

	image([0,0], "banner.jpg",{ "transparent":true, "start":"http://www.frucor.com.au/"});

	//set nav to false, letting the Left Column buttons know 
	//what to do if they are clicked
	nav = false;
	// To display Left Column
	leftCol(nav);

	pos("S[TABSTRIP1]", [5,32]);

	//Save button runs SaveParam
	pushbutton([5,50],"@01@Save       ", {"process":SU3Save});
	
}

function SU3Save(){

	//On this screen, clear left_Col to view the Initial view of the Easy Access
	//On this screen, clear the initial_load, so when we get to Easy Access, the 
	//parameters will load again
	onscreen 'SAPLSUID_MAINTENANCE.1100'
		set("V[left_Col]", "");
		set("V[initial_load]", "");
		enter("/11");
}
