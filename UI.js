function mouseClicked() {
  if (!user_turn) {
    return;
  }

  var y = parseInt((mouseX - OFFSET) / TILESIZE);
  var x = parseInt((mouseY - OFFSET) / TILESIZE);

  if (x < 0 || x > 7 || y < 0 || y > 7) {
    return;
  }

  //console.log(x,y);

  if (user_i == null) {
    if (g.board[x][y] != null) {
      user_i = [x, y];
    }
  } else {
    user_o = [x, y];
  }

  //console.log(user_i);
  //console.log(user_o);
  if (user_o != null) {
    move(g);
  }
}

function move(g) {
  var val_paths = g.valid_paths(user_i);

  var result = checkValidTarget(val_paths);
  var is_valid_move = result[0];
  var cond = result[1];

  if (is_valid_move) {
    g.move(user_i, user_o, cond);
    g.switch_turn();
    user_turn = false;
  } else {
    //console.log('invalid move')
  }

  user_i = null;
  user_o = null;
}

function checkValidTarget(val_paths) {
  for (var path of val_paths) {
    if (path[0][0] == user_o[0] && path[0][1] == user_o[1]) {
      return [true, path[1]];
    }
  }
  return [false, null];
}

function createButtons() {
  let rew_btn = document.createElement("BUTTON");
  rew_btn.innerHTML = "<--";
  document.body.appendChild(rew_btn);
  rew_btn.onclick = function() {
    g.back();
    move_count--;
  };

  let forw_btn = document.createElement("BUTTON");
  forw_btn.innerHTML = "-->";
  document.body.appendChild(forw_btn);
  forw_btn.onclick = function() {
    g.forward();
    move_count++;
  };

  let ss_btn = document.createElement("BUTTON");
  ss_btn.innerHTML = "Resume / Pause";
  document.body.appendChild(ss_btn);
  ss_btn.onclick = function() {
    paused = !paused;
  };
}