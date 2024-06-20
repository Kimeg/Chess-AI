//var g = new G();
let _timer = 0;
let delay = 3;


function debugg(){
  console.log(g.board[0][0][1]);
  console.log(COLORS[g.board[0][0][1]]);
  console.log(g.heuristic());
  //console.log(g.display());
  console.log(g.turn);
  g.switch_turn();
  console.log(g.turn);
  
  g.move([1,0],[2,0]);
  console.log(g.display());
  g.back();
  console.log(g.display());
  
  var cp = g.current_pieces();
  console.log(cp[1]);
  var pathz = g.valid_paths(cp[1]);
  console.log(pathz);
  
  console.log(g.valid_enpassant(0, 0, 1));
  console.log(g.is_check());
  console.log(g.find_king_pos());
  
  //var result = Minimax(0,0,true);
  //console.log(result);
}

function setup(){
  createCanvas(WIDTH, HEIGHT);
  createButtons();
  initialize();
  
  g.genBoard();
  
  //debugg();
  g.switch_turn();
}

function draw(){
  _timer++;
  if (_timer<delay){
    return;
  }
  _timer = 0;
  
  /*if (!paused){
    move_count++;
    if (move_count < 100){
    RandMove();
    }
  }*/
  if (!user_turn){
    RandMove();
    user_turn = true;
  }
  
  g._draw(user_i);
}