'use strict';
{
    const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

    class Quiz {
        constructor(quizData) {
            //クイズの結果だけ取得（オブジェクト）
            this._quizzes = quizData.results;
            //正答数
            this._correctAnswersNum = 0;
        }

        //【ジャンル】を取得
        getQuizGenre(index) {
            return this._quizzes[index - 1].category;
        }

        //【難易度】を取得
        getQuizDifficulty(index) {
            return this._quizzes[index - 1].difficulty;
        }

        //【クイズ】を取得
        getQuizQuestion(index) {
            return this._quizzes[index - 1].question;
        }

        //クイズの数を取得
        getNumOfQuiz() {
            return this._quizzes.length;
        }

        //クイズの正解を取得
        getCorrectAnswer(index) {
            return this._quizzes[index - 1].correct_answer;
        }

        //クイズの不正解を取得
        getInCorrectAnswers(index) {
            return this._quizzes[index - 1].incorrect_answers;
        }

        //クイズの正答数をカウント
        countCorrectAnswersNum(index, answer) {
            const correctAnswer =  this._quizzes[index - 1].correct_answer;
            if (answer === correctAnswer) {
                return this._correctAnswersNum++; //答えと解答が一致していればここで正答数が増える
            }
        }

        //カウントした正答数を取得
        getCorrectAnswersNum() {
            return this._correctAnswersNum;
        }
    }
    
    //定数
    const titleElement = document.getElementById('title');
    const questionElement = document.getElementById('question');
    const answersContainer = document.getElementById('answers');
    const startButton = document.getElementById('start-button');
    const genreElement = document.getElementById('genre');
    const difficultyElement = document.getElementById('difficulty');
    //定数
    
    startButton.addEventListener('click', () => { //開始ボタン非表示
        startButton.hidden = true;
        fetchQuizData(1);
      });

    const fetchQuizData = async (index) => {
        titleElement.textContent = '取得中';
        questionElement.textContent = '少々お持ちください';

        const res = await fetch(API_URL);
        const quizData = await res.json();
        const quizInstance = new Quiz(quizData);  //インスタンス生成（インスタンスが使えるようになる）

        setNextQuiz(quizInstance, index);
        console.log(quizData.results);
    }

    const setNextQuiz = (quizInstance, index) => { //第一引数がオブジェクトや配列だったら第二引数インデックス？
        while (answersContainer.firstChild) {
            answersContainer.removeChild(answersContainer.firstChild);
        }
        if (index <= quizInstance.getNumOfQuiz()) {
            makeQuiz(quizInstance, index)
        } else {
            finishQuiz(quizInstance)
        }
    };

    const makeQuiz = (quizInstance, index) => {
        titleElement.innerHTML = `問題 ${index}`;
        genreElement.innerHTML = `<strong>【ジャンル】${quizInstance.getQuizGenre(index)}</strong>`;
        difficultyElement.innerHTML = `<strong>【難易度】${quizInstance.getQuizDifficulty(index)}</strong>`;
        questionElement.innerHTML = `【クイズ】${quizInstance.getQuizQuestion(index)}`;

        //シャッフルした解答の配列をanswers定数に格納
        const answers = createAnswers(quizInstance, index);

        //配列の要素をループで表示
        answers.forEach(answer => {
            const answerElement = document.createElement('li'); //選択する解答をリスト形式にするため
            answersContainer.appendChild(answerElement);

            const buttonElement = document.createElement('button'); //選択する解答を生成
            buttonElement.innerHTML = answer;
            answerElement.appendChild(buttonElement);

            buttonElement.addEventListener('click', () => {
                quizInstance.countCorrectAnswersNum(index, answer); //正答数をカウントするインスタンスメソッドを定義
                index++;
                setNextQuiz(quizInstance, index);
            });
        });
    };

    const finishQuiz = (quizInstance) => {
        titleElement.textContent = `あなたの正答数は${quizInstance.getCorrectAnswersNum()}です！！`;
        genreElement.textContent = '';
        difficultyElement.textContent = '';
        questionElement.textContent = '再度チェンジしたい場合は以下をクリック！';

        const goBack = document.createElement('button');
        goBack.innerHTML = 'ホームに戻る';
        answersContainer.appendChild(goBack);

        goBack.addEventListener('click', () => {
            location.reload();
        });
    }

    //配列をシャッフルする関数に入れる
    const createAnswers = (quizInstance, index) => {
        const answers = [  //解答を配列で定義
            quizInstance.getCorrectAnswer(index),
            ...quizInstance.getInCorrectAnswers(index), //スプレッド構文で配列をマージ
        ]
        return shuffle(answers);
    }

    //渡された解答の配列をシャッフルする
    const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
}
