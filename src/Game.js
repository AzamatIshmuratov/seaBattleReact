import React, { Component } from 'react'

let dimMatr = 8;                    //Matrix dimension 8x8 (размерность)
let dimMatr2 = dimMatr * dimMatr; 
let pluses;                         //Глобальная переменная с индексами кораблей
let randPlayer = [];                //Рандомные позиции кораблей игрока
let randComp = [];                  //Рандомные позиции кораблей компьютера
let currPlayer = 'player';          //Current move
let randMovesComp = [];             //рандомные ходы компьютера
let statusWin = '';                 //победа или поражение (по завершению игры)

function Square(props) {
    let classN = "square";
    let rand = props.name === "player" ? randPlayer : randComp;
    if (props.name === 'player'){
      classN = "square computer";  //класс "computer" применяется к ячейкам компьютера (левое пооле)
      if(!isNaN(rand.find((elem) => elem === props.index)))  //если находим корабли
         classN += " colorize";     //добавляем данный класс ячейке с кораблями 
    }

    return ( //при клике по кнопке выполняется функция handlrClick (ниже)
      <button className={classN} onClick={props.onClick}> 
        {props.value}
      </button>
    );
}

class Board extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        squares: Array(dimMatr2).fill(null), //всего ячеек
        countMove: dimMatr2,   //Количество ходов 
        countDestroy: dimMatr, //Количество кораблей для ничтожения
      };
    }
  
    handleClick(i) {
      
      if (currPlayer === this.props.name) return; //если текущий ход равен глобальному currPlayer(тек. ход), то ничего не делаем

      const squares = this.state.squares.slice();

      if (isWinner(this.state.squares, this.props.name)){
        let winner = document.querySelector(".statusWin");
        winner.style.display = "block";
        statusWin = this.props.name === 'player' ? 'Поражение!' : 'Победа!';
      }

      if (!this.state.countMove || (squares[i]) || isWinner(this.state.squares, this.props.name)) {  //Если определен победитель, то return
        randMovesComp = [];
        return;
      }

      if (this.state.countMove) {
         squares[i] = isNaN(pluses.find(elem => elem === i)) ? '-': '+';  //Если при клике угадали положение коробля, то "+"
      }
      else squares[i] = null;


      this.setState({
        squares: squares,
        countMove: this.state.countMove - 1,
      });

      if (squares[i] === '+') {
        this.setState({
          countDestroy: this.state.countDestroy - 1,
        });
      }
      else currPlayer = this.props.name;

    }
  
    renderSquare(i) {
      return (
        <Square
          value={this.state.squares[i]}
          onClick={() => this.handleClick(i)}  //при клике по кнопке в Square выполняем handleClick()
          index = {i}
          name = {this.props.name}
        />
      );
    }

    createSquare(beg){  //Формирование одной строки матрицы
      let begin = beg;  //Начальное значение: например, матрица 8 х 8 - начальные значения соответсвенно: 0, 8, 16 ...
      return (
        <div className = "board-row">
           {this.renderSquare(begin++)}  
           {this.renderSquare(begin++)}
           {this.renderSquare(begin++)}
           {this.renderSquare(begin++)}
           {this.renderSquare(begin++)}
           {this.renderSquare(begin++)}
           {this.renderSquare(begin++)}
           {this.renderSquare(begin)}     
        </div>
      );
    }
    
    render() {
      const isWin = isWinner(this.state.squares, this.props.name);  //переменная хранит булевое значение (победа или нет)
      let status;
      if (isWin) {
        status = 'ПОБЕДА!!!';
      } else {
        status = (!this.state.countMove) ? 'Ты проиграл': 'Осталось ходов: ' + this.state.countMove;
      }      
      
      return (
        <div className = "container_area">
          <div>
              <div className = "status1">{status}</div>
              <div className = "status2">Осталось уничтожить: {this.state.countDestroy}</div>
              <div id = 'area'>  
                  {this.createSquare(0)}    {/*создается одна строка поля*/}
                  {this.createSquare(8)}
                  {this.createSquare(16)}
                  {this.createSquare(24)} 
                  {this.createSquare(32)}
                  {this.createSquare(40)}
                  {this.createSquare(48)}
                  {this.createSquare(56)}
              </div>
              <div className = "namePlayer">{this.props.name}</div>
            </div>
        </div>
      );  
    } 
}

class Timer extends Component {   //Данный компонент необходим для постоянного рендеринга следующего хода
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()};    //данное состояние необходимо для постоянного рендеринга
  }
  componentDidMount() {
    this.timerID = setInterval(() => {
      return this.tick()}, 100);  //обновление информации о следующем ходе каждые 100 мс
  }
  componentWillUnmount() {        //необходимо сбрасывать таймер
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div>
        <div className = "statusWin">{statusWin}</div>
        <div className = "nextGamer">Следующий ход: {currPlayer}</div>
      </div>
    )
  }
}

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date()};  //Необходимо для постоянного рендеринга компонента
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.handleComp();
      return this.tick()}, 1000);   
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

 handleComp(){
  if (currPlayer == 'computer'){
      let elems = document.querySelectorAll('.computer' || '.colorize');  //в elems записываюся ячейки поля игрока (не компьютера) 
      let rand = generRandomCompShot();                                       //для применения к ним стилей
      elems[rand].click();            //имитация клика (рандомного) компьютером
    }
  }

  render() {
    return (
      <div className="game">
        <Timer />
        <div className="game-board">
          <Board name='player'/>
          <Board name='computer'/>
        </div>
      </div>
    )
  }
} 

function generRandomCompShot() {        //рандом-генерация индекса кнопки, для произведения "выстрела" компьютером
  let rand;
  rand = Math.floor(Math.random() * Math.floor(dimMatr2 - 1));   
  while (rand === randMovesComp.find(elem => elem === rand)){   //проверка на отсутсвие элемента в глобальном randMovesComp
    rand = Math.floor(Math.random() * Math.floor(dimMatr2 - 1));
  }
  randMovesComp.push(rand);        //необходимо запоминать ранее произведенные "выстрелы" 
  return rand;
}

function generateRandom(name){   //генерация рандомного числа - расположение кораблей
  let countRand = dimMatr;       //количество одиночных кораблей
  let rand = [];
  let i = 0;
  let randCurr;         //текущее рандомное число
  while (i < countRand){
    randCurr = Math.floor(Math.random() * Math.floor(dimMatr2 - 1));  
    if (randCurr != rand.find(elem => elem === randCurr)){
      rand.push(randCurr);
      i++;
    }
  }
  if (name === 'player'){
     randPlayer = rand;
  } else randComp = rand;
  
}

function isWinner(squares, name) {

    let rand = name === 'player' ? randPlayer : randComp;
    if (!rand.length) {  //генерируем рандомную расстановку кораблей в начале боя
      generateRandom(name);
    }

    const obj = new Array(dimMatr2);
    
    rand.forEach(elem => obj[elem] = '+' );   

    let counter = 0;
   
    pluses = obj.map((elem, index) => elem ? index: null);  //в глобальную переменную записываем индексы кораблей поля, например [2, 7, 12]

    for (let i = 0; i < obj.length; i++) {      //переменная counter необходима для проверки того, уничтожены ли все корабли
        if (squares[i] && obj[i]){
          counter++;
        }
    }
    if (counter === obj.reduce((acc, elem) => elem ? acc + 1 : acc, 0)){  //если counter равен числу всех кораблей, то это Победа!
      return true;
    }
      
    return null;
  }

  export default Game