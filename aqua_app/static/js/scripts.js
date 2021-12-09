function input(){
    // 비동기방식
    var async = new XMLHttpRequest();
    async.onreadystatechange = function(event) {
        if (async.readyState == 4 && async.status == 200) {
            //console.log(async.responseText);
            var deserializeJson = JSON.parse(async.responseText);
            var items = JSON.parse(deserializeJson);

            var aDensity = ["density"];
            var aX = ["x"];

            for (item of items) {
                aDensity.push(item.fields.density);
                aX.push(item.fields.created_at.split('.')[0]);
            }

            var chart = bb.generate({
              data: {
                x: "x",
                xFormat: "%Y-%m-%dT%H:%M:%S",
                columns: [aX, aDensity],
                type: "line", // for ESM specify as: line()
              },
              axis: {
                x: {
                  type: "timeseries",
                  tick: {
                    format: "%Y/%m/%d %H:%M:%S"
                  }
                }
              },
              bindto: "#chart"
            });
        }
     };

    let ymd = document.querySelector("#input_date").value;

//    const ymd = dday.replace(/-/g, "/");

    if(!ymd){
        var today = new Date();

        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);

        ymd = year + '-' + month  + '-' + day;
    }

    url = "ph/?ymd=" + ymd;

//    const dday_arr = dday.split("-");

//    const year = dday_arr[0];
//    const month = dday_arr[1];
//    const day = dday_arr[2];

//    url = "ph/?year=" + year + "&month=" + month + "&day=" + day;


    async.open('GET', url, true);
    async.send();

}

// 아두이노 서버로 요청 보내기(LED 불 켜기)
window.onload = function() {

    var btnPump = document.getElementById('btn-pump');
    btnPump.addEventListener('click', function() {
        var state = this.dataset.state;

        var request = new XMLHttpRequest();
        request.onreadystatechange = function(event) {
            if (request.readyState == 4 && request.status == 200) {
                var response = JSON.parse(request.responseText);
                if (response.message == 'success') {
                    if (response.type == 'LED'
                        && response.action == 'on') {
                        btnPump.setAttribute("data-state", "1");
                        btnPump.innerHTML = "펌프 중단";
                    }
                    else if (response.type == 'LED'
                        && response.action == 'off') {
                        btnPump.setAttribute("data-state", "0");
                        btnPump.innerHTML = "펌프 작동";
                    }
                }
            }
        };

        request.open('POST', 'http://192.168.0.144/', true);

        var body;
        if (state == 0) {
            body = {
                "type": "LED",
                "action": "on"
            };
        }
        else if (state == 1) {
            body = {
                "type": "LED",
                "action": "off"
            };
        }
        request.send(JSON.stringify(body));
    });
};

function getPH(){
    // 비동기방식
    var async = new XMLHttpRequest();
    async.onreadystatechange = function(event) {
        if (async.readyState == 4 && async.status == 200) {
            //console.log(async.responseText);
            var deserializeJson = JSON.parse(async.responseText);
            var items = JSON.parse(deserializeJson);

            var aDensity = ["density"];
            var aX = ["x"];

            for (item of items) {
                aDensity.push(item.fields.density);
                aX.push(item.fields.created_at.split('.')[0]);
            }

            var chart = bb.generate({
              data: {
                x: "x",
                xFormat: "%Y-%m-%dT%H:%M:%S",
                columns: [aX, aDensity],
                type: "line", // for ESM specify as: line()
              },
              axis: {
                x: {
                  type: "timeseries",
                  tick: {
                    format: "%Y/%m/%d %H:%M:%S"
                  }
                }
              },
              bindto: "#chart"
            });

            var density = items[items.length-1].fields.density;
            console.log(density);
            postPump(density);
        }
     };

    let ymd = document.querySelector("#input_date").value;

//    const ymd = dday.replace(/-/g, "/");
    if(!ymd){
        var today = new Date();

        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);

        ymd = year + '-' + month  + '-' + day;
    }

    url = "ph/?ymd=" + ymd;

//    const dday_arr = dday.split("-");

//    const year = dday_arr[0];
//    const month = dday_arr[1];
//    const day = dday_arr[2];

//    url = "ph/?year=" + year + "&month=" + month + "&day=" + day;

    async.open('GET', url, true);
    async.send();
}

function postPump(density){
    console.log("PostPump");
    var btnPump = document.getElementById('btn-pump');
    var state = btnPump.dataset.state;

    var request = new XMLHttpRequest();

    if(density < 6 || density > 8){
        btnPump.setAttribute("data-state", "1");
        btnPump.innerHTML = "펌프 중단";
         // 서버가 요청받을 주소를 작성
        request.open('POST', 'http://192.168.0.144/', true);
        // body 변수 내용을 담아 서버로 요청보냄
        body = {
            "type": "LED",
            "action": "on"
        };
        request.send(JSON.stringify(body));
    }
}

let timerID = setInterval(getPH, 60000);

function stopTimerID(timerID) {
    clearInterval(timerID);
}

//setTimeout(stopTimer,10000);

 window.addEventListener('DOMContentLoaded', event => {
    let navbar_menus = document.getElementById('navbarSupportedContent').getElementsByClassName('nav-item');
    for(let navbar_menu of navbar_menus){
      navbar_menu.addEventListener('mouseover', function(event) {
        navbar_menu.classList.add('active');
      });
      navbar_menu.addEventListener('mouseout', function(event) {
        navbar_menu.classList.remove('active');
      });
    }
 });