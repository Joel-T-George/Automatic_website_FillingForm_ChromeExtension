// receive the message from the popup and background 
chrome.runtime.onMessage.addListener(function(message,sender,reply){
	switch(message.Type){
		// Signal to Do SRF entry in Page 
		case "Add-Person-Data":
			AddSrfId(message.Message,message.url);
			reply({message:"Succesfully Recived"});	
			break;
		// Add Data to the add record 
		case "addrecordpage":
			setTimeout(addRecord_to_portal(message.Message),2000);
			reply({message:"Succesfully Recived"});
			break;
		default:
			reply({message:"Not Recived"}); 
			break;
	}
	
})

function AddSrfId(data,url){
	// verifing the current page is url
	// here enter website link 
	if(url === "Enter patient unique id page url"){
		var srf_patient = document.getElementById('srf_id')

		srf_patient.value = data["Srf No"]
	// here type portal link 
		setTimeout(function() {document.location = "Enter website redirect page link"}, 2000);
	}
}


function filler(fieldsData){
	var DomData = document.getElementById(fieldsData.id)
	
	if(fieldsData.type == "input"){
		if(DomData.value == ""){
			DomData.value = fieldsData.value
		}
	}
	if(fieldsData.type == "selection"){
		if(DomData.value == ""){
			DomData.value = fieldsData.value
		}
	}
}


function addRecord_to_portal(data){
	console.log("entry to fill")
	// html id and label of element for map
	var complete_srf_method = ["Srf No","Patient ID","Date and Time of Sample Collection","Date and Time of Sample Received","Type of Sample","Sample ID","Testing Kit Used","Date and Time of Sample Tested","E Gene/N Gene","ORF1a/ORF1b/N/N2 Gene","RdRp/S Gene","Final Result of Sample"]
	var portal_id_type = {"Srf No":["srf_id","input"],"Patient ID":["patient_id","input"],"Date and Time of Sample Collection":["sample_cdate","input"],"Date and Time of Sample Received":["sample_rdate","input"],"Type of Sample":["sample_type","selection"],"Sample ID":["sample_id","input"],"Testing Kit Used":["testing_kit_used","selection"],"Date and Time of Sample Tested":["sample_tdate","input"],"E Gene/N Gene":["covid19_result_egene","selection"],"ORF1a/ORF1b/N/N2 Gene":["orf1b_confirmatory","selection"],"RdRp/S Gene":["rdrp_confirmatory","selection"],"Final Result of Sample":["final_result_of_sample","selection"]}
	// checking the form and portal 
	var url2 = document.URL
	var person = document.getElementById("srf_id")
	
	var person_auth = 1
	

	if(url2  === "Enter website redirect page link"){
		if(person_auth == 1){
			console.log("complete auth")
			complete_srf_method.forEach(function (label){
				console.log(portal_id_type[label][1])
				var field = {
					labelData : label,
					value : data[label],
		 			type : portal_id_type[label][1],
		 			id : portal_id_type[label][0]
				}
		
				setTimeout(filler(field),2000)
		 
			})
		 	setTimeout(function(){document.location = "Enter patient unique id page url"},4000)
	
		}
		 
		
	}


}