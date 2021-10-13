// this receive the message of content , popups and methods
chrome.runtime.onMessage.addListener(function(message,sender,reply){

	
	switch (message.Message.Type){
		// Receiving Message for Completed Srf and Update Icmr Portal
		case "ICMR-UPDATE":
			// Intial step of sending data to Popup Page
			if(message.Message.Setup === "FristMove"){
				Backgroundjs.Startup(message.Message.DataExcel);
				Backgroundjs.SendSingleData(0,message.Message.Type,"Update-ICMR-portal");
				reply({message : "Succesfully Recived"});
			}
			// Next and Loop step of sending data to Popup Page
			if(message.Message.Setup === "OtherMove"){
				Backgroundjs.SendSingleData(message.Message.id,message.Message.Type,"Update-ICMR-portal");
				reply({message : "Succesfully Recived"});
			}
			break;
		default:
			// Something went wrong message
		 	reply({message:"Not Recived"});

	}	
});

// Function of Getting the Data and Sending to content and popup file 
class BackgroundScriptEngine{
	constructor(){
		this.Data = {};
	}
	// Inital data get from the popup page .
	Startup(data){
		this.Data.Member =data
		
	}
	// Single Data Sending Popup page query by index of array.
	SendSingleData(id,type,method){
		var Messages = {
			Method:method,
			Type :type,
			Data : this.Data.Member[id],
			id: id,
			next: id+1,
			lastId: this.Data.Member.length
		}
		// Sending the single data  to popup page 
		if(id < this.Data.Member.length){
			chrome.runtime.sendMessage({Message: Messages}, function(response) {
			
				if(response.message == "Succesfully Recived")
				{console.log("Data-Received")}
				if(response.message == "Not Recived")
				{console.log("Data-NotReceived")}
			});
		}
		
		else{
			var Messages = {
				Method:method,
				Type :"Completed",
				Data : this.Data.Member[id],
				next: id+1,
				lastId: this.Data.Member.length
			}
			chrome.runtime.sendMessage({Message: Messages}, function(response) {
			
				if(response.message == "Succesfully Recived")
					{console.log("Data-Received")}
				if(response.message == "Not Recived")
					{console.log("Data-NotReceived")}
			});
		}
	}
}

var Backgroundjs = new BackgroundScriptEngine()