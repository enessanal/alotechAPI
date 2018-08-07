var callList=[];

$(document).ready(function()
{


$(document).on({
    ajaxStart: function() {  $("#waiting").show(); $(".loader").show(); $("button").attr("disabled", true); },
     ajaxStop: function() { $("#waiting").hide(); $(".loader").hide(); $("button").attr("disabled", false); }    
});
	
	var options=
	{
		format: 'yyyy-mm-dd',
		todayHighlight: true,
		autoclose: true
	};
	
	$('input[name="startDate"]').datepicker(options);
	$('input[name="endDate"]').datepicker(options);
	
	
	
	$( "#myform" ).submit(function( event ) 
	{
		var date1 = $("#start_date").val();
		var date2 = $("#end_date").val();
		var dates = {startDate:date1,endDate:date2};

		$.ajax(
		{
			url: '/api/listRecords',
			data: dates,
			type: 'GET',
			success: function(response) 
			{
				$("#tableBody").empty();
				 
				var i=0;
				callList=[];
				callList=response["CallList"];
				response["CallList"].forEach(function(record)
				{
					$("#tableBody").append
					(
						"<tr class='clickable-row' onClick='showDetails("+i+")' data-toggle='modal' data-target='#myModal' ><td>"
						+ (++i) +
						"</td><td>"
						+record["calldate"]+
						"</td><td>"
						+record["called_num"]+
						"</td><td>"
						+record["callerid"]+
						"</td><td>"
						+record["answered"]+
						"</td><td>"
						+record["duration"]+
						"</td>/tr>"
						);
				});
				 
				 
				
			},
			error: function(error) 
			{
				console.log(error);
			}
		});
		event.preventDefault();
	});
});



function showDetails(i)
{
	$("#modalTBody").empty();
	Object.keys(callList[i]).forEach(function(key)
	{
		if(key=="recordingurl")
		{

			$("#modalTBody").append("<tr><th>"+key+"</th><td><a href='"+callList[i][key]+"'>"+callList[i][key]+"</a></td></tr>");
		}
		else $("#modalTBody").append("<tr><th>"+key+"</th><td>"+callList[i][key]+"</td></tr>");
	});	
}



