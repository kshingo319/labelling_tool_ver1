//import "./styles.css" assert { type: 'css' };

// 入力ダイアログを表示 ＋ 入力内容を user に代入
var user = "";
while(user === ""){
  user = window.prompt("学籍番号を入力してください", "");
  if(user === "" || user === null || user === undefined){
    alert("学籍番号を入力してください");
    user = window.prompt("学籍番号を入力してください", "");
  }  
}

var lines = [];
var kotae =[];

document.getElementById("file").addEventListener("change", e => {
  const files = e.target.files

  //FileReaderの準備
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    //ファイルから読み取った文字列を変数resultに格納
    const { result } = reader;

    //改行コードで区切って行の配列を作成
    const tmp = result.split("\n")

    //行ごとにカンマで区切り、２次元配列を作成
    lines = tmp.map(line => line.split(','))
    console.log(lines)
  });

  //選択されたCSVを読み込み
  reader.readAsText(files[0])
})

var data_size = 14;
var start_data = [];

//1問ごとに取得するデータ配列
var alldata = [];

//ボタンの状態
var decision_cnt = 0;

//現在の日付時刻を取得する
function getCurrentTime() {
	var now = new Date();
	var res = "" + now.getFullYear() + "/" + padZero(now.getMonth() + 1) + 
		"/" + padZero(now.getDate()) + " " + padZero(now.getHours()) + ":" + 
		padZero(now.getMinutes()) + ":" + padZero(now.getSeconds()) + "." + padZero(now.getMilliseconds());
	return res;
}
//先頭ゼロ付加
function padZero(num) {
	var result;
	if (num < 10) {
		result = "0" + num;
	} else {
		result = "" + num;
	}
	return result;
}

//現在の日付を取得
function getCurrentDate() {
	var now = new Date();
	var res = now.getFullYear() + padZero(now.getMonth() + 1) + 
		padZero(now.getDate()) + padZero(now.getHours()) +  
		padZero(now.getMinutes()) +  padZero(now.getSeconds());
	return res;
}
var train_date = getCurrentDate();
var new_sheet = train_date + "_" +  user;

/*
var datetime = [];
var copy = new Date();
datetime.push(copy);
*/
//曜日によって使用するデータセットを変える
var daytest = new Date();
var day_id = daytest.getDay();
var img_dataset =["image0","image1","image2","image3","image4"];
var dataset_today = img_dataset[0];


var now = getCurrentTime();

start_data.push(now);
for(let i=1;i<data_size;i++){
  start_data.push(""); 
}

alldata.push(start_data);



//問題番号を格納
var question_num = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}
//画像の番号を格納する配列
/*
var img_array = [];
var min = 0;
var max = 19;
var length = 20;
for (let i = 0; i < length; i++) {
  while (true) {
    var tmp = getRandomInt(min, max);
    if (!img_array.includes(tmp)) {
      img_array.push(tmp);
      break;
    }
  }
}
*/
//var filename = "C:\home\src\App\src\image0";
//var fileObj = new File([filename], "0.jpg");
//var flag = fileObj.exists;
var img_array = [];
function chk(url){
  return new Promise(function (resolve, reject) {
      const img = new Image();
      img.src = 'src/'+dataset_today+'/'+url+'.jpg';
      img.onload = function () { 
        img_array.push(url);
   
        return resolve(url) 
      };
      img.onerror = function () { return reject(url) };
  });
};

for(let i=1;i<301;i++){
chk(i)
  .then((url) => {
      //console.log('存在します');
  })
  .catch((url) => {
      //console.log('存在しません');
  });
}
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await _sleep(5000);

function arrayShuffle(array) {
  for(let i = (array.length - 1); 0 < i; i--){

    // 0〜(i+1)の範囲で値を取得
    let r = Math.floor(Math.random() * (i + 1));

    // 要素の並び替えを実行
    let tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

// 配列を5回シャッフルする
for(let i=0; i < 5; i++) {
  arrayShuffle(img_array);
}
//var img_rand = Math.floor(Math.random() * (max + 1 - min)) + min;

//1問目の画像を描画
const target1 = document.getElementById("sample");
target1.setAttribute("src", `src/${dataset_today}/${img_array[0]}.jpg`);



//解いた問題がの正解・不正解を格納する配列
var result_array = [];

//良品・不良品どちらと解答したかを格納する配列
var select_array = [];

var decision_result = ["正解","不正解"];
var decision_select = ["良品", "不良品"];

//サンプル画像と解答から正解・不正解かを判定して返す関数
function decision(select){
  var decision_answer = 0;
  if(img_array[question_num] < 150){
    if(select != 0){
      decision_answer = 1;
    }
  }else if(img_array[question_num] >= 150){
    if(select != 1){
      decision_answer = 1;
    }
  }
  return decision_answer;
}



//正答率を計算する
function crt_ans_rate(result_array){
  var correct = 0;
  for(let i=0;i<result_array.length;i++){
    if(result_array[i]==`正解`){
      correct++;
    }
  }
  var total = (correct / result_array.length)*100 
  return total;

}

//「良品」ボタンを押したときに次の問題を表示してデータを配列に渡す
function countUp_quality() {
  var checkbox = [];
  var checkflag = [];

  for (let i = 0; i < checkpos.length; i++) {
    checkflag[i]=1;
    /*checkbox[i] = checkpos[i];
    if(checkbox[i]){
      checkflag[i]=1;
    }else{
      checkflag[i]=0;
    }*/
  }
  for (let i = 0; i < checkpos.length; i++) {
    checkpos[i] = false;
  }

  var dec = decision(0);
  result_array.push(decision_result[dec]);
  select_array.push(decision_select[0]);

  //一時配列まとめて格納
  var onetime_data = [];
  onetime_data.push(getCurrentTime());
  onetime_data.push(question_num+1);
  onetime_data.push(result_array[question_num]);
  onetime_data.push(img_array[question_num]);
  onetime_data.push(0);
  for(let i=0;i<8;i++){
    onetime_data.push(checkflag[i]);
  }
  onetime_data.push(day_id);
  alldata.push(onetime_data);

  kotae[question_num] = "0";


  for(let j=0;j<45;j++){
    if(lines[j][3]==img_array[question_num] && lines[j][4]== 0){
      console.log(lines[j][3]);
      console.log(lines[j][4]);
      kotae[question_num] = "100";
    }
  }

  confirm('良品と登録します。(他の回答者との合致率：'+ kotae[question_num] + '％)');
  /*
  var  time = new Date();
  datetime.push(time);
  var diff =  (datetime[question_num + 1].getTime() - datetime[question_num].getTime()) / 1000;
  console.log(diff);
  */

  /*
  let total = result_array.reduce(function(sum, element){
    return sum + element;
  }, 0);
  */

  //document.getElementById("answer_log").innerHTML = `<p>「${result_array[question_num]}」:あなたの前回の解答は「良品」(正答率:${crt_ans_rate(result_array)}%)</p>`;
  //document.getElementById("answer_img").innerHTML = `<img id="sample"src="src/${dataset_today}/${img_array[question_num]}.jpg"width="500px"height="168px" style="display:block;">`;
  
  var canvas = document.getElementById("canvas");
  var c = canvas.getContext("2d");
  c.clearRect(0, 0,c.canvas.clientWidth,c.canvas.clientHeight);


  question_num++;
  document.getElementById("app").innerHTML = `<h1>No.${question_num + 1}</h1>`;
  const target = document.getElementById("sample");
  target.setAttribute("src", `src/${dataset_today}/${img_array[question_num]}.jpg`);
  target.setAttribute("alt", `画像の代わり${img_array[question_num]}`);

  
  //let answer = postData_quality();
  /*
  checkAll.checked = false;
  for (let i = 0; i < el.length; i++) {
    el[i].checked = false;
  }*/
  for (let i = 0; i < 8; i++) {
    checkpos[i] = false;
  }
  
}

const decide = document.getElementById("defective");
decide.addEventListener("click", () => deciside());
function deciside() {
  document.getElementById('quality').style.display = 'none';
  document.getElementById('defective').style.display = 'none';
  document.getElementById("decision").style.display = 'inline';
  decision_cnt = 1;
 
}

//「不良品」ボタンを押したときに次の問題を表示してデータを配列に渡す
function countUp_defective() {
  var checkbox = [];
  var checkflag = [];
  for (let i = 0; i < checkpos.length; i++) {
    checkbox[i] = checkpos[i];
    if(checkbox[i]){
      checkflag[i]=1;
    }else{
      checkflag[i]=0;
    }
  }
  for (let i = 0; i < checkpos.length; i++) {
    checkpos[i] = false;
  }
  var dec = decision(1);
  result_array.push(decision_result[dec]);
  select_array.push(decision_select[1]);

  //一時配列まとめて格納
  var onetime_data = [];
  onetime_data.push(getCurrentTime());
  onetime_data.push(question_num+1);
  onetime_data.push(result_array[question_num]);
  onetime_data.push(img_array[question_num]);
  onetime_data.push(1);
  for(let i=0;i<8;i++){
    onetime_data.push(checkflag[i]);
  }
  onetime_data.push(day_id);
  alldata.push(onetime_data);

  kotae[question_num] = "0";
  for(let j=0;j<45;j++){
    if(lines[j][3]==img_array[question_num] && lines[j][4]== 1){
      console.log(lines[j][3]);
      console.log(lines[j][4]);
      kotae[question_num] = "100";
    }
  }

  confirm('不良品と登録します。(他の回答者との合致率：'+ kotae[question_num] + '％)');
 
  //document.getElementById("answer_log").innerHTML = `<p>「${result_array[question_num]}」:あなたの前回の解答は「不良品」(正答率:${crt_ans_rate(result_array)}%)</p>`;
  //document.getElementById("answer_img").innerHTML = `<img id="sample"src="src/${dataset_today}/${img_array[question_num] }.jpg"width="500px"height="168px" style="display:block;">`;

  var canvas = document.getElementById("canvas");
  var c = canvas.getContext("2d");

  c.clearRect(0, 0,c.canvas.clientWidth,c.canvas.clientHeight);

  question_num++;
  document.getElementById("app").innerHTML = `<h1>No.${question_num + 1}</h1>`;
  const target = document.getElementById("sample");
  target.setAttribute("src", `src/${dataset_today}/${img_array[question_num] }.jpg`);
  target.setAttribute("alt", `画像の代わり${img_array[question_num] }`);

  //let answer = postData_defective();
  /*
  checkAll.checked = false;
  for (let i = 0; i < el.length; i++) {
    el[i].checked = false;
  }
  */
  




  document.getElementById('quality').style.display = 'inline';
  document.getElementById('defective').style.display = 'inline';
  document.getElementById("decision").style.display = 'none';
  decision_cnt = 0;
  
  for (let i = 0; i < 8; i++) {
    checkpos[i] = false;
  }
  
  c.clearRect(0, 0, 500, 168)
}

const quality = document.getElementById("quality");
quality.addEventListener("click", () => countUp_quality());

const defective = document.getElementById("decision");
defective.addEventListener("click", () => countUp_defective());

//GASにテータ送信
function postData_quality() {
  let URL ="https://script.google.com/macros/s/AKfycbxrWSMdvoek5955DVvCix0P0MGaNz0_LCTPWA0TOc4iyp8pSM-0MdxGEiA_pZr6bzkJhw/exec";  
  let SendDATA = {
    //answer: quality.textContent,
    answer: alldata,
    sheetname: new_sheet,
  };
  var postparam = {
    method: "POST",
    mode: "no-cors",
    "Content-Type": "application/x-www-form-urlencoded",
    body: JSON.stringify(SendDATA),
  };
  fetch(URL, postparam);
  return quality.textContent;
}
//GASにテータ送信(不使用)
function postData_defective() {
  var dec = decision(1);
  let URL =
    "https://script.google.com/macros/s/AKfycbw1J30g-tNRPCpAB7Q5PmfzQ_vbHMCBwEH0h-DbzzzIiRF9D3-IuhtHdzvYDJNYAWJ19A/exec";
  let SendDATA = {
    answer: defective.textContent,
  };
  var postparam = {
    method: "POST",
    mode: "no-cors",
    "Content-Type": "application/x-www-form-urlencoded",
    body: JSON.stringify(SendDATA),
  };
  fetch(URL, postparam);

  return defective.textContent;
}



var checkpos = new Array(8);
for (let i = 0; i < 8; i++) {
  checkpos[i] = false;
}

document.getElementById( "canvas" ).addEventListener("click", function(event){
  var canvas = document.getElementById("canvas");
  var c = canvas.getContext("2d");
  var clickX = event.pageX ;
  var clickY = event.pageY ;
  // 要素の位置を取得
  var clientRect = this.getBoundingClientRect() ;
  var positionX = clientRect.left + window.scrollX;
  var positionY = clientRect.top + window.scrollY;
  // 要素内におけるクリック位置を計算
  var posx = clickX - positionX ;
  var posy = clickY - positionY ;
  /*
  console.log(x);
  console.log(y);
  */

  //画像が押されたときに位置を取得
  /*console.log(posx);
  console.log(posy);*/
  //位置から範囲を指定しその範囲を四角で囲む
  if(decision_cnt == 0){
    document.getElementById('quality').style.display = 'none';
    document.getElementById('defective').style.display = 'inline';
    //document.getElementById("decision").style.display = 'inline';
    if(posy>0 && posy<=85){
      if(posx>0 && posx<=125){
        if(checkpos[0]){
          c.clearRect(0, 0, 125, 85);
          checkpos[0]=false; 
        }else{
          c.fillStyle = "rgba(255, 255, 255, 0.5)";
          c.fillRect(0, 0, 125, 85);
          checkpos[0]=true; 
        }
      }else if(posx>125 && posx<=250){
        if(checkpos[1]){
          c.clearRect(125, 0, 125, 85);
          checkpos[1]=false; 
        }else{
          c.fillStyle = "rgba(255, 255, 255, 0.5)";
          c.fillRect(125, 0, 125, 85);
          checkpos[1]=true; 
        }
      }else if(posx>250 && posx<=375){
        if(checkpos[2]){
          c.clearRect(250, 0, 125, 85);
          checkpos[2]=false; 
        }else{
          c.fillStyle = "rgba(255, 255, 255, 0.5)";
          c.fillRect(250, 0, 125, 85);
          checkpos[2]=true; 
        }
      }else if(posx>375 && posx<=500){
        if(checkpos[3]){
          c.clearRect(375, 0, 125, 85);
          checkpos[3]=false; 
        }else{
          c.fillStyle = "rgba(255, 255, 255, 0.5)";
          c.fillRect(375, 0, 125, 85);
          checkpos[3]=true; 
        }
      }
    }else if(posy>85 && posy<=170){
      if(posx>0 && posx<=125){
        if(checkpos[4]){
          c.clearRect(0, 85, 125, 85);
          checkpos[4]=false; 
        }else{
          c.fillStyle = "rgba(255, 255, 255, 0.5)";
          c.fillRect(0, 85, 125, 85);
          checkpos[4]=true; 
        }
      }else if(posx>125 && posx<=250){
        if(checkpos[5]){
          c.clearRect(125, 85, 125, 85);
          checkpos[5]=false; 
        }else{
          c.fillStyle = "rgba(255, 255, 255, 0.5)";
          c.fillRect(125, 85, 125, 85);
          checkpos[5]=true; 
        }
      }else if(posx>250 && posx<=375){
        if(checkpos[6]){
          c.clearRect(250, 85, 125, 85);
          checkpos[6]=false; 
        }else{
          c.fillStyle = "rgba(255, 255, 255, 0.5)";
          c.fillRect(250, 85, 125, 85);
          checkpos[6]=true; 
        }
      }else if(posx>375 && posx<=500){
        if(checkpos[7]){
          c.clearRect(375, 85, 125, 85);
          checkpos[7]=false; 
        }else{
          c.fillStyle = "rgba(255, 255, 255, 0.5)";
          c.fillRect(375, 85, 125, 85);
          checkpos[7]=true; 
        }
      }
    }
    decision_cnt = 0;
    document.getElementById('quality').style.display = 'inline';
    for (let i = 0; i < 8; i++) {
      if(checkpos[i]==true){
        decision_cnt = 0;
        document.getElementById('quality').style.display = 'none';
      }
    }
    console.log(decision_cnt);
  }

});


//const boxnum = document.getElementById("quality");
//quality.addEventListener("click", () => boxonimg());
/*
// 線の色
c.strokeStyle = "red";
// パスの開始
c.beginPath();
c.lineWidth = 3;
// 1本目
c.moveTo(275, 20);
c.lineTo(275, 160);
// 2本目
c.moveTo(50, 90);
c.lineTo(500, 90);
// 3本目
c.moveTo(162.5, 20);
c.lineTo(162.5, 160);

c.moveTo(387.5, 20);
c.lineTo(387.5, 160);
// 描画
c.stroke();
c.strokeRect(50, 20, 450, 140);
*/
/*
//「全て選択」のチェックボックス
let checkAll = document.getElementById("checkAll");
「全て選択」以外のチェックボックス
//let el = document.getElementsByClassName("checks");


//全てにチェックを付ける・外す
const funcCheckAll = (bool) => {
    for (let i = 0; i < el.length; i++) {
        el[i].checked = bool;
    }
};

//「checks」のclassを持つ要素のチェック状態で「全て選択」のチェックをON/OFFする
const funcCheck = () => {
    let count = 0;
    for (let i = 0; i < el.length; i++) {
        if (el[i].checked) {
            count += 1;
        }
    }
    if (el.length === count) {
        checkAll.checked = true;
    } else {
        checkAll.checked = false;
    }
};

//「全て選択」のチェックボックスをクリックした時
checkAll.addEventListener("click", () => {
    funcCheckAll(checkAll.checked);
},false);

//「全て選択」以外のチェックボックスをクリックした時
for (let i = 0; i < el.length; i++) {
    el[i].addEventListener("click", funcCheck, false);
}
*/

//const clickBtn = document.getElementById('click-btn');
const clickBtn = document.getElementsByClassName('ans_btn');
const popupWrapper = document.getElementById('popup-wrapper');
const close = document.getElementById('close');


var loadcount = 0;
var que_cnt = 10;
var que_dec = [];

var canvas, ctx, btn;

//ボタンサイズを指定しておく
var btnSize = {x:0, y:0,  w:600, h:500 };

// 良品or不良品ボタンを計10回クリックしたときにポップアップを表示させる
for (var k =0; k<clickBtn.length; k++){
  clickBtn[k].addEventListener('click', () => {  
    if(question_num % 10 == 0 && question_num != 0){
      if(question_num == 40){
        document.getElementById("close").innerHTML = `<button type="button"id="close">訓練を終了する</button>`;
      }
      popupWrapper.style.display = "block";
      let btn = document.createElement("button");

      let target = document.getElementById("message");
      target.appendChild(btn);
      //const target = document.getElementById("sample");


      var canvas = document.getElementById("board");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 600, 500);
      var images =[];
      var img_src = [];
      for (let i = 0; i < que_cnt; i++) {
        images[i] = new Image();
        img_src.push(img_array[question_num-10+i]);
        images[i].src = 'src/'+dataset_today+'/'+img_src[i]+'.jpg';
      }
      var loadedCount = 0;
      for(let i = 0; i < que_cnt; i++){
        loadedCount++; 
        images[i].onload =function() {
          if (loadedCount == images.length) {
            var x = 0;
            var y = 0;
            for (let j = 0; j < que_cnt; j++) {
              ctx.drawImage(images[j], x, y, 200, 70);
              x += 200;
              if(x>=600){y += 125;  x=0;}
            }
          }
        }
      }; 
      var txt_x = 0;
      var txt_y = 90;
      for (let i = 0; i < que_cnt; i++) {
        ctx.font = '15pt Arial';
        ctx.fillStyle = 'rgba(0, 0, 0)';  
        ctx.fillText(question_num-9+i+","+"選択:"+select_array[question_num-10+i], txt_x, txt_y);
        /*
        if (result_array[question_num-10+i]=="正解"){
          ctx.fillStyle = 'rgba(0, 0, 255)';      
        }else{
          ctx.fillStyle = 'rgba(255, 0, 0)';
        }*/

        ctx.fillText("一致度：" +kotae[question_num-10+i] +"%", txt_x, txt_y+30);
        txt_x += 200;
        if(txt_x>=600){
          txt_y += 125;
          txt_x=0;
        }
        if(select_array[question_num-10+i] == "良品"){
          que_dec.push(true);
        }else if(select_array[question_num-10+i] == "不良品"){
          que_dec.push(false);  
        }
      } 

      for (let i = 0; i < que_cnt; i++) {
        var tgt = "target" + i;
        var element = document.getElementById( tgt ) ;
        var elements = element.myRadio;
        if(que_dec[i]){
          elements[0].checked = true;
        }else {
          elements[1].checked = true;  
        }
      }
    }
  },false)

  canvas = document.getElementById("board");
  canvas.addEventListener("click", hoge);

}


function hoge(e) {
   
  //クリックされた場所の座標をcanvas内座標に変換offsetX, offsetYでもいいかもしれない
  var rect = canvas.getBoundingClientRect();
  var point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
   
  //クリックした座標が画像の上にあるか判定（丸いボタンなので四隅は無いけどクリックしたことにする）
  var hit =
      (0 <= point.x && point.x <= 0 + btnSize.w) 
   && (0 <= point.y && point.y <= 0 + btnSize.h)

  if (hit) {
    zoomback.style.display = "flex";
    // 押された画像のリンクを渡す　..④
    zoomimg.setAttribute("src",e.target.getAttribute("src"));
  }
    // 元に戻すイベントリスナを指定　..⑤
    zoomback.addEventListener("click",modosu);

    // 拡大領域を無きものに　..⑥
    function modosu() {
  
    zoomback.style.display = "none";
    }
    
}
  // 要素を取得　..①
  const zoom = document.querySelectorAll(".zoom");
  const zoomback = document.getElementById("zoomback");
  const zoomimg = document.getElementById("zoomimg");

  // 一括でイベントリスナ　..②






// ポップアップの外側又は戻るマークをクリックしたときポップアップを閉じる
popupWrapper.addEventListener('click', e => {

  if (e.target.id === popupWrapper.id || e.target.id === close.id) {
    for (let i = 0; i < que_cnt; i++) {
      var tgt = "target" + i;
      var element = document.getElementById( tgt ) ;
      var elements = element.myRadio;
      if(que_dec[i] && elements[1].checked){
        //「良品」を「不良品」に再選択
        alldata[question_num-9+i][4] = "1";
      }else  if(que_dec[i]==false && elements[0].checked){
        //「不良品」を「良品」に再選択
        alldata[question_num-9+i][4] = "0";
      }
      console.log(alldata[question_num-9+i][4]);
    }
    var now = getCurrentTime();
    var look_data = [];
    look_data.push(now);
    for(let i=1;i<data_size;i++){
      look_data.push(""); 
    }
    alldata.push(look_data);
    
    popupWrapper.style.display = 'none';
    if(question_num == 40){
      document.getElementById("close").innerHTML = `<button type="button"id="close">訓練を終了する</button>`;
      let answer = postData_quality();
      alert("ウインドウを閉じてください");
    }
  }
});

