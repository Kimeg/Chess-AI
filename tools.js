let N = 8;
let WIDTH = 400;
let HEIGHT = 400;
let TILESIZE = parseInt(WIDTH/N);
let OFFSET = 0;

let BLACK;
let BROWN;
let GRAY;
let WHITE;
let GREEN;
let BLUE;
let RED; 
let PURPLE;
let YELLOW;

let COLORS = {};
let turns = {'W':'B','B':'W'}
let signs = {'W':1, 'B':-1}
let edges = {'W':0, 'B':7}

let max_depth = 2;
let regular_board =[['BR','BN','BB','BQ','BK','BB','BN','BR'],
                   ['BP','BP','BP','BP','BP','BP','BP','BP'],
                   [null,null,null,null,null,null,null,null],
                   [null,null,null,null,null,null,null,null],
                   [null,null,null,null,null,null,null,null],
                   [null,null,null,null,null,null,null,null],
                   ['WP','WP','WP','WP','WP','WP','WP','WP'],
                   ['WR','WN','WB','WQ','WK','WB','WN','WR']];
let TEMPLATE = regular_board.reverse();

let user_i = null;
let user_o = null;
let user_turn = true;
let paused = false;
let move_count = 0;
var g = new G();

function initialize(){
        
  BROWN = color(165,100,100);
  BLACK = color(0, 0, 0);
  GRAY = color(122, 122, 122);
  WHITE = color(255, 255, 255);
  GREEN = color(0,255,0);
  BLUE = color(0,0,255);
  RED = color(255, 0, 0);
  PURPLE = color(255, 0, 255);
  YELLOW = color(255,255,0);

  COLORS = {'K':RED, 'Q':BLUE, 'R':GREEN, 'N':YELLOW, 'B':PURPLE, 'P':WHITE};
}

function copy_board(board){
    var new_arr = [];
    for (let i=0; i<new_arr.length; i++){
        new_arr.push([]);
      
        for (let j=0; j<new_arr[i].length; j++){
            new_arr[i].push(board[i][j]);
        }
    }
    return new_arr;
}
                    
function searchValidPaths(g, pieces){
    var valid_paths = [];
    for (var piece of pieces){
        paths = g.valid_paths(piece);

        for (var path of paths){
            //console.log(paths);
            g.move(piece, path[0], path[1]);


            
            if (!g.is_check()){
                valid_paths.push([piece, path[0], path[1]]);
                //console.log('x');
            }
            //console.log('y');
            g.back();
            //console.log('z');
        }
    }
  
    return valid_paths;
}

function getRandomInt(n) {
    return Math.floor(Math.random() * Math.floor(n));
}

function Minimax(depth, best, maximizing){
    g.leaves += 1;
    //console.log(depth);
    var h = g.heuristic();
    if (depth == max_depth || h < best){
        return h;
    }
    
    g.switch_turn();
    
    var pieces = g.current_pieces();
    var checked = g.is_check();
    
    var valid_paths = searchValidPaths(g, pieces);
  
    //console.log(valid_paths);
    var _sign;
    let best_path;
    let best_board;

    if (maximizing){
        best = h;
        _sign = 1;
    }else{
        best = 9999;
        _sign = -1;
    }

    
    if (valid_paths.length==0){
        if (depth == 0){
            return [h, null, null];
        }
        if (checked){
            if (maximizing){
                g.switch_turn();
                return 0;
            }else{
                g.switch_turn();
                return 9999;
            }
        }else{
            return 0;
        }
    }else{
        valid_paths = shuffle(valid_paths);
        best_path = valid_paths[getRandomInt(valid_paths.length)];
        best_board = copy_board(g.board);
      
        for (var path of valid_paths){
            //console.log(path[0], path[1], path[2]);
            g.move(path[0], path[1], path[2])
            //await sleep(1);
            var score = Minimax(depth+1, best, !maximizing);
            var temp_board = copy_board(g.board);
            g.back();
            if (_sign*best <= _sign*score){
                best = score;
                best_path = path;
                best_board = temp_board;
            }
        }
    }
    if (depth==0){
        g.switch_realturn();
        return [best, best_path, best_board]
    }
    g.switch_turn();
    return best
}

function RandMove(){
    console.log(user_turn);
    var pieces = g.current_pieces();
    console.log('x');
    
    var checked = g.is_check();
    console.log('y');
    
    var valid_paths = searchValidPaths(g, pieces);
  
    //console.log(valid_paths);

    if (valid_paths.length==0){
      return;
    }else{
      valid_paths = shuffle(valid_paths);
      
      var path = valid_paths[0];
      g.move(path[0], path[1], path[2])
    }
    g.switch_turn();
}

function draw_grid(){
    for (let i=0;i<N+1;i++){
        stroke(0);
        line(OFFSET, i*TILESIZE + OFFSET, OFFSET + WIDTH, i*TILESIZE + OFFSET);
        line(i*TILESIZE + OFFSET, OFFSET, i*TILESIZE + OFFSET, OFFSET + HEIGHT);
    }
}

function max_val(arr){
  var mx = 0;
  
  for (var val of arr){
    if (parseInt(val) > mx){
      mx = parseInt(val);
    }
  }
  return mx;
}

function isEmpty(obj) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}