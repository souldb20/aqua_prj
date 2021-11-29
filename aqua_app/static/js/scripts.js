// 비동기방식
var async = new XMLHttpRequest();
async.onreadystatechange = function(event) {
    if (async.readyState == 4 && async.status == 200) {
        console.log(async.responseText);
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
    async.open('GET', 'ph/', true);
    async.send();

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

            request.open('POST', 'http://192.168.0.139/', true);

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


 window.addEventListener('DOMContentLoaded', event => {
    let navbar_menus = document.getElementById('navbarSupportedContent').getElementsByClassName('nav-item');
    for(let navbar_menu of navbar_menus){
      navbar_menu.addEventListener('mouseover', function(event) {
        navbar_menu.classList.add('active');
      });
      navbar_menu.addEventListener('mouseout', function(event) {
        navbar_menu.classList.remove('active');
      });
//      navbar_menu.addEventListener('click', function(event) {
//        event.preventDefault();
//        navbar_menu.classList.remove('active');
//      });
    }


 });