var server_name = "http://127.0.0.1:3000/";
var server= io.connect(server_name);
console.log('Client: Connected to server '+server_name);

jQuery(function($){
var tweetList = $('ul.tweets');
var love_stat = document.getElementById('love');
var hate_stat = document.getElementById('hate');
var love_cnt = document.getElementById('love_c');
var hate_cnt = document.getElementById('hate_c');
var total_cnt = document.getElementById('total_c');
server.on('analysis_done',function(data){
tweetList.prepend('<li>' + data.user + ': ' + data.text + '</li>');
love_stat.innerHTML='LOVE : '+ data.love_percentage+'%';
hate_stat.innerHTML='HATE : '+ data.hate_percentage+'%';
love_cnt.innerHTML='LOVE COUNT : ' + data.love_count;
hate_cnt.innerHTML='HATE COUNT : ' + data.hate_count;
total_cnt.innerHTML='TOTAL COUNT : ' + data.total_count;
});
});

