// Code goes here

var myApp = angular.module('myApp', [])
  .controller('GameController', ['$scope', function($scope) {

    // Init Board Function
    $scope.initBoard = function initBoard() {
      const side = $scope.side;
      let missing = [];
      for (var injector = 1; injector <= side*side; injector++){
        missing.push(injector);
      }
      let tempArray = [];
      let itemCount = 0;
      let rowCount = 0;

      while (missing.length > 0) {
        tempArray.push({
          number: missing.shift(),
          visible: true
        });
        itemCount += 1;
        if (itemCount == side) {
          $scope.board.push(tempArray);
          tempArray = [];
          itemCount = 0;
          rowCount += 1;
        }
      }

      $scope.missingTile = {
        row: side-1,
        item: side-1
      };
      $scope.board[$scope.missingTile.row][$scope.missingTile.item].visible = false;
    }

    // Scramble to generate a valid puzzle
    $scope.scrambleBoard = function scrambleBoard() {
      for (var switches = 0; switches < Math.floor(Math.floor(Math.random() * 500) + 100); switches++) {
        const direction = Math.floor(Math.random() * 10);
        const redirect = Math.floor(Math.random() * 10);
        if (direction % 2 === 0) {
          if ($scope.missingTile.row > 0 && redirect % 2 === 0) {
            $scope.switchPlacesInModel({
              row: $scope.missingTile.row - 1,
              item: $scope.missingTile.item
            }, $scope.missingTile);
          } else if ($scope.missingTile.row < $scope.side-1) {
            $scope.switchPlacesInModel({
              row: $scope.missingTile.row + 1,
              item: $scope.missingTile.item
            }, $scope.missingTile);
          }
        } else {
          if ($scope.missingTile.item > 0) {
            $scope.switchPlacesInModel({
              row: $scope.missingTile.row,
              item: $scope.missingTile.item - 1
            }, $scope.missingTile);
          } else if ($scope.missingTile.row < $scope.side-1 && redirect % 2 === 0) {
            $scope.switchPlacesInModel({
              row: $scope.missingTile.row,
              item: $scope.missingTile.item + 1
            }, $scope.missingTile);
          }
        }
      }
    }

    // Function which alters model
    $scope.switchPlacesInModel = function switchPlacesInModel(tileA, tileB) {
      $scope.tempContainer = Object.assign({}, $scope.board[tileB.row][tileB.item]);
      $scope.board[tileB.row][tileB.item] = $scope.board[tileA.row][tileA.item];
      $scope.board[tileA.row][tileA.item] = $scope.tempContainer;
      $scope.missingTile = {
        row: tileA.row,
        item: tileA.item
      };
    }

    // Init Board On Load
    $scope.startGame = function startGame(sides=3) {
      $scope.side = sides;
      $scope.displayWin = false;
      $scope.missingTile = {};
      $scope.board = [];
      $scope.initBoard();
      $scope.scrambleBoard();
      $scope.clickCounter = 0;
    }
    $scope.startGame(3);

    // Move Tile Function
    $scope.moveTile = function moveTile(row, item) {
      if (!$scope.displayWin) {
        if ($scope.board[row][item].visible) { // Check if Tile is Clickable (visible prop)
          // Compare Positions
          if ((Math.abs(row - $scope.missingTile.row) === 1 && item === $scope.missingTile.item) || (Math.abs(item - $scope.missingTile.item) === 1 && row === $scope.missingTile.row)) {
            // Add click to move counter
            $scope.clickCounter += 1;

            // Switch places
            $scope.switchPlacesInModel({
              row: row,
              item: item
            }, $scope.missingTile);

            // Check for win
            if ($scope.checkForWin()) {
              $scope.displayWin = true;
            }
          }
        }
      }
    }

    // Checks for Win Function
    $scope.checkForWin = function checkForWin() {
      let win = true;
      $scope.board.forEach((row, rowIndex) => {
        row.forEach((item, itemIndex) => {
          if (!(item.number === rowIndex * $scope.side + itemIndex + 1)) {
            win = false;
          }
        });
      });
      return win;
    }
    
    $scope.changeRows = function changeRows(operator) {
      if ($scope.side + operator >= 2){
        $scope.startGame($scope.side+operator);
      }
    }

  }]);