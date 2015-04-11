//$(document).ready(function() {
//$('#messages_search').livefilter({selector: 'ul a'});
//});

var options = {
  valueNames: ['subject', 'date', 'from', 'to']
};

var messagesList = new List('messages_list', options);