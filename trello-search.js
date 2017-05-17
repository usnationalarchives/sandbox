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
		$('#results').html('<center><img width=500 src="https://catalog.archives.gov/images/loader.gif"/></center>');
		var url = 'https://api.trello.com/1/search/?key=d5df2cb0e527951048088bc1409ba72d&token=bf2cd26947cbde818dd85b35da726a1df3d5faec16412bfd8792360e18886de1&idBoards=588f598a84f5411c9d4eaacb&cards_limit=1000&card_board=true&card_list=true&query=' + keyword
		
	$('#json').html('<small>See results in: <a href="' + url + '">JSON</a></small><br/>');
	$.getJSON(url, function(t) {
		var results = ''
		for (n = 0; n < t.cards.length; n++) { 
			var name = t.cards[n].name;
			var url = t.cards[n].url;
			var description = t.cards[n].desc.replace(/\n\n/g, '<br/>')
			var label = t.cards[n].labels[0].name
			var label_color = t.cards[n].labels[0].color
			var last_activity = new Date(t.cards[n].dateLastActivity)
			var list = t.cards[n].list.name
			list_color = ''
			if (list == 'Available on Partner Website') {
			list_color = '#FFDFEF'
			}
			if (list == 'Available in National Archives Catalog') {
			list_color = '#E3FBE9'
			}
			if (list == 'Awaiting Processing at NARA') {
			list_color = '#FFE1C6'
			}
			if (list == 'Being Processed at NARA') {
			list_color = '#FFF9CE'
			}
			last_activity = last_activity.toString()
			
			var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			description = description.replace(urlRegex, function(url) {
			return '<a href="' + url + '">' + url + '</a>';
			});
			if (description == '') {
				description = '<em>[empty]</em>'
				}
			results = results + '<div style="-webkit-border-radius: 20px;-moz-border-radius: 20px;border:1px solid #000000;border-radius: 20px;background-color:#E0E0E0;"><br/><p style="margin-left:1em; font-size: 125%"><a href="' + url + '">' + name + '</a></p><div style="background-color:' + list_color + ';"><hr><p style="margin-left:1em;"><strong><u>Status</u>: ' + list + '</strong></p><hr></div><p style="margin-left:3em; margin-right:3em"><small><strong>Description:</strong><br/>' + description + '</small></p><p style="margin-right:3em;" align="right"><small><em>Last updated: ' + last_activity + '</small></em></p><center><p align="center" style="width:200px;-webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background-color:light' + label_color + ';"><small><strong>' + label + '</strong></small></p></center></div><hr>'
			}
		$('#results').html('There are <u>' + t.cards.length + '</u> <span style="color:#993333">results</span> for this search.<br/><br/>' + results)
			
			$('#json').show();
				
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
})