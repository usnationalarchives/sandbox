$(document).ready(function() {
				
	window.onload = function WindowLoad() {
	
	
	params = window.location.search.substring(1).split("&");
	
	if ((params[0].split("=")[0] == 'RG') || (params[0].split("=")[0] == 'collection')) {
		id = params[0].split("=")
		try {
			offset = (params[1].split("=")[1] - 1) * 50
			}
		catch(err) {
			offset = 0
			}
		loadresults(id, offset)
		}
	else if (params[0].split("=")[0] == 'keyword') {
		keyword(params[0].split("=")[1])
	}
	else {
		$('#hide').show();
	}
	}

	$('#RG').keypress(function(enter){
		if(enter.keyCode==13)
		$('#RGinput').click();
		});
	$('#collection').keypress(function(enter){
		if(enter.keyCode==13)
		$('#Collinput').click();
		});
	$('#keyword').keypress(function(enter){
		if(enter.keyCode==13)
		$('#kyinput').click();
		});
	
	function keyword(keyword) {
		
		var url = 'https://catalog.archives.gov/api/v1?rows=10000&resultTypes=recordGroup,collection&q=' + keyword;
		$.getJSON(url, function(t) {
 			if (t.opaResponse.results.total > 0) {
 				$('#front_matter').html('<p align="right"><small><a href="' + window.location.pathname + '">Return to search form</a></small></p>Displaying <strong>' + t.opaResponse.results.total + '</strong> results for this search, sorted automatically by relevance:<br/><br/>');
 			}
			else {
				$('#front_matter').html('<p align="right"><small><a href="' + window.location.pathname + '">Return to search form</a></small></p>There are <strong>0</strong> results for this search. Please try again.')
			}
			results = '';
		if (t.opaResponse.results.total > 0) {
			for (n = 0; n < t.opaResponse.results.result.length; n++) { 
				
				naid = t.opaResponse.results.result[n].naId;
				level = Object.keys(t.opaResponse.results.result[n].description)[0];
				if (level == 'collection') {
					id = t.opaResponse.results.result[n].description[level].collectionIdentifier;
					idtype = 'Collection Identifier';
					idparam = 'collection'
					}
				else {
					id = t.opaResponse.results.result[n].description[level].recordGroupNumber;
					idtype = 'Record Group Number';
					idparam = 'RG'
				}
				title = t.opaResponse.results.result[n].description[level].title;
				try {
					start_year = t.opaResponse.results.result[n].description[level].inclusiveDates.inclusiveStartDate.year
				}
				catch(err) {
					start_year = '?'
				}
				try {
					end_year = t.opaResponse.results.result[n].description[level].inclusiveDates.inclusiveEndDate.year
				}
				catch(err) {
					end_year = 'present'
				}
				year_range = start_year + ' – ' + end_year;
				series_count = t.opaResponse.results.result[n].description[level].seriesCount;
				
				results = results + ' <strong>&mdash;</strong> &nbsp; <a href="' + window.location.pathname + '?' + idparam + '=' + id +'">"<strong>' + title + '</strong>," ' + year_range + '</a><br/> &nbsp; &nbsp; &nbsp; &nbsp; <em>' + idtype + '</em>: <strong>' + id + '</strong>; &nbsp; <em>National Archives Identifier</em>: <a href="https://catalog.archives.gov/id/' + naid + '"><strong>' + naid + '</strong></a><br/> &nbsp; &nbsp; &nbsp; &nbsp; <em>Series count</em>: <strong>' + series_count + '</strong><br/><br/>'
			}
			}
			$('#table').html(results)
		});
	}
	
	function loadresults(params, offset) {
	load();
	if (params[0] == 'RG') {
		var url = 'https://catalog.archives.gov/api/v1?description.recordGroup.recordGroupNumber=' + params[1];
		type = 'Record Group';
		APItype = 'recordGroup'
		}
	if (params[0] == 'collection') {
		var url = 'https://catalog.archives.gov/api/v1?description.collection.collectionIdentifier=' + params[1];
		type = 'Collection';
		APItype = 'collection'
		}
		
	$.getJSON(url, function(t) {
		try {
			var id = t.opaResponse.results.result[0].description.recordGroup.recordGroupNumber
			}
		catch(err) {
			var id = t.opaResponse.results.result[0].description.collection.collectionIdentifier
			}
		var naid = t.opaResponse.results.result[0].naId;
		var title = t.opaResponse.results.result[0].description[APItype].title;
		var startyear = t.opaResponse.results.result[0].description[APItype].inclusiveDates.inclusiveStartDate.year;
		var endyear = t.opaResponse.results.result[0].description[APItype].inclusiveDates.inclusiveEndDate.year;
		try {
			var finding_aid = t.opaResponse.results.result[0].description[APItype].findingAidArray.findingAid.note
		}
		catch(err) {
			var finding_aid = '<em>None</em>'
		}
		var series_count = t.opaResponse.results.result[0].description[APItype].seriesCount
		var reference_unit_array = [];
		var reference_unit_array = reference_unit_array.concat(t.opaResponse.results.result[0].description[APItype].referenceUnits.referenceUnit)
		var reference_units = 'Overview of record locations:'
		for (n = 0; n < reference_unit_array.length; n++) {
			var reference_units = reference_units + '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&bull; ' + reference_unit_array[n].name + ' (' + reference_unit_array[n].mailCode + ')'
			}
		$('#front_matter').html('<p align="right"><small><a href="' + window.location.pathname + '">Return to search form</a></small></p><h1>' + title + '</h1><p><strong><a href="https://catalog.archives.gov/id/' + naid + '">' + type + ' ' + id + '</a></strong><br/><em>' + startyear + ' – ' + endyear + '</em><br/><br/><p>This ' + type + ' contains <strong>' + series_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</strong> series.</p>' + reference_units + '</p><h2>Administrative history</h2><p><strong>Established</strong>: &nbsp;&nbsp; ' + startyear + '</p><p><strong>Abolished</strong>: &nbsp;&nbsp; ' + endyear + '</p><p><strong>Finding aid</strong>: &nbsp;&nbsp; ' + finding_aid + '</p>');

// Currently, we first query the internal API for all the series in an RG/Collection, and then we make an array of all the series' NAIDs to pass as a query to the public API. We have to do this because (1) the public API fields for parentRecordGroup and parentCollection are not searchable, but (2) the internal API doesn't give us all the data we need. So we use the internal API to get the list of NAIDs, and then query them explicitly instead of querying by parent description. In the future, we'll search "https://catalog.archives.gov/api/v1?rows=10000&description.series.parentRecordGroup.recordGroupNumber="

$.getJSON('https://catalog.archives.gov/api/v1?resultFields=num,naId,description.series.creatingIndividualArray,description.series.creatingOrganizationArray,description.series.physicalOccurrenceArray,description.series.inclusiveDates,description.series.fileUnitCount,description.series.itemCount,description.series.itemAvCount,description.series.title&sort=titleSort asc&rows=50&description.series.parent' + APItype.replace(/^\w/, c => c.toUpperCase()) + '.naId=' + naid + '&offset=' + offset, function(s){
		

		rows = ''
		for (n = 0; n < s.opaResponse.results.result.length; n++) {
			
			try {
				try {
					creator_naid = s.opaResponse.results.result[n].description.series.creatingOrganizationArray.creatingOrganization.creator.naId;
					creator_name = s.opaResponse.results.result[n].description.series.creatingOrganizationArray.creatingOrganization.creator.termName;
				}
				catch (err) {
					creator_naid = s.opaResponse.results.result[n].description.series.creatingOrganizationArray.creatingOrganization[0].creator.naId;
					creator_name = s.opaResponse.results.result[n].description.series.creatingOrganizationArray.creatingOrganization[0].creator.termName;
				}
			}
			catch(err) {
				try {
					creator_naid = s.opaResponse.results.result[n].description.series.creatingIndividualArray.creatingIndividual.creator.naId;
					creator_name = s.opaResponse.results.result[n].description.series.creatingIndividualArray.creatingIndividual.creator.termName;
				}
				catch (err) {
					creator_naid = s.opaResponse.results.result[n].description.series.creatingIndividualArray.creatingIndividual[0].creator.naId;
					creator_name = s.opaResponse.results.result[n].description.series.creatingIndividualArray.creatingIndividual[0].creator.termName
				}
			}
			result_title = s.opaResponse.results.result[n].description.series.title;
			result_naid = s.opaResponse.results.result[n].naId;
			result_startyear = s.opaResponse.results.result[n].description.series.inclusiveDates.inclusiveStartDate.year;
			result_endyear = s.opaResponse.results.result[n].description.series.inclusiveDates.inclusiveEndDate.year;
			try {
				result_extent = s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence.extent;
				result_referenceunit = s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence.referenceUnitArray.referenceUnit.name;
			}
			catch(err) {
				multiextent = '';
				multireferenceunit = '';
				for (l = 0; l < s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence.length; l++) {
				if ((l == 0) || ((l > 0) && (s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence[l].extent !== s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence[l - 1].extent))) {
					multiextent = multiextent + s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence[l].extent + '<br/>'
					}
				if ((l == 0) || ((l > 0) && (s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence[l].referenceUnitArray.referenceUnit.name !== s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence[l - 1].referenceUnitArray.referenceUnit.name))) {
					multireferenceunit = multireferenceunit + s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence[l].referenceUnitArray.referenceUnit.name + '<br/>'
				}
				}
				result_extent = multiextent;
				result_referenceunit = multireferenceunit
			}
			result_fileunits = s.opaResponse.results.result[n].description.series.fileUnitCount;
			result_items = Number(s.opaResponse.results.result[n].description.series.itemCount) + Number(s.opaResponse.results.result[n].description.series.itemAvCount)
			
			rows = rows + '\
			<tr style="border: 0;" valign="top"><td><strong><a href="https://catalog.archives.gov/id/' + result_naid + '">' + result_title + ' (NAID ' + result_naid + ')</strong></a><br/>&nbsp;&nbsp;&nbsp;&nbsp; <small>Creator: <a href="https://catalog.archives.gov/id/' + creator_naid + '">' + creator_name + '</a></small></td><td>' + result_startyear + ' – ' + result_endyear + '</td><td>' + result_extent + '</td><td>' + result_referenceunit + '</td><td>' + result_fileunits + '</td><td>' + result_items + '</td></tr>\
			'
			
		}
		$('#table').html('<table width="100%" border="1"><tr><th width="40%" rowspan="2"><center>Series (National Archives Identifier)</center></th><th rowspan="2" width="12%"><center>Date range</center></th><th width="17%" rowspan="2"><center>Extent</center></th><th width="21%" rowspan="2"><center>Location</center></th><th colspan="2"><center>Records</center></th></tr><tr><th width="5%"><center>File units&nbsp; &nbsp;</center></th><th width="5%"><center>&nbsp; &nbsp;Items&nbsp; &nbsp;</center></th></tr>' + rows)
		
		page = (offset / 50) + 1
	if (series_count > 50) {
		if (series_count > 10000) {
			last = 200;
			}
		else {
			last = Math.ceil(series_count / 50);
			if (last == (series_count/50)) {
				last = last - 1;
			}
		}
		pages = '';
		if (page <= 5) {
			for (q = 1; (q <= last) && (q < 10); q++) {
				if (q == page) {
					pages = pages + '\
					<li class="active"><span>' + q + '</span></li>'
				}
				else {
					pages = pages + '\
<li><a title="Go to page ' + q + '" href="./?' + params.join("=") + '&page=' + q + '">' + q + '</a></li>'
				}
			}
			if (page < (last-8)) {
				pages = pages + '\
<li class="pager-ellipsis disabled"><span>…</span></li>'
				}
		}
		if ((page >= 6) && (page < (last-8))) {
			pages = pages + '\
<li class="pager-ellipsis disabled"><span>…</span></li>'
			for (q = (page-4); (q <= last) && (q <= (page+4)); q++) {
				if (q == page) {
					pages = pages + '\
					<li class="active"><span>' + q + '</span></li>'
				}
				else {
					pages = pages + '\
<li><a title="Go to page ' + q + '" href="./?' + params.join("=") + '&page=' + q + '">' + q + '</a></li>'
				}
			}
			pages = pages + '\
<li class="pager-ellipsis disabled"><span>…</span></li>'
		}
		if ((page >= 6) && (page > (last-8))) {
			pages = pages + '\
<li class="pager-ellipsis disabled"><span>…</span></li>'
			for (q = (page-(8-(last-page))); q <= last; q++) {
				if (q == page) {
					pages = pages + '\
					<li class="active"><span>' + q + '</span></li>'
				}
				else {
					pages = pages + '\
<li><a title="Go to page ' + q + '" href="./?' + params.join("=") + '&page=' + q + '">' + q + '</a></li>'
				}
			}
		}
		firstprev = '';
		if (page != 1) {
			firstprev = '\
<li class="first"><a href="./?' + params.join("=") + '&page=1">first</a></li>\
<li class="next"><a href="./?' + params.join("=") + '&page=' + (page-1) + '">previous</a></li>'
		}
		nextlast = ''
		if (page != last) {
			nextlast = '\
<li class="next"><a href="./?' + params.join("=") + '&page=' + (page+1) + '">next</a></li>\
<li class="pager-last"><a href="./?' + params.join("=") + '&page=' + last + '">last</a></li>'
		}
		$('#toppagination').html('<h2>Records</h2>\
		<div class="dynamic-widget"><div class="toppagination"><div class="text-center"><br/><ul class="pagination">' + firstprev + pages + nextlast + '\
</ul></div></div></div>')
		$('#bottompagination').html('</table>\
		<div class="dynamic-widget"><div class="toppagination"><div class="text-center"><br/><ul class="pagination">' + firstprev + pages + nextlast + '\
</ul></div></div></div>')
	}
	else {
	$('#toppagination').html('<h2>Records</h2>')
		$('#bottompagination').html('</table>')
	}
		});
	});
	}
load = function() {
$('#table').html('<center><img width="300px" src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif"> <h1>Loading time: <span id="seconds"></span> seconds.</h1></center>')
$('html, body').animate({ scrollTop: 0 }, 'medium');
window.setInterval((function(){
   var start = Date.now();
   var textNode = document.createTextNode('0');
   document.getElementById('seconds').appendChild(textNode);
   return function() {
        textNode.data = Math.floor((Date.now()-start).toFixed(3))/1000;
        };
   }()), 1);
}

	$("#RGinput").click(function(event){
		RG = $('#RG').val();
	
		var url = window.location.pathname;
		newParam="?RG=" + RG;
		newUrl=url.replace(newParam,"");
		newUrl+=newParam;
		window.location.href = newUrl;
	
		});

	$("#Collinput").click(function(event){
		collection = $('#collection').val();
	
		var url = window.location.pathname;
		newParam="?collection=" + collection;
		newUrl=url.replace(newParam,"");
		newUrl+=newParam;
		window.location.href = newUrl;
	
	});

	$("#kyinput").click(function(event){
		keyword = $('#keyword').val();
	
		var url = window.location.pathname;
		newParam="?keyword=" + keyword;
		newUrl=url.replace(newParam,"");
		newUrl+=newParam;
		window.location.href = newUrl;
	
	});
 });