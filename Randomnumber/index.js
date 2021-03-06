let randomNumber = Math.floor(Math.random()*100)+1; // 1~100까지의 수에서 랜덤 추출
const guesses = document.querySelector('.guesses');  // 각각의 클래스와 연결
const lastResult = document.querySelector('.lastResult');
const lowOrHi = document.querySelector('.lowOrHi');
const guessSubmit = document.querySelector('.guessSubmit');
const guessField = document.querySelector('.guessField');
let guessCount = 1;
let resetButton;


function checkGuess(){
   let userGuess = Number(guessField.value); // 입력한 값
   if(guessCount === 1){
      guesses.textContent = 'Previous guesses: ';
   }

   guesses.textContent += userGuess + ' ';

   if(userGuess === randomNumber){  // 입력 값이 정답일 경우
      lastResult.textContent = 'Congrautulations! You got it right!';  // 축하메시지
      lastResult.style.backgroundColor = 'green'; // 백그라운드컬러 설정
      lowOrHi.textContent = '';
      setGameOver();
   }
   else if(guessCount === 10){ // 입력 횟수 10번인 경우
      lastResult.textContent = "!!!Game Over!!!";
      setGameOver(); // 게임오버 함수 호출
   }
   else{ // 정답이 아닌 경우
      lastResult.textContent = "Wrong!!"; 
      lastResult.style.backgroundColor = "red";
      if(userGuess < randomNumber){
         lowOrHi.textContent = "Last guess was too low!!";
      }
      else if(userGuess > randomNumber){
         lowOrHi.textContent = "Last guess was too high!!";
      }
   }

   guessCount++;
   guessField.value='';
   guessField.focus();
}

function setGameOVer(){
   guessField.disabled = true;  // 작동되지 않도록 disabled속성 true로 변경
   guessSubmit.disabled = true; // 위와 같음, true로 설정하지 않으면 정답을 계속 제출할 수 있음
   resetButton = document.createElement('button'); // 버튼 생성, Start new game 표시
   resetButton.textContent = 'Start new game';
   document.body.appendChild(resetButton);
   resetButton.addEventListener('click', resetGame); // 클릭하면 resetGame 함수 호출
}

function resetGame(){
   guesCount = 1;

   const resetParas = document.querySelectorAll('.resultParas p');
   for (var i =0; i<resetParas.length; i++){
      resetParas[i].textContent='';
   }   

   resetButton.parentNode.removeChild(resetButton);

   guessField.disabled = false;
   guessSubmit.disabled = false;
   guessField.value = '';
   guessField.focus();

   lastResult.style.backgroundColor = 'white';

   randomNumber = Math.floor(Math.random()*100)+1;
}

guessSubmit.addEventListener('click', checkGuess);