app.LoadPlugin( "Utils" );
app.LoadPlugin( "Support" );

cfg.Portrait, cfg.Light, cfg.MUI, cfg.Share;
found = false;
//Called when application is started.
async function OnStart()
{
		utils = app.CreateUtils();
		barColor = utils.RandomHexColor(false);
		utils.SetTheme(barColor);
			/*if(app.FileExists("roku-remote.txt")){
		contents = app.ReadFile( "roku-remote.txt" ).split(",");
		txt.SetText(  contents[0] );
    txt2.SetText(  contents[1] );
		if(utils.Confirm("We already have saved a Roku Device called: "+contents[1]+" with IP: "+contents[0]+". You want to search for a new one?")) app.DeleteFile( "roku-remote.txt" );*/
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "Linear", "Top,HCenter,FillXY" );
  lay2 = app.CreateLayout( "Linear", "Horizontal,VCenter,FillX" );
	CreateActionBar("Roku Remote", barColor);
	layHoriz.Hide();
	//Create a text label and add it to layout.
	txt = app.CreateText( "IP", 0.5, -1 );
	txt.SetTextSize( 12 );
	txt.SetTextColor( barColor );
	txt.SetTextShadow( 5, 0, 0, "#000000" );
	txt.Hide()
	lay2.AddChild( txt );
	
	
	txt2 = app.CreateText( "NAME", 0.5, -1 );
	txt2.SetTextSize( 12 );
	txt2.SetTextColor( barColor );
	txt2.SetTextShadow( 5, 0, 0, "#000000" );
	txt2.Hide();
	lay2.AddChild( txt2 );
	
	lay.AddChild( lay2 );
	//Add layout to app.	
	app.AddLayout( lay );
await CheckIP();
	
	var tabs = app.CreateTabs( "Info,Remote,Apps,Channels", 1, -1, "VCenter" );
	tabs.Hide()
    lay.AddChild( tabs );

    tab1 = tabs.GetLayout( "Remote" );
    tab2 = tabs.GetLayout( "Apps" );
    tab3 = tabs.GetLayout( "Channels" );
    tab4 = tabs.GetLayout( "Info" );
    
    data = "Device Name^c^:[DEVICE-NAME]:null";
    data += ",Device IP^c^:[DEVICE-IP]:null";
    data += ",Device Mac Address^c^:[DEVICE-MAC]:null";
    data += ",Network - AP (SSID) ^c^:[AP]:null";
    lst = app.CreateList( data, 1, 0.4, "Expand,Horiz,WhiteGrad");
    lst.SetTextColor2( barColor );
    lst.SetTextShadow2( 4, 0,0,"#ececec" );
    lst.SetFontFile( "Misc/Rowdies-Regular.ttf" );
    lst.SetOnTouch( lst_OnTouch );
    tab4.AddChild( lst );
    txtTab4 = app.CreateText( "Mac Address",-1,-1 );
    txtTab4.SetTextSize( 13 );
    txtTab4.SetText( contents[2] );
    data = data.replace("[DEVICE-NAME]",contents[1].split(":").join("^c^"));
    data = data.replace("[DEVICE-IP]",contents[0].split(":").join("^c^"));
    data = data.replace("[DEVICE-MAC]",contents[2].split(":").join("^c^"));
    data = data.replace("[AP]",contents[3].split(":").join("^c^"));
    lst.SetList( data );
    tab4.AddChild(txtTab4);
    //tab1.SetBackGradient( "red", "green", "blue", "left-right" );
    layHoriz.Animate( "Swing", ()=>{txt.Animate( "RubberBand", ()=>{txt2.Animate( "BounceLeft", ()=>{tabs.Animate( "Newspaper", ()=>{}, 1250 )}, 1250 )}, 1250 )}, 1250 )
    tab1.Animate( "Tada", ()=>{tab2.Animate( "Swing", ()=>{tab3.Animate( "Jelly", ()=>{tab4.Animate( "FallRotate", ()=>{}, 1250)}, 1250)}, 1250)}, 1250);
    
    var commands = ["home", "home", "home", "home", "home", "up", "right", "down", "left", "up"];
    for(com=0;com<commands.length;com++){
    	await sendRokuCommand(commands[com]);
    	//for(dom=0;dom<1000000;dom++){
    	
    	//}
    	app.Wait(0.35, true)
    }
    
    await sendRokuCommandBtn("18");
	// Example usage
//await sendRokuCommand("play");
//await sendRokuCommand("volumeup");
//await enablePrivateListening(12); // To launch the channel

}


function lst_OnTouch( title, body, type, index )
{
    app.ShowPopup( "Touched Item = " + title  + body );
}

async function CheckIP()
{
	if(app.FileExists("roku-remote.txt")){
		contents = app.ReadFile( "roku-remote.txt" ).split(",");
		txt.SetText(  contents[0] );
    txt2.SetText(  contents[1] );
    
    	if(utils.Confirm("We already have saved a Roku Device called: "+contents[1]+" with IP: "+contents[0]+". You want to search for a new one?")) app.DeleteFile( "roku-remote.txt" ), CheckIP();
  }else{
	await GetRokuTVIP();
	}

}


async function sendRokuCommand(command) {
    var rokuIP = "192.168.70.236"; // Replace with your Roku's IP address
    var url = "http://" + rokuIP + ":8060/keypress/" + command;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            app.ShowPopup("Command sent successfully: " + command);
        }
    };
    xhr.send();
}

async function sendRokuCommandBtn(command) {
    var rokuIP = "192.168.70.236"; // Replace with your Roku's IP address
    var url = "http://" + rokuIP + ":8060/keypress/partnerbtn/" + command;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            app.ShowPopup("Command sent successfully: " + command);
        }
    };
    xhr.send();
}

async function enablePrivateListening(channelID) {
    var launchUrl = "http://" + rokuIP + ":8060/launch/" + channelID; 
    var xhr = new XMLHttpRequest();
    xhr.open("POST", launchUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            app.ShowPopup("Channel launched successfully for Private Listening");
        }
    };
    xhr.send();
}

async function GetRokuTVIP() {
    ip = app.GetRouterAddress();
    parts = ip.split(".");
    size = parts.length;
    fromNum = parseInt(parts[size - 1]);
    toNum = 255;

    for (c = toNum; c > fromNum; c--) {
        if (found) {
            break;
        }
				rIp = rokuIP =  `${parts[0]}.${parts[1]}.${parts[2]}.${c}`;
        url = `http://${parts[0]}.${parts[1]}.${parts[2]}.${c}:8060/query/device-info`;

        try {
            app.ShowPopup(`Checking URL: \r${url}`, "Long, Top");
            await sendHttpRequest(url);
        } catch (error) {
            app.ShowPopup(`Error at ${url}: \r${error}`);
        }
    }
}

async function sendHttpRequest(url) {
    return new Promise((resolve, reject) => {
        app.HttpRequest("GET", url, null, null, (error, reply, status) => {
            if (status === 200) {
                found = true;
                deviceName = reply.slice( reply.indexOf("<friendly-device-name>") + 22, reply.indexOf("</friendly-device-name>") );
                deviceMac = reply.slice( reply.indexOf("<wifi-mac>") + 10, reply.indexOf("</wifi-mac>") );
                deviceNetwork = reply.slice( reply.indexOf("<network-name>") + 14, reply.indexOf("</network-name>") );
             
             
                   //deviceName = reply.slice( reply.indexOf("<default-device-name>") + 21, reply.indexOf("</default-device-name>") );
             
                txt.SetText(  rokuIP );
                txt2.SetText(  deviceName );
               txtTab4.SetText( deviceMac );
                app.WriteFile( "device-info.txt", reply );
                app.WriteFile( "roku-remote.txt", rokuIP+"," +deviceName + ","+deviceMac + ","+deviceNetwork);
               // resolve(reply);
                 resolve(deviceName);
            } else {
                reject(error || "Request failed");
            }
        });
    });
}


async function CreateActionBar(caption, barColor)
{
    //Create horizontal layout for top bar.
    layHoriz = app.CreateLayout( "Linear", "Bottom,Horizontal,FillX,Left" );
    layHoriz.SetBackGradient( utils.GetGradientColors(utils.GetGradientColors(barColor)[1])[0], utils.GetGradientColors(barColor)[1], utils.GetGradientColors(utils.GetGradientColors(barColor)[1])[1]);
    //color.PINK_LIGHT_4, color.PINK_DARK_2, color.PINK_ACCENT_2);
    lay.AddChild( layHoriz );
    layHoriz.SetSize( 1, 0.07 )
    
    //Create menu (hamburger) icon .
    txtMenu = app.CreateText( "[fa-home]", -1,-1, "FontAwesome" );
    txtMenu.SetPadding( 12,2,12,10, "dip" );
    txtMenu.SetTextSize( 26 );
    txtMenu.SetTextColor( "white" );
    txtMenu.SetTextShadow( 7, 2, 2, "#000000" );
    txtMenu.SetOnTouchUp( function(){y=0;/*FlipToBack();*//*ChangePage( home, "Home" ),txtMenu.SetText( "[fa-home]"); */} );
    layHoriz.AddChild( txtMenu );
    
    //Create layout for title box.
    layBarTitle = app.CreateLayout( "Linear", "Horizontal" );
    layBarTitle.SetSize( 0.73);//, 0.08791 );
    layHoriz.AddChild( layBarTitle );
    
    //Create title.
    txtBarTitle = app.CreateText( caption, -1,-1, "Left" );
    //txtBarTitle.SetFontFile( "Misc/LuckiestGuy-Regular.ttf");//Misc/YoungSerif-Regular.ttf" );
    txtBarTitle.SetMargins(5,0,0,10,"dip");
    txtBarTitle.SetTextSize( 22 );
    txtBarTitle.SetTextColor( "#ffffff");
    
    txtBarTitle.SetTextShadow( 7, 2, 2, "#000000" );
    layBarTitle.AddChild( txtBarTitle );
    
        
    //Create search icon.
    txtSearch = app.CreateText( "[fa-power-off]", -1,-1, "FontAwesome" );
    txtSearch.SetPadding( 2,2,0,10, "dip" );
    txtSearch.SetTextSize( 26  );
    txtSearch.SetTextColor( "#ffffff");
    txtSearch.SetTextShadow( 7, 2, 2, "#000000" );
    txtSearch.SetOnTouchUp( function(){/*app.OpenDrawer()*/} );
    layHoriz.AddChild( txtSearch );
    
}