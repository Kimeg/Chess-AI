var g = new G();
g.genBoard();
let moves = [];

function setup() {
  createCanvas(WIDTH, HEIGHT);
  createButtons();
  initialize();
  
  moves.push([[1,0], [2,0]]);
}

function progress(){
  var result;
  var best, best_path, best_board;
 
  //c += 1;
  //s += c.toString() + ' ' + g.realturn + '\n';
  
  result = Minimax(0, 0, true);
  best = result[0];
  best_path = result[1];
  best_board = result[2];
  //console.log(best, best_path);
  if (best_path == null) {
    console.log('done');
    //noLoop();
    return;
  }
  //print(best,best_path)
  g.move(best_path[0], best_path[1], best_path[2]);
  //s += g.display().toString() + '\n\n';
  //console.log(best, c, g.is_check());
  //print(g.leaves)
  
  g.leaves = 0;
}

function draw() {
  //var ng = 1;
  if (!paused){
    progress();  
  }
  g._draw(user_i);
}