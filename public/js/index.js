/**
**  Autor: Ángel Barroso Sanz
**  TFG : Asistente android para un recorrido monumental virtual en Segovia
**  Tutor: Jesús Cordobés Puertas
**  Universidad de Valladolid, Campus María Zambrano, Segovia
**/

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.addEventListener("backbutton", onBackKeyDown, false); //Listen to the User clicking on the back button

      	function onBackKeyDown(e) {
      	    e.preventDefault();
      	    navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No");
      	    // Prompt the user with the choice
      	}

      	function onConfirm(button) {
      	    if(button==2){//If User selected No, then we just do nothing
      	        return;
      	    }else{
      	        navigator.app.exitApp();// Otherwise we quit the app.
      	    }
      	}
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
