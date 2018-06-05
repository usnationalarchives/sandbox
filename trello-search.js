 $(document).ready(function() {
	
	
	window.onload = function WindowLoad() {
			
		query = window.location.search.substring(1).split("&");
		
		if (query[0] !== '') {
			params = new String();
			for (p = 0; p < query.length; p++) {
				params[query[p].split("=")[0]] = query[p].split("=")[1] 
			}
			
		keyword = params.q
		
		loadresults(keyword)

	}
	}
	
	
	$('#keyword').keypress(function(enter){
		if(enter.keyCode==13)
		$('#input').click();
		});

	$('#json').hide();
	
	function loadresults(keyword) {
		
		$('#topresults').html('<tr><td colspan="5"><center><img width=500 src="https://catalog.archives.gov/images/loader.gif"/></center></td></tr>');
		$('#table').show();
		var url = 'https://trello.com/b/koF9BuSn/fielded-digitization-tracking-board.json' 
		
	$.getJSON(url, function(t) {
		var top_results = ''
		var load_results = ''
		count = 0;
		for (n = 0; n < t.cards.length; n++) { 
			var title = t.cards[n].name;
			var pub = '';
			var naid = '';
			var record_group = '';
			var digi_by = '';
			var list = t.cards[n].idList;
			var status = '';
// 			Available on Partner Website
			if (list == '5a27058566eaed7756e33deb') {
				var status = 'style="background-color: #B28DFF"'
			};
// 			Awaiting Processing at NARA
			if (list == '5a27058566eaed7756e33dec') {
				var status = 'style="background-color: #FFF5BA"'
			};
// 			Being Processed at NARA
			if (list == '5a27058566eaed7756e33ded') {
				var status = 'style="background-color: #AFCBFF"'
			};
// 			Available in National Archives Catalog
			if (list == '5a27058566eaed7756e33dee') {
				var status = 'style="background-color: #AFF8DB"'
			};
			
			for (u = 0; u < t.cards[n].customFieldItems.length; u++) { 

				var code = t.cards[n].customFieldItems[u].idCustomField
				if (code == '5a986700d6afbd6de1c1fa91') {
					var pub = t.cards[n].customFieldItems[u].value.text
				};
				if (code == '5a986700d6afbd6de1c1fa8f') {
					var naid = t.cards[n].customFieldItems[u].value.number
				};
				if (code == '5a986700d6afbd6de1c1fa8d') {
					var record_group = t.cards[n].customFieldItems[u].value.number
				};
				if (code == '5a986700d6afbd6de1c1fa93') {
					if (t.cards[n].customFieldItems[u].idValue == '5a986700d6afbd6de1c1fa94') {
						var digi_by = 'Partner'
					};
					if (t.cards[n].customFieldItems[u].idValue == '5a986700d6afbd6de1c1fa95') {
						var digi_by = 'NARA'
					}
				};
			}
			avail = '';
			for (r = 0; r < t.cards[n].attachments.length; r++) { 
				avail = avail + '<a href="' + t.cards[n].attachments[r].url + '">' + t.cards[n].attachments[r].name + '</a><br/>'
			}
// 			avail.substr(0, avail.length-2);
// 			var url = t.cards[n].url;
// 			var label = t.cards[n].labels[0].name
// 			var label_color = t.cards[n].labels[0].color
			var last_activity = new Date(t.cards[n].dateLastActivity)
// 			var list = t.cards[n].list.name
// 			list_color = ''
// 			if (list == 'Available on Partner Website') {
// 			list_color = '#FFDFEF'
// 			}
// 			if (list == 'Available in National Archives Catalog') {
// 			list_color = '#E3FBE9'
// 			}
// 			if (list == 'Awaiting Processing at NARA') {
// 			list_color = '#FFE1C6'
// 			}
// 			if (list == 'Being Processed at NARA') {
// 			list_color = '#FFF9CE'
// 			}
			last_activity = last_activity.toString()
// 			
// 			var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
// 			description = description.replace(urlRegex, function(url) {
// 			return '<a href="' + url + '">' + url + '</a>';
// 			});
// 			if (description == '') {
// 				description = '<em>[empty]</em>'
// 				}
			if (naid != '') {
				var catalog_url = 'https://catalog.archives.gov/id/' + naid
				var title_url = '<a href="' + catalog_url + '">' + title + '</a>'
				}
			else {
				var title_url = title
				}
			new_result = '<tr title="Last updated: ' + last_activity + '" scope="row"> <td ' + status + '> </td> <td>' + pub + '</td> <td>' + title_url + '</td> <td>' + avail + '</td> <td>' + record_group + '</td> </tr>'
			
// 			'<div style="-webkit-border-radius: 20px;-moz-border-radius: 20px;border:1px solid #000000;border-radius: 20px;background-color:#E0E0E0;"><br/><p style="margin-left:1em; font-size: 125%"> Title: ' + title + '</p><p style="margin-left:1em; font-size: 125%"> NAID: ' + naid + '</p><p style="margin-left:1em; font-size: 125%"> Status: ' + status + '</p><p style="margin-left:1em; font-size: 125%"> Digitized by: ' + digi_by + '</p><p style="margin-left:1em; font-size: 125%"> Microfilm Publication: ' + pub + '</p><p style="margin-left:1em; font-size: 125%"> Record Group: ' + record_group + '</p><p style="margin-left:1em; font-size: 125%"> Last updated: ' + last_activity + '</p></center></div><hr>';
			if (count <= 9) {
				if ((keyword != '') && (keyword != '*')) {
					if (new_result.toLowerCase().includes(keyword.toLowerCase())) {
					top_results = top_results + new_result;
					count = count + 1
					}
				}
				else {
					top_results = top_results + new_result;
					count = count + 1
				}
			}
			else {
				if ((keyword != '') && (keyword != '*')) {
					if (new_result.toLowerCase().includes(keyword.toLowerCase())) {
					load_results = load_results + new_result;
					count = count + 1
					}
				}
				else {
					load_results = load_results + new_result;
					count = count + 1
				}
			}
			}
		$('#resultcount').html('There are <u>' + count + '</u> <span style="color:#993333">results</span> for this search.');
			$('#topresults').html(top_results)
			$('#loadresults').html(load_results)
			if (count > 10) {
				$('#load').show();
			}
				
	   });
	}
	 $("#input").click(function(event){
		
		var url = window.location.pathname;
		
		keyword = $('#keyword').val();
		if (keyword !== '') { keyword = '?q=' + keyword };
		newUrl=url.replace(keyword,"");
		newUrl+=keyword;
		window.location.href = newUrl;

		});
		$("#load").click(function(event){
			$('#load').hide();
			$('#loadresults').show();
			});
})