var selectedExcelFile = "sx.xlsx"
var rowobject ;
document.getElementById("Excelfileselection").addEventListener("change",(eventhappens)=>{
	selectedExcelFile = eventhappens.target.files[0]
	
})
// Getting Data From Excel File and Convert to Json Format 
document.getElementById("filesubmit").addEventListener("click",()=>{
	if(selectedExcelFile){
		let fileRead = new FileReader()
		fileRead.readAsBinaryString(selectedExcelFile)
		fileRead.onload = (eventhappens)=>{
			// binary format data produces in code
			var data =eventhappens.target.result
			var workbook  = XLSX.read(data,{type:"binary"})
			// convert row to jsonformat Objects with sheets
			workbook.SheetNames.forEach(sheet =>{
				var rowobject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet])
				console.log(rowobject)
				
				document.getElementById("GetInputFile").style.display = "none" 
				document.getElementById("Showprofiles").style.display = "block"
				ShowProfiles(rowobject)
			})
			
		}
		
		
		
	}
})
function ShowProfiles(data){
	console.log(data[0][" Patient Name"])
	var Profile = document.getElementById("count")

	var contenthtml = `<tr>
					    	<th>Name</th>
					    	<th>Status</th>
					  	</tr>`
	if(data.length != 0){
		for(let i = 0; i < data.length; ++i){
			var  contentperson = `<tr>
					    		<td class="personshow" id="patientname${i}">${data[i][" Patient Name"]}</td>
					    		<td class="imgshow" id="status${i}"><img src="images/person.jpg"></td>
					  		</tr>`
		contenthtml += contentperson
		}
		document.getElementById("count").innerHTML = `Count is ${data.length}`
		document.getElementById("tableTodisplay").innerHTML = contenthtml

	}
	else{
		Profile.innerHTML = "data not present in excelfile"
	}
}

