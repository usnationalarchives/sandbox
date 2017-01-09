 $(document).ready(function() {
	
	
	window.onload = function WindowLoad() {
			
		query = window.location.search.substring(1).split("&");
		
		if (query[0] !== '') {
			params = new String();
			for (p = 0; p < query.length; p++) {
				params[query[p].split("=")[0]] = query[p].split("=")[1] 
			}
			
		if (params.FOIA == undefined) { FOIA_tracking_no = '*:*'}
			else { FOIA_tracking_no = params.FOIA };
		if (params.q == undefined) { keyword = '*:*'}
			else { keyword = params.q };
		if (params.offset == undefined) { offset = 0 }
			else { offset = Number(params.offset) };
		loadresults(offset, FOIA_tracking_no)
				}
	}
	
	
	$('#FOIA').keypress(function(enter){
		if(enter.keyCode==13)
		$('#input').click();
		});
	$('#keyword').keypress(function(enter){
		if(enter.keyCode==13)
		$('#input').click();
		});
	$('#jumpval').keypress(function(enter){
		if(enter.keyCode==13)
		$('#jump').click();
		});
	
	$('#paginate').hide();
	$('#paginatebottom').hide();
	$('#json').hide();
	
	
	function loadresults(offset, FOIA_tracking_no) {
		var start = offset + 1;
		var end = offset + 25;
		$('#file_unit_results').html('<center><img width=500 src="https://catalog.archives.gov/images/loader.gif"/></center>');
		var url = 'https://catalog.archives.gov/api/v1?description.fileUnit.variantControlNumberArray.variantControlNumber.type.naId=10675637&description.fileUnit.variantControlNumberArray.variantControlNumber.number=' + FOIA_tracking_no + '&q=' + keyword + '&rows=25&type=description&resultFields=description.fileUnit,objects.object.thumbnail,naId,num&offset=' + offset
	$('#json').html('<small>See results in: <a href="' + url + '">JSON</a> | <a href="' + url + '&format=xml">XML</a></small><br/><br/>');
	$.getJSON(url, function(t) {
			var file_units = t.opaResponse.results.total.toLocaleString("en");
			var time = new Date(t.opaResponse.time);
			time = time.toString()
			if (end > file_units) {
				count = end - file_units;
				end = file_units
				};
			if (file_units < 25) {
			$('#file_units').html('<ul><ul><h3>File units</h3></ul></ul><ul><ul>There are <u>' + file_units + '</u> <span style="color:#993333">file units</span> for this search. Displaying results ' + start + ' – ' + file_units + ':</ul></ul></ul></ul><br/><br/>')
			}
			else {
			$('#file_units').html('<ul><ul>There are <u>' + file_units + '</u> <span style="color:#993333">file units</span>. Displaying results ' + start + ' – ' + end + ':</ul></ul><br/><br/>');
			$('#paginate').show();
			$('#paginatebottom').show();
			}
			$('#time').html('<small>This data was generated at<br/>' + time + '<br/> </small>');
			$('#json').show();
			var results = ''
			if (offset < t.opaResponse.results.total) {
				for (n = 0; n < t.opaResponse.results.result.length; n++) { 
					title = t.opaResponse.results.result[n].description.fileUnit.title;
					naid = t.opaResponse.results.result[n].naId;
					creator = t.opaResponse.results.result[n].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName;
					try {
						thumbnail = t.opaResponse.results.result[n].objects.object.thumbnail['@url'];
					}
					catch (err) {
						try {
						thumbnail = t.opaResponse.results.result[n].objects.object[0].thumbnail['@url'];
						}
						catch (err) {
						thumbnail = 'https://catalog.archives.gov/images/fileunit.svg'
						}
					}
					creator_naid = t.opaResponse.results.result[n].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.naId;
					series = t.opaResponse.results.result[n].description.fileUnit.parentSeries.title
					series_naid = t.opaResponse.results.result[n].description.fileUnit.parentSeries.naId
					series_dates = t.opaResponse.results.result[n].description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year + ' – ' + t.opaResponse.results.result[n].description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year

						tracking_numbers = []
						tracking_numbers.push(t['opaResponse']['results']['result'][n]['description']['fileUnit']['variantControlNumberArray'])
						tracking_number = tracking_numbers[0]['variantControlNumber']['number']
// 							catch (err) {
// 								for (y = 0; y < t.opaResponse.results.result[n].description.fileUnit.variantControlNumberArray.variantControlNumber.length; y++) {
// 									if (t.opaResponse.results.result[n].description.fileUnit.variantControlNumberArray.variantControlNumber[y].type.naId == 10675637) { 
// 									tracking_number = t.opaResponse.results.result[n].description.fileUnit.variantControlNumberArray.variantControlNumber[y].number
// 							}
// 							}
// 							}
					results = results + '<tr><td class="results" width="10%" valign="top" align="left"><a href="https://catalog.archives.gov/id/' + naid + '"><img width="75" src="' + thumbnail + '"/></a></td><td class="results" width="85%"><a href="https://catalog.archives.gov/id/' + naid + '">"<strong>' + title + '</strong>" (NAID ' + naid + ')</a><br/><ul>Creator: <a href="https://catalog.archives.gov/id/' + creator_naid + '">' + creator + '</a><br/>Series: &nbsp;"<a href="https://catalog.archives.gov/id/' + series_naid + '">' + series + '</a>" (' + series_dates + ')<br/>FOIA tracking number: <strong>' + tracking_number + '</strong></ul></td></tr>'
				}
			}
			else {
				if (t.opaResponse.results.total > 0) {
					results = '<p><strong>There are no further results for this search. Please use the buttons above to navigate to a page with results.</strong></p>';
			$('#file_units').html('<ul><ul>There are <u>' + file_units + '</u> <span style="color:#993333">file units</span> for this search.</ul></ul><br/><br/>')
					}
				else {
					results = '';
			$('#file_units').html('<ul><ul><strong>There are no results for this search. Please try again.</strong></ul></ul><br/><br/>')
			}
				}
			$('#file_unit_results').html(results);
	   });
	}
	 $("#input").click(function(event){
		
		var url = window.location.pathname;
		
		FOIA_tracking_no = $('#FOIA').val();
		keyword = $('#keyword').val();
		if (FOIA_tracking_no !== '') { FOIA_tracking_no = '&FOIA=' + FOIA_tracking_no };
		if (keyword !== '') { keyword = '&q=' + keyword };
		newParam = '?offset=0' + FOIA_tracking_no + keyword
		newUrl=url.replace(newParam,"");
		newUrl+=newParam;
		window.location.href = newUrl;

		});
		
	$("#next").click(function(event){
		offset = offset + 25;
		loadresults(offset, FOIA_tracking_no);
	});
	$("#prev").click(function(event){
		if (offset > 24) {
			offset = offset - 25;
			loadresults(offset, FOIA_tracking_no);
		}
	});
	$("#nextbot").click(function(event){
		offset = offset + 25;
		loadresults(offset, FOIA_tracking_no);
	});
	$("#prevbot").click(function(event){
		if (offset > 24) {
			offset = offset - 25;
			loadresults(offset, FOIA_tracking_no);
		}
	});
	$("#jump").click(function(event){
		var jumpval = $('#jumpval').val();
		offset = (jumpval - 1) * 25;
		loadresults(offset, FOIA_tracking_no);
});
})