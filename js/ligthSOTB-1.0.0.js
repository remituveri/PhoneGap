	var timecode = 0;
	var lastTimecodeUpdate = null;
	var COLOR_MIN = 46;
	var COLOR_MAX = 214;
	
	function Hide (addr) { document.getElementById(addr).style.visibility = "hidden";	}
	function Show (addr) { document.getElementById(addr).style.visibility = "visible";	document.getElementById(addr).style.height = "auto"; }

	// Wait for PhoneGap to load
	// 
	function onLoad() {
		document.addEventListener("deviceready", onDeviceReady, false);
	}
	
	function getRealContentHeight() {
		var header = $.mobile.activePage.find("div[data-role='header']:visible");
		var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
		var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
		var viewport_height = $(window).height();
	
		var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
		if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
			content_height -= (content.outerHeight() - content.height());
		} 
		return content_height;
	}

	$(document).on('pageshow', '#pageHome', function(){       
		$.mobile.activePage.find('.ui-content').height(getRealContentHeight());
	});
	
	// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
	//
	function onDeviceReady() {
		
		// attach the onOrientationChange event listener in your script tag
		//window.addEventListener( 'onorientationchange', onOrientationChange, false );
		$(window).bind('orientationchange', onOrientationChange);

		document.addEventListener("online", onOnline,  false); 
		document.addEventListener("offline", onOffline,  false); 
		/*var connCheck =*/ setInterval(function() { 
			checkConnection();  }, 1000);	  
		document.addEventListener("volumeupbutton", onVolumeUpKeyDown, false);    
		document.addEventListener("searchbutton", onVolumeUpKeyDown, false); 

			
		//animeLogo();
	}
	
	
	function btnDemoClick() {
		Hide("pageHome");
		Show("pageSync");
	}
	
	function onOnline() {
		alert("onOnline");
		checkConnection();
	}

	function onOffline() {
		alert("onOffline");
		checkConnection();
	}
	
	function onOrientationChange( event ) {
		if(event.orientation){
			  if(event.orientation == 'portrait'){
				$.mobile.activePage.find('.ui-content').height(getRealContentHeight());
			  }
			  else if(event.orientation == 'landscape') {
				$.mobile.activePage.find('.ui-content').height(getRealContentHeight());
			  }
		}
	}
	
	function onVolumeUpKeyDown() {	        
		var elem1 = document.getElementById("pageHome");
		elem1.style.background = '#ff00aa';	
		alert( checkConnection2() );
	}
	
	function checkConnection2(){
			var networkState;
			var test = cordova.exec(
					function(winParam) {networkState = winParam;},
					function(error) {alert("Network Manager error: "+error);},
					"NetworkStatus",
					"getConnectionInfo",
					[]
			);
			return networkState;
	}
	
	function checkConnection() {
		var networkState = navigator.connection.type;
		//var networkState = (debugMode) ? navigator.network.connection.type : navigator.connection.type;
		//var networkState = navigator.network.connection.type;

		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.NONE]     = 'No network connection';

		//alert('Connection type: ' + states[networkState]);
		var elem = document.getElementById("pNetworkState");
		elem.innerHTML = 'Connection type: ' + states[networkState];
	}
	
	$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
		if ( options.onreadystatechange ) {
			var xhrFactory = options.xhr;
			options.xhr = function() {
				var xhr = xhrFactory.apply( this, arguments );
				function handler() {
					options.onreadystatechange( xhr, jqXHR );
				}
				if ( xhr.addEventListener ) {
					xhr.addEventListener( "readystatechange", handler, false );
				} else {
					setTimeout( function() {
						var internal = xhr.onreadystatechange;
						if ( internal ) {
							xhr.onreadystatechange = function() {
								handler();
								internal.apply( this, arguments ); 
							};
						}
					}, 0 );
				}
				return xhr;
			};
		}
	});
	
	
	function pad(d) {
		return (d < 10) ? '0' + d.toString() : d.toString();
	}
	
