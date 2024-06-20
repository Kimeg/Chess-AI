class G {
  constructor(x, y, r, color) {
    this.board = new Array(8);
    this.hist = {};
    this.turn = 'W';
    this.realturn = 'W';
    this.castling_possible = true;
    this.all_hist = {};
    this.leaves = 0;
  }

  heuristic() {
    var score = 0;

    var mp = [];
    var op = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] == null) {
          continue;
        }

        if (this.board[i][j].startsWith(this.realturn)) {
          mp.push(this.board[i][j][1]);
        } else {
          op.push(this.board[i][j][1]);
        }
      }
    }

    var names = ['P', 'B', 'N', 'R', 'Q'];
    var w = [1, 3, 3, 5, 9];
    var _ms = 0;
    var _os = 0;

    for (let i = 0; i < names.length; i++) {
      _ms += mp.filter(x => x === names[i]).length * w[i];
      _os += op.filter(x => x === names[i]).length * w[i];

      //_ms += mp.count(name) * w[i];
      //_os += op.count(name) * w[i];
    }

    return (_ms / (_ms + _os)) * 100;
  }


  history() {
    var s = '';
    for (var key in this.hist) {
      s += key.toString() + '\n';
      for (var info in this.hist[key]) {
        s += info + ' : ' + this.hist[key][info].toString() + '\n';
      }
      s += '\n';
    }
    return s;
  }

  display() {
    var b = [];
    for (let i = N - 1; i >= 0; i--) {
      for (let j = N - 1; j >= 0; j--) {
        var piece = this.board[i][j];
        if (this.board[i][j] == null) {
          piece = '  ';
        }
        b.push(piece);
      }
    }
    return b;
  }

  genBoard() {
    for (let i = 0; i < N; i++) {
      this.board[i] = new Array(8);
      for (let j = 0; j < N; j++) {
        this.board[i][j] = TEMPLATE[i][j];
      }
    }
  }

  switch_turn() {
    this.turn = turns[this.turn];
  }

  switch_realturn() {
    this.realturn = turns[this.realturn];
  }

  move(src, dest, special_case = null) {
    var x1 = src[0];
    var y1 = src[1];
    var x2 = dest[0];
    var y2 = dest[1];

    if (this.board[x1][y1] == null) {
      return;
    }
    if (this.board[x1][y1].startsWith(turns[this.turn])) {
      return;
    }
    if (this.board[x1][y1] == this.turn + 'K') {
      this.castling_possible = false;
    }

    var is_castling = false;
    var is_enpassant = false;
    var is_promoted = false;
    var promoted = null;
    var captured = null;
    var moved = [this.board[x1][y1]];

    if (special_case == 'castling') {
      is_castling = true;
      var king_rook = {};
      king_rook[[0, 6]] = [
        [0, 7], -1
      ];
      king_rook[[0, 2]] = [
        [0, 0], 1
      ];
      king_rook[[7, 6]] = [
        [7, 7], -1
      ];
      king_rook[[7, 2]] = [
        [7, 0], 1
      ];

      moved.push(this.turn + 'R');

      var x = king_rook[[x2, y2]][0][0];
      var y = king_rook[[x2, y2]][0][1];
      var offset = king_rook[[x2, y2]][1];

      this.board[x2][y2 + offset] = this.turn + 'R';
      this.board[x][y] = null;
      this.castling_possible = false;

    } else if (special_case == 'promotion') {
      is_promoted = true;
      promoted = this.turn + 'Q';
      this.board[x1][y1] = this.turn + 'Q';

    } else if (special_case == 'enpassant') {
      is_enpassant = true;
      captured = turns[this.turn] + 'P';
      this.board[x2 - signs[this.turn]][y2] = null;
    }

    if (this.board[x2][y2] != null && special_case != 'enpassant') {
      captured = this.board[x2][y2];
    }

    var info = [src, dest, moved, captured, promoted, is_promoted, is_castling, is_enpassant];
    this.board[x2][y2] = this.board[x1][y1];
    this.board[x1][y1] = null;
    this.update(info);
  }

  update(info) {
    //src, dest, moved, captured, promoted, is_promoted, is_castling, is_enpassant
    var names = ['src', 'dest', 'moved', 'captured', 'promoted', 'is_promoted', 'is_castling', 'is_enpassant']
    var mc;

    if (isEmpty(this.hist)) {
      mc = 0;
    } else {
      mc = max_val(Object.keys(this.hist)) + 1;
    }
    this.hist[mc] = {};
    this.all_hist[mc] = {};
    for (let i = 0; i < names.length; i++) {
      this.hist[mc][names[i]] = info[i];
      this.all_hist[mc][names[i]] = info[i];
    }
  }

  back() {
    if (isEmpty(this.hist)) {
      return;
    }
    //console.log('a');
    var latest = max_val(Object.keys(this.hist));
    var info = this.hist[latest];

    //console.log('b');
    var x1 = info['src'][0];
    var y1 = info['src'][1];
    var x2 = info['dest'][0];
    var y2 = info['dest'][1];

    //console.log('c');
    this.board[x1][y1] = info['moved'][0];
    //console.log('d');
    if (info['captured'] != null) {
      if (info['is_enpassant']) {
        this.board[x2 - signs[this.turn]][y2] = info['captured'];
        this.board[x2][y2] = null;
      } else {
        this.board[x2][y2] = info['captured'];
      }
    } else {
      this.board[x2][y2] = null;
    }
    //console.log('e');
    if (info['is_castling']) {
      var king_rook = {};
      king_rook[[0, 6]] = [
        [0, 7], -1
      ];
      king_rook[[0, 2]] = [
        [0, 0], 1
      ];
      king_rook[[7, 6]] = [
        [7, 7], -1
      ];
      king_rook[[7, 2]] = [
        [7, 0], 1
      ];

      var x = king_rook[[x2, y2]][0][0];
      var y = king_rook[[x2, y2]][0][1];
      var offset = king_rook[(x2, y2)][1];
      this.board[x2][y2 + offset] = null;
      this.board[x][y] = this.turn + 'R';
      this.castling_possible = true;
    }
    //console.log('f');
    delete this.hist[latest];
    //console.log('g');
  }

  forward() {
    var nextMove = max_val(Object.keys(this.hist));
    var info = this.all_hist[nextMove];

    var x1 = info['src'][0];
    var y1 = info['src'][1];
    var x2 = info['dest'][0];
    var y2 = info['dest'][1];

    this.board[x1][y1] = null;
    this.board[x2][y2] = info['moved'][0];

    if (info['is_enpassant']) {
      this.board[x2 - signs[this.turn]][y2] = null;
    }
    
    if (info['is_castling']) {
      var king_rook = {};
      king_rook[[0, 6]] = [
        [0, 7], -1
      ];
      king_rook[[0, 2]] = [
        [0, 0], 1
      ];
      king_rook[[7, 6]] = [
        [7, 7], -1
      ];
      king_rook[[7, 2]] = [
        [7, 0], 1
      ];

      var x = king_rook[[x2, y2]][0][0];
      var y = king_rook[[x2, y2]][0][1];
      var offset = king_rook[(x2, y2)][1];
      this.board[x2][y2 + offset] = this.turn + 'R';
      this.board[x][y] = null;
      this.castling_possible = false;
    }
    this.hist[nextMove+1] = info;
  }

  current_pieces() {
    var pieces = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (this.board[i][j] == null || this.board[i][j][0] == turns[this.turn]) {
          continue;
        }
        pieces.push([i, j]);
      }
    }
    return pieces;
  }

  valid_paths(piece) {
    var x = piece[0];
    var y = piece[1];
    var name = this.board[x][y];
    var paths = [];

    var knight_dirs = [
      [1, 2],
      [2, 1],
      [-1, -2],
      [-2, -1],
      [1, -2],
      [-1, 2],
      [-2, 1],
      [2, -1]
    ];
    var straight_dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ];
    var diag_dirs = [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1]
    ];
    var pawn_dirs = [
      [1, 0],
      [1, 1],
      [1, -1],
      [2, 0]
    ];
    var all_dirs = {
      'N': knight_dirs,
      'B': [diag_dirs],
      'R': [straight_dirs],
      'Q': [straight_dirs, diag_dirs],
      'K': [straight_dirs, diag_dirs],
      'P': pawn_dirs
    };

    var i;
    var j;
    if (name[1] == 'N') {
      for (var path of all_dirs['N']) {
        i = x + path[0];
        j = y + path[1];

        if (i < 0 || i > N - 1 || j < 0 || j > N - 1) {
          continue;
        }
        if (this.board[i][j] == null) {
          paths.push([
            [i, j], null
          ]);
          continue;
        }
        if (this.board[i][j][0] == turns[this.turn]) {
          if (this.board[i][j] != turns[this.turn] + 'K') {
            paths.push([
              [i, j], null
            ]);
          }
        }
      }
    }
    if (name[1] == 'B' || name[1] == 'R' || name[1] == 'Q' || name[1] == 'K') {
      var group = all_dirs[name[1]];
      var straight_dir = false;

      for (var dirs of group) {
        straight_dir = !straight_dir;

        var horizontal = true;
        for (var d of dirs) {
          horizontal = !horizontal;
          i = x + d[0];
          j = y + d[1];

          var count = 0;
          while (i >= 0 && i <= N - 1 && j >= 0 && j <= N - 1) {
            if (this.board[i][j] == null) {
              if (name[1] == 'K') {
                if (this.castling_possible) {
                  if (count > 2) {
                    break;
                  }
                  if ((j == 1 || j == 6) && i == edges[this.turn]) {
                    var jj;
                    if (j < 4) {
                      if (this.board[i][j] == null) {
                        jj = 2;
                      } else {
                        break;
                      }
                    } else {
                      if (this.board[i][j] == null) {
                        jj = 6;
                      } else {
                        break;
                      }
                    }
                    paths.push([
                      [i, jj], 'castling'
                    ])
                    break;
                  }
                }
                if (count == 0) {
                  paths.push([
                    [i, j], null
                  ]);
                }
                i += d[0];
                j += d[1];
                count += 1;
                continue;
              }

              paths.push([
                [i, j], null
              ])
              i += d[0];
              j += d[1];
              count += 1;
              continue;
            }
            if (this.board[i][j][0] == this.turn) {
              break;
            } else if (this.board[i][j][0] == turns[this.turn]) {
              if (this.board[i][j] != turns[this.turn] + 'K') {
                if (name[1] == 'K' && count > 0) {
                  break;
                }
                paths.push([
                  [i, j], null
                ]);
                break;
              }
              break;
              //console.log('b');
            }
          }
        }
      }
    }


    if (name[1] == 'P') {
      var dirs = all_dirs['P'];
      var sign = signs[this.turn];
      for (var d of dirs) {
        i = x + sign * d[0];
        j = y + d[1];

        if (d[1] == 0) {
          if (d[0] == 2) {
            if (i >= 0 && i < N && j >= 0 && j < N) {
              if (this.board[i - signs[this.turn]][j] != null || this.board[i][j] != null) {
                continue;
              }
            }
            if (x == edges[this.turn] + signs[this.turn]) {
              paths.push([
                [i, j], null
              ]);
            }
          } else {
            if (i >= 0 && i < N && j >= 0 && j < N) {
              if (this.board[i][j] != null) {
                continue;
              }

              var cond = null;
              if (i == edges[turns[this.turn]]) {
                cond = 'promotion';
              }
              paths.push([
                [i, j], cond
              ]);
            }
          }
        } else {
          if (i >= 0 && i < N && j >= 0 && j < N) {
            var dest = this.board[i][j];
            if (dest == null) {
              if (this.valid_enpassant(i, j, sign)) {
                paths.push([
                  [i, j], 'enpassant'
                ]);
              }
            } else if (dest[0] == this.turn) {
              continue;
            } else {
              if (dest != turns[this.turn] + 'K') {
                var cond = null;
                if (i == edges[turns[this.turn]]) {
                  cond = 'promotion';
                }
                paths.push([
                  [i, j], cond
                ]);
              }
            }
          }
        }
      }
    }

    return paths;
  }

  valid_enpassant(i, j, sign) {
    if (Object.keys(this.hist).length == 0) {
      return false;
    }
    var latest = max_val(Object.keys(this.hist));
    var info = this.hist[latest];

    var src = info['src'];
    var dest = info['dest'];

    if ((dest == [i - sign, j]) && (Math.abs(src[0] - dest[0]) == 2)) {
      return true;
    }
    return false;
  }

  is_check() {
    var knight_dirs = [
      [1, 2],
      [2, 1],
      [-1, -2],
      [-2, -1],
      [1, -2],
      [-1, 2],
      [-2, 1],
      [2, -1]
    ];
    var straight_dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ];
    var diag_dirs = [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1]
    ];
    var pawn_dirs = [
      [1, 1],
      [1, -1]
    ];
    var all_dirs = [knight_dirs, diag_dirs, pawn_dirs, straight_dirs];

    var names = {
      0: 'N',
      1: 'D',
      2: 'P',
      3: 'S'
    };

    var k_pos = this.find_king_pos();
    var x = k_pos[0];
    var y = k_pos[1];

    for (let c = 0; c < all_dirs.length; c++) {
      for (var d of all_dirs[c]) {
        var i = x + d[0];
        var j = y + d[1];

        if (c % 2 == 0) {
          if (i >= 0 && i < N && j >= 0 && j < N) {
            if ((this.board[i][j] == turns[this.turn] + 'N') && (c == 0)) {
              return true;
            }
            if (c == 2) {
              var ii = x + d[0] * signs[this.turn]
              if (this.board[ii][j] == turns[this.turn] + 'P') {
                return true;
              }
            }
          }
        } else {
          var count = 0;
          while ((i >= 0) && (i < N) && (j >= 0) && (j < N)) {
            if (c == 1) {
              if (this.board[i][j] != null) {
                if (this.board[i][j].startsWith(this.turn)) {
                  break;
                }
              }

              if ((this.board[i][j] == turns[this.turn] + 'P') ||
                (this.board[i][j] == turns[this.turn] + 'R') ||
                (this.board[i][j] == turns[this.turn] + 'N')) {
                break;
              }

              if ((this.board[i][j] == turns[this.turn] + 'B') ||
                (this.board[i][j] == turns[this.turn] + 'Q') ||
                (this.board[i][j] == turns[this.turn] + 'K')) {

                if (this.board[i][j] == turns[this.turn] + 'K') {
                  if (count == 0) {
                    return true;
                  }
                  break;
                }
                return true;
              }
            } else {
              if (this.board[i][j] != null) {
                if (this.board[i][j].startsWith(this.turn)) {
                  break;
                }
              }

              if ((this.board[i][j] == turns[this.turn] + 'P') ||
                (this.board[i][j] == turns[this.turn] + 'B') ||
                (this.board[i][j] == turns[this.turn] + 'N')) {
                break;
              }

              if ((this.board[i][j] == turns[this.turn] + 'R') ||
                (this.board[i][j] == turns[this.turn] + 'Q') ||
                (this.board[i][j] == turns[this.turn] + 'K')) {

                if (this.board[i][j] == turns[this.turn] + 'K') {
                  if (count == 0) {
                    return true;
                  }
                  break;
                }
                return true;
              }
            }

            i += d[0];
            j += d[1];
            count += 1;
          }
        }
      }
    }
    return false;
  }

  find_king_pos() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (this.board[i][j] == this.turn + 'K') {
          return [i, j];
        }
      }
    }
  }

  _draw(user_i) {
    stroke(0);
    rect(0, 0, WIDTH, HEIGHT);
    var selected_block = null;
    
    if (user_i!=null){
      
      selected_block = createVector(user_i[0], user_i[1]);
    }
    
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        var bg = BROWN;
        
        if ((i+j)%2==1){
          bg = GRAY;
        }
        
        if (selected_block!=null){
          console.log(selected_block);
          if (selected_block.x == i && selected_block.y == j){
            bg = GREEN;
          }
        }
        
        if (this.board[i][j] == null) {
          fill(bg);
          rect(j * TILESIZE + OFFSET, i * TILESIZE + OFFSET, TILESIZE, TILESIZE);
          continue;
        }
        var c;
        var s;
        if (this.board[i][j][0] == "B"){
          c = WHITE;
          s = BLACK;
        }else{
          c = BLACK;
          s = WHITE;
        }
        //c = COLORS[this.board[i][j][1]];
        
        push();
        fill(bg);
        rect(j * TILESIZE + OFFSET, i * TILESIZE + OFFSET, TILESIZE, TILESIZE);
        fill(c);
        stroke(c);
        ellipse(j * TILESIZE + OFFSET + TILESIZE/2, i * TILESIZE + OFFSET + TILESIZE/2, TILESIZE/2);
        stroke(s);
        fill(s);
        text(this.board[i][j][1], j * TILESIZE + OFFSET + TILESIZE/2, i * TILESIZE + OFFSET + TILESIZE/2);
        pop();
      }
    }
    //draw_grid();
  }
}