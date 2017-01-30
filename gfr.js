$(document).ready(function() {
				
	window.onload = function WindowLoad() {
	
	
	params = window.location.search.substring(1).split("=");
	
	if ((params[0] == 'RG') || (params[0] == 'collection')) {
		loadresults(params)
		}
	else if (params[0] == 'keyword') {
		keyword(params[1])
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
			$('#records').html(results)
		});
	}
	
	function loadresults(params) {
	
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

		$.getJSON('https://catalog.archives.gov/OpaAPI/iapi/v1?action=search&f.level=series&f.parentNaId=' + naid + '&q=*:*&rows=10000', function(f){
		series_naids = []
		for (n = 0; n < f.opaResponse.results.result.length; n++) {
			series_naids.push(f.opaResponse.results.result[n].naId);
		}
		$.getJSON('https://catalog.archives.gov/api/v1?sort=titleSort asc&rows=10000', {'naIds': series_naids.slice(0,750).toString() }, function(s){
		
		creator_naids = [];
		creator_names = [];
		result_titles = [];
		result_naids = [];
		result_startyears = [];
		result_endyears = [];
		result_extents = [];
		result_items = [];
		result_fileunits = [];
		result_referenceunits =[]
		for (n = 0; n < s.opaResponse.results.result.length; n++) {
			
			try {
				try {
					creator_naids.push(s.opaResponse.results.result[n].description.series.creatingOrganizationArray.creatingOrganization.creator.naId);
					creator_names.push(s.opaResponse.results.result[n].description.series.creatingOrganizationArray.creatingOrganization.creator.termName);
				}
				catch (err) {
					creator_naids.push(s.opaResponse.results.result[n].description.series.creatingOrganizationArray.creatingOrganization[0].creator.naId);
					creator_names.push(s.opaResponse.results.result[n].description.series.creatingOrganizationArray.creatingOrganization[0].creator.termName);
				}
			}
			catch(err) {
				try {
					creator_naids.push(s.opaResponse.results.result[n].description.series.creatingIndividualArray.creatingIndividual.creator.naId);
					creator_names.push(s.opaResponse.results.result[n].description.series.creatingIndividualArray.creatingIndividual.creator.termName);
				}
				catch (err) {
					creator_naids.push(s.opaResponse.results.result[n].description.series.creatingIndividualArray.creatingIndividual[0].creator.naId);
					creator_names.push(s.opaResponse.results.result[n].description.series.creatingIndividualArray.creatingIndividual[0].creator.termName);
				}
			}
			result_titles.push(s.opaResponse.results.result[n].description.series.title);
			result_naids.push(s.opaResponse.results.result[n].description.series.naId);
			result_startyears.push(s.opaResponse.results.result[n].description.series.inclusiveDates.inclusiveStartDate.year);
			result_endyears.push(s.opaResponse.results.result[n].description.series.inclusiveDates.inclusiveEndDate.year);
			try {
				result_extents.push(s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence.extent);
				result_referenceunits.push(s.opaResponse.results.result[n].description.series.physicalOccurrenceArray.seriesPhysicalOccurrence.referenceUnitArray.referenceUnit.name);
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
				result_extents.push(multiextent);
				result_referenceunits.push(multireferenceunit)
			}
			result_fileunits.push(s.opaResponse.results.result[n].description.series.fileUnitCount);
			result_items.push(Number(s.opaResponse.results.result[n].description.series.itemCount) + Number(s.opaResponse.results.result[n].description.series.itemAvCount))
		}
		var creator_naid_list = creator_naids.filter(function(elem, pos) {
			return creator_naids.indexOf(elem) == pos;
		});
		var creator_name_list = creator_names.filter(function(elem, pos) {
			return creator_names.indexOf(elem) == pos;
		});
		sections = []
		for (i = 0; i < creator_naid_list.length; i++) {
		rows = ''
			for (y = 0; y < creator_naids.length; y++) {
				if (creator_naids[y] == creator_naid_list[i]) {
				rows = rows + '<tr><td><strong><a href="https://catalog.archives.gov/id/' + result_naids[y] + '">' + result_titles[y] + '</strong></a><br/>&nbsp;&nbsp;&nbsp;&nbsp; (NAID: ' + result_naids[y] + ')</td><td>' + result_startyears[y] + ' – ' + result_endyears[y] + '</td><td>' + result_extents[y] + '</td><td>' + result_referenceunits[y] + '</td><td>' + result_fileunits[y] + '</td><td>' + result_items[y] + '</td></tr>'
				}
			}
		
		sections.push({title: creator_name_list[i], section: '<h3><a href="https://catalog.archives.gov/id/' + creator_naid_list[i] + '">' + creator_name_list[i] + '</a></h3><br/><table width="100%" border="1"><tr><th width="40%" rowspan="2"><center>Series (National Archives Identifier)</center></th><th rowspan="2" width="12%"><center>Date range</center></th><th width="17%" rowspan="2"><center>Extent</center></th><th width="21%" rowspan="2"><center>Location</center></th><th colspan="2"><center>Records</center></th></tr><tr><th width="5%"><center>File units</center></th><th width="5%"><center>Items</center></th></tr>' + rows + '</table>'})
		}

		sections.sort(function(a, b){
			if(a.title < b.title) return -1;
			if(a.title > b.title) return 1;
			return 0;
			});
		sortedsections =[];
		for (w = 0; w < sections.length; w++) {
			sortedsections.push(sections[w].section)
		};
		$('#records').html('<h2>Records</h2>' + sortedsections.join('<br/>'))
		});
		});
	});
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
	
		var url = window.location.pathname,
		newParam="?collection=" + collection;
		newUrl=url.replace(newParam,"");
		newUrl+=newParam;
		window.location.href = newUrl;
	
	});

	$("#kyinput").click(function(event){
		keyword = $('#keyword').val();
	
		var url = window.location.pathname,
		newParam="?keyword=" + keyword;
		newUrl=url.replace(newParam,"");
		newUrl+=newParam;
		window.location.href = newUrl;
	
	});
 });