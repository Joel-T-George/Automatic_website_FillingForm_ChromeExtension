var Hours_Sample_r =document.getElementById('hourssr')
var Minutes_Sample_r=document.getElementById('minutessr')
var Seconds_Sample_r=document.getElementById('secondssr')
var Hours_Sample_t=document.getElementById('hoursst')
var Minutes_Sample_t=document.getElementById('minutesst')
var Seconds_Sample_t=document.getElementById('secondsst')
function downloadExcel(data,filename){
	const EXCELAPP = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const EXTENSIONFILE =".xlsx"
	var worksheet = XLSX.utils.json_to_sheet(data);
	const workbook = {
		Sheets : {
			"data":worksheet
		},
		SheetNames:["data"]
	}
	const excelbuffer = XLSX.write(workbook,{bookType:"xlsx",type:'array'})
	SaveExcelFile(excelbuffer,filename,EXTENSIONFILE,EXCELAPP)


}
function SaveExcelFile(excelbuffer,filename,EXTENSIONFILE,EXCELAPP){
	const data =new Blob([excelbuffer],{type:EXCELAPP})
	saveAs(data,filename+EXTENSIONFILE)

}
const ButtonFileCompSrfUpdIcmr = document.querySelector("#FileCompSrfUpdIcmr")
// Data Headers and Different type
var CompleteSrfUpdateICMR = [ {"Srf No":"0000000000000","Patient Name":"John Brown","Patient ID":"00000000","Age":"30","Gender":"M","Mobile":"564646262","Patient Category":"SOME CATEOGORY","Date and Time of Sample Collection":"dd-mm-yyyy hh:mm:ss","Date and Time of Sample Received":"dd-mm-yyyy hh:mm:ss","Type of Sample":"Nasal Swab","Sample ID":"345342654","Symptoms Status":"Symptomatic","Patient Hospitalized?":"No","Testing Kit Used":"Cosara Diagnostics-SARAGENE","Date and Time of Sample Tested":"dd-mm-yyyy hh:mm:ss","E Gene/N Gene":"Negative","ORF1a/ORF1b/N/N2 Gene":"Negative","RdRp/S Gene":"Negative","Final Result of Sample":"Negative"} ]


ButtonFileCompSrfUpdIcmr.addEventListener("click",()=>{
	downloadExcel(CompleteSrfUpdateICMR,"Complete_SRF_Portal_TO_Update_ICMR_Portal")
})


// time reset 
function restore_options() {

  chrome.storage.local.get({

		Hours_sr:"00",
		Minutes_sr:'00',
		Seconds_sr:'00',
		Hours_st:'00',
		Minutes_st:'00',
		Seconds_st:'00'
		
  }, function(items) {
    Hours_Sample_t.value = items.Hours_st
    Minutes_Sample_t.value = items.Minutes_st
	Seconds_Sample_t.value = items.Seconds_st
	Hours_Sample_r.value = items.Hours_sr
    Minutes_Sample_r.value = items.Minutes_sr
	Seconds_Sample_r.value = items.Seconds_sr
  });

}
function CheckTimes(h,m,s,type){
	var hour = parseInt(h),minute = parseInt(m),second = parseInt(s)
	if(h.length == 2 && m.length == 2 && s.length == 2){
		
		switch(type){
			case "recevied":
				chrome.storage.local.get(["Hours_sr","Minutes_sr","Seconds_sr"], function(data){
					var format_time = `${data.Hours_sr}:${data.Minutes_sr}:${data.Seconds_sr}`
					
					if(format_time != `${h}:${m}:${s}`){
						if(hour < 2 && hour >=0 && minute < 60 && minute >=0 && second < 60 && second >=0){
							var time={
								"Hours_sr":h,
								"Minutes_sr":m,
								"Seconds_sr":s
							}
							chrome.storage.local.set(time,function(){
								alert("collection time to recevied duration changed")
							})
						
						}
					}
					else{
						alert("same commited")
					}
				})
				break
			case "tested":
				chrome.storage.local.get(["Hours_st","Minutes_st","Seconds_st"], function(data){
					var format_time = `${data.Hours_st}:${data.Minutes_st}:${data.Seconds_st}`
				
					if(format_time != `${h}:${m}:${s}`){
						if(hour < 5 && hour >=0 && minute < 60 && minute >=0 && second < 60 && second >=0){
							var time={
								"Hours_st":h,
								"Minutes_st":m,
								"Seconds_st":s
							}
							chrome.storage.local.set(time,function(){
								alert("recevied  to tested duration changed")
							})
						}
					}
					else{
						alert("same commited")
					}
				
				})
				break;
		}
	}
	else{
		alert("time format is wrong  "+`HH:MM:SS`)
	}
}

document.addEventListener('DOMContentLoaded', restore_options)

document.getElementById('recevied_btn').addEventListener('click',function(){
	CheckTimes(Hours_Sample_r.value,Minutes_Sample_r.value,Seconds_Sample_r.value,"recevied")
	

	
})
document.getElementById('Tested_btn').addEventListener('click',function(options){
	CheckTimes(Hours_Sample_t.value,Minutes_Sample_t.value,Seconds_Sample_t.value,"tested")

})
