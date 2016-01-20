$(document).ready(init);
var ref = new Firebase('https://tictactoekk.firebaseio.com/');
var totalsRef = ref.child('totals');
var playersRef = ref.child('players');
var userid = new Date();
var turnX=true;
var champ='';
var count=0;
var users= 0;
var totals = [0,0,0,0,0,0,0,0]; //totals holds totals for combinations of three cells values
var amOnline = new Firebase('https://tictactoekk.firebaseio.com/.info/connected');
var userRef = new Firebase('https://tictactoekk.firebaseio.com/presence/' + userid);



function init(){
  $('#submit').click(enterName);

}

function enterName(){
  console.log($('#username').val());
  playersRef.once('value', function(snapshot){
    console.log(snapshot.val());

    if(!snapshot.val()){
      playersRef.push($('#username').val());
    }
    else if(Object.keys(snapshot.val()).length===1){
      playersRef.push($('#username').val());
    }
    else{
      return;
    }
  });
}

// amOnline.on('value', function(snapshot) {
//   if (snapshot.val()) {
//     userRef.onDisconnect().remove();
//     userRef.set(true);
//   }
// });


// userRef.on("child_removed",function(){
//   users-=1;
//   handleUsers();
// });
// userRef.on("child_added",function(){
//   console.log(users);
//   users+=1;
//   handleUsers();
// });
//
// function handleUsers(){
//   if(users===2){
//     startgame();
//   }
//   else{
//     stopgame();
//   }
// }

// function startgame(){
//   totalsRef.set(totals);
//   $('.col').click(clicked);
// }
//
// function stopgame(){
//   alert('user has left the game');
//   boxes = [0,0,0,0,0,0,0,0,0];
//   totals = [0,0,0,0,0,0,0,0];
//   $('.col').empty();
//   $('.col').off();
// }

// totalsRef.on('value', function(snapshot){
//   console.log(snapshot.val());
// });


  function clicked(e){
    count++
    var $clicked = $(e.target);
    $clicked.text(turnX ? 'X' : 'O');
    var data = (turnX ? 13 : 7); //13 and 7 cause they're prime numbers and i tried % first but they work just as well now.
    turnX = !turnX;
    $('#turn').text(turnX ? 'X' : 'O' );
    switch($clicked.attr('id')) {
      case 'cell1':
        boxes[0] =
        totals[0]+=data;
        totals[3]+=data;
        totals[6]+=data;
        break;
      case 'cell2':
        totals[0]+=data;
        totals[4]+=data;
        break;
      case 'cell3':
        totals[0]+=data;
        totals[5]+=data;
        totals[7]+=data;
        break;
      case 'cell4':
        totals[1]+=data;
        totals[3]+=data;
        break;
      case 'cell5':
        totals[1]+=data;
        totals[4]+=data;
        totals[6]+=data;
        totals[7]+=data;
        break;
      case 'cell6':
        totals[1]+=data;
        totals[5]+=data;
        break;
      case 'cell7':
        totals[2]+=data;
        totals[3]+=data;
        totals[7]+=data;
        break;
      case 'cell8':
        totals[2]+=data;
        totals[4]+=data;
        break;
      case 'cell9':
        totals[2]+=data;
        totals[5]+=data;
        totals[6]+=data;
        break;
    }
totalsRef.set(totals);
checkstatus();
  }

function checkstatus(){

    for(var i= 0; i<8; i++){
      if(totals[i]===39){champ = 'X';}
      if(totals[i]===21){champ = 'Y';}
    }
    if(champ){
      $('#turn').text(champ+ ' is the CHAMPION!');
      $('.col').off();
  }
    else if(count===9)$('#turn').text( 'It\'s a draw!');
  }
