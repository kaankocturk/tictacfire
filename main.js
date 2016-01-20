$(document).ready(init);
var ref = new Firebase('https://tictactoekk.firebaseio.com/');
var totalsRef = ref.child('totals');
var playersRef = ref.child('players');
var turnRef = ref.child('turn');
var boxesRef = ref.child('boxes');
var userid = new Date();
var playerturn=0;
var champ='';
var count=0;
var turn;
var users;
var boxes = [0,0,0,0,0,0,0,0,0];
var totals = [0,0,0,0,0,0,0,0]; //totals holds totals for combinations of three cells values
var amOnline = new Firebase('https://tictactoekk.firebaseio.com/.info/connected');
var userRef = new Firebase('https://tictactoekk.firebaseio.com/presence/' + userid);
var newUserRef = new Firebase('https://tictactoekk.firebaseio.com/presence/');

function init(){
  $('#submit').click(enterName);
}

amOnline.on('value', function(snapshot) {
  console.log(snapshot.val());
  if (snapshot.val()) {
    userRef.onDisconnect().remove();
    userRef.set(true);
  }
});

newUserRef.on("child_removed",function(){
  users-=1;
  handleUsers();
});

newUserRef.on("child_added",function(){
  console.log(users);
  if(!users){users=0;}
  users+=1;
  handleUsers();
});

turnRef.on('value', function(snapshot){
  console.log(snapshot.val());
  if(snapshot.val()){
    playerturn = snapshot.val();
  }
});


function enterName(){
  console.log($('#username').val());
  playersRef.once('value', function(snapshot){
    console.log(snapshot.val());
    if(!snapshot.val()){
      playersRef.push($('#username').val());
      player = $('#username').val();
      turn = 0;
    }
    else if(Object.keys(snapshot.val()).length===1){
      playersRef.push($('#username').val());
      player = $('#username').val();
      turn = 1;
    }
    else{
      return;
    }
  $('#submit').off();
  });
}

function handleUsers(){
  if(users===2){
    startgame();
  }
  else{
    stopgame();
  }
}

function startgame(){
  console.log('start');
  userRef.off('child_added');
  totals = [0,0,0,0,0,0,0,0];
  totalsRef.set(totals);
  turnRef.set(0);
  $('.col').click(clicked);
}

function stopgame(){
  // alert('user has left the game');
  totals = [0,0,0,0,0,0,0,0];
  $('.col').empty();
  $('.col').off();
  boxes = [0,0,0,0,0,0,0,0,0];
  totalsRef.set(totals);
  boxesRef.set(boxes);
}

  totalsRef.on('value', function(snapshot){
    console.log(snapshot.val());
    if(!snapshot.val()){
      totals = [0,0,0,0,0,0,0,0];
      totalsRef.set(totals);
    }
    totals = snapshot.val();
    checkstatus();
  });

boxesRef.on('value', function(snapshot){
  console.log(snapshot.val());
  if(!snapshot.val()){
    boxes = [0,0,0,0,0,0,0,0,0];
    boxesRef.set(totals);
  }
  boxes = snapshot.val();
  for(var i=0;i<9;i++){
    if(boxes[i]>0){
      var sign = (boxes[i]===13 ? 'X' : 'O');
      $('#cell'+(i+1)).text(sign);
    }
  }
});

function checkstatus(){
    for(var i= 0; i<8; i++){
      if(totals[i]===39){champ = 'X';}
      if(totals[i]===21){champ = 'O';}
    }
    if(champ){
      $('#turn').text(champ+ ' is the CHAMPION!');
      $('.col').off();
  }
    else if(count===9)$('#turn').text( 'It\'s a draw!');
  }

function clicked(e){
      if(playerturn!===turn){return;}
      else{
        count++;
        var $clicked = $(e.target);
        $clicked.text(playerturn ? 'X' : 'O');
        var data = (playerturn ? 13 : 7); //13 and 7 cause they're prime numbers and i tried % first but they work just as well now.
        playerturn = (playerturn ? 0 : 1);
        turnRef.set(playerturn);
        $('#turn').text(playerturn ? 'X' : 'O' );
        switch($clicked.attr('id')){
        case 'cell1':
          boxes[0]+=data;
          totals[0]+=data;
          totals[3]+=data;
          totals[6]+=data;
          break;
        case 'cell2':
          boxes[1]+=data;
          totals[0]+=data;
          totals[4]+=data;
          break;
        case 'cell3':
          boxes[2]+=data;
          totals[0]+=data;
          totals[5]+=data;
          totals[7]+=data;
          break;
        case 'cell4':
          boxes[3]+=data;
          totals[1]+=data;
          totals[3]+=data;
          break;
        case 'cell5':
          boxes[4]+=data;
          totals[1]+=data;
          totals[4]+=data;
          totals[6]+=data;
          totals[7]+=data;
          break;
        case 'cell6':
          boxes[5]+=data;
          totals[1]+=data;
          totals[5]+=data;
          break;
        case 'cell7':
          boxes[6]+=data;
          totals[2]+=data;
          totals[3]+=data;
          totals[7]+=data;
          break;
        case 'cell8':
          boxes[7]+=data;
          totals[2]+=data;
          totals[4]+=data;
          break;
        case 'cell9':
          boxes[8]+=data;
          totals[2]+=data;
          totals[5]+=data;
          totals[6]+=data;
          break;
      }
      boxesRef.set(boxes);
      totalsRef.set(totals);
      }
    }
