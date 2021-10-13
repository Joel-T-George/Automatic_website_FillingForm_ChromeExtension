function ShowProfiles(data){	
	var Profile = document.getElementById("count")
	var contenthtml = `<tr>
					    	<th>Name</th>
					    	<th>Status</th>
					  	</tr>`
	if( data.length == 0 ){
		document.getElementById("status").classList.add("danger")
		document.getElementById("status").innerHTML = "Data not Found" 
	}
	else{
		if(data[1]["Patient Name"] === undefined ){
			document.getElementById("status").classList.add("danger")
			document.getElementById("status").innerHTML = "Something is Wrong or invaild Format"
		}		
		else{
		
			if(data.length > 1){
				document.getElementById("GetInputFile").style.display = "none" 
				document.getElementById("Showprofiles").style.display = "block"
				for(let i = 0; i < data.length; ++i){
					var  contentperson = `<tr>
							    		<td class="personshow" id="patientname${i}">${data[i]["Patient Name"]}</td>
							    		<td class="imgshow" id="status${i}"><img id="photoactive${i}"src="images/person.jpg"></td>
							  		</tr>`
				contenthtml += contentperson
				}
				document.getElementById("count").innerHTML = `Count is ${data.length}`
				document.getElementById("tableTodisplay").innerHTML = contenthtml
				document.getElementById("balance").innerHTML = `Balance Count ${data.length}`
			}
			if(data.length == 1){
				document.getElementById("status").classList.add("danger")
				document.getElementById("status").innerHTML = "Single Data is not Automated" 				
			}
		}
	}
}
function DisplayMessage(message,mode){
	document.getElementById("status").style.className = "";
	document.getElementById("status").classList.add(mode);
	document.getElementById("status").innerHTML = message;
}
function StatusChanger(id,Changes){
	var State = `photoactive${id}`
	if(Changes === "Waiting"){
		document.getElementById(State).src = "images/waiting.jpg"
	}
	if(Changes === "Completed"){
		document.getElementById(State).src = "images/completed.jpg"
	}
}
class AutomatePopup {
	constructor(data){
		this.ExcelData = data;
		this.FinishedCount = 0	
		this.Replay = "hello";

	}
	// Frist Sending the All Data To BackGround Scripts....
	AllDataTransfer(data,WithMethod){
		var Messages = {Type:WithMethod,DataExcel : data , Setup:"FristMove" }	
		chrome.runtime.sendMessage({Message: Messages}, function(response) {
			this.Replay = response
			if(this.Replay.message == "Succesfully Recived")
				{console.log("mission Completed")}
			if(this.Replay.message == "Not Recived")
				{console.log("mission undefiened")}
		});
	}
	// Recived Single data from background send to ContentScripts by popup Automate
	ContentPageMessage(PersonData,position,WithMethod,type){
		StatusChanger(position.id,"Waiting")
		this.FinishedCount += 1
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {Message: PersonData,Type:WithMethod,url:tabs[0].url}, function(response) {
  		
				if(response.message === "Succesfully Recived" ){
					setTimeout(function(){
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  							chrome.tabs.sendMessage(tabs[0].id, {Message: PersonData,positionDa:position,Type:"addrecordpage",url:tabs[0].url}, function(response) {
  								console.log(tabs)
								if(response.message === "Succesfully Recived" ){
									
									console.log("completed")
									setTimeout(function(){
										document.getElementById("balance").innerHTML = `Balance Count ${position.lastId - position.next}`
										StatusChanger(position.id,"Completed")

										var Messages = {Type:type ,id:position.next, Setup:"OtherMove" }
										chrome.runtime.sendMessage({Message: Messages}, function(response) {
										
											if(response.message == "Succesfully Recived")

												{console.log("mission Completed")}
											if(response.message == "Not Recived")
												{console.log("mission undefiened")}
										});
									},6000);

								}
  							});
						});	
					},6000)
				}
  			});
		});
	}
	
}
// method to do 
chrome.runtime.onMessage.addListener(function(message,sender,reply){
	switch(message.Message.Method){
		case "Update-ICMR-portal":
			if(message.Message.Type === "ICMR-UPDATE"){
				console.log(message)
				AutomatePopups.ContentPageMessage(message.Message.Data,{id: message.Message.id,next: message.Message.next,lastId:message.Message.lastId},"Add-Person-Data",message.Message.Type)
				reply({message:"Succesfully Recived"});

			}
			if(message.Message.Type === "Completed"){
				document.getElementById("status").classList.add("safe")
				document.getElementById("status").innerText = "Completed"
				reply({message:"Succesfully Recived"});
			}
			break;
	}	
});
const Custom = document.getElementById("custom-file")
const Fileselector = document.getElementById("Excelfileselection")
const GotoNextprocess = document.getElementById("nextstep")
const CustomText  = document.getElementById("custom-text")
const ShowOptions = document.getElementById("Options")
var selectedExcelFile = "sx.xlsx"
var rowobject = {}
ShowOptions.addEventListener("click", ()=>{
	if(chrome.runtime.openOptionsPage){chrome.runtime.openOptionsPage()}
	else{window.open(chrome.runtime.getURL('options.html'));}
})
Fileselector.addEventListener("change",(eventhappens)=>{
	selectedExcelFile = eventhappens.target.files[0]
	console.log(selectedExcelFile.name)
	CustomText.innerHTML = selectedExcelFile.name
	document.getElementById("status").classList.add('safe');
	document.getElementById("status").innerHTML = " Uploaded"
	
	
})
// Getting Data From Excel File and Convert to Json Format 
document.getElementById("filesubmit").addEventListener("click",()=>{
	if(selectedExcelFile && selectedExcelFile != "sx.xlsx" ){
		console.log(selectedExcelFile)
		let fileRead = new FileReader()
		fileRead.readAsBinaryString(selectedExcelFile)
		fileRead.onload = (eventhappens)=>{
			// binary format data produces in code
			var data =eventhappens.target.result
			var workbook  = XLSX.read(data,{type:"binary"})
			// convert row to jsonformat Objects with sheets
			workbook.SheetNames.forEach(sheet =>{
				rowobject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet])
				ShowProfiles(rowobject)
			})
		}
	}
	if(selectedExcelFile == "sx.xlsx"){
		document.getElementById("status").classList.add('danger');
		document.getElementById("status").innerHTML = "Please Upload the Excel File"
	}
})

GotoNextprocess.addEventListener("click", ()=>{
	var Methodtogo = document.getElementById("To-process")
	var id = Methodtogo.selectedIndex
	var Withprocess = Methodtogo.options[id].value
	AutomatePopups.AllDataTransfer(rowobject,Withprocess)
})
Custom.addEventListener("click",()=>{
	Fileselector.click()
})
var AutomatePopups = new AutomatePopup(rowobject)