//import { flexbox } from "modernizr";
let colLength;
let rowDateDistributionLen = [];

function WDataItem(name, value, unit) {
    this.name = name; // 카테고리 이름
    this.value = value; // 해당 카테고리의 값
    this.unit = unit; // 해당 카테고리의 단위
}

function dateAndTimeFromDTStr(timeString = '0') {
    // 날짜와 시간 숫자들 사이에 구분자를 삽입한 형태의 포맷으로 된
    // 결과 문자열을 담을 변수
    let extendedTimeArr = [];

    if (timeString == '0')  // 함수에 입력값이 없어 매개변수가 디폴트 값일 경우
        return '0000 00 00 00:00:00';
    else {  // 함수에 특정 날짜 및 시간 문자열이 입력됐을 경우
        if (timeString.length != 12) return 'Invalid Date';

        let timeArr = [...timeString];
        for (var i = 0; i < timeString.length; i++) {
            extendedTimeArr.push(timeArr[i]); // 원본 숫자값 그대로 복사하는 부분
            if (i == 3 || i == 5 || i == 7) {   // 날짜 숫자값 사이에 공백 문자 삽입
                extendedTimeArr.push(' ');  // '0000 00 00 '
            } else if (i == 9 || i == 11) { // 시간 숫자값 사이에 콜론 문자 삽입
                extendedTimeArr.push(':');  // 00:00:00
            }
        }
    }

    // 배열에서 구분자로 쓰인 쉼표를 제거하고 전체를 문자열로 결합해서 한 후
    // timeString에 애초에 초가 빠져있어 뒤에 초 단위를 더 붙여서 반환
    return extendedTimeArr.join('') + "00";
}

function dateStrToSpacedDateStr(dateString) {
    //return dateString.replace(/^(\d{4})(\d{2})(\d{2})$/g, '$1 $2 $3');
    return dateString.replace(/^(\d{4})(\d{2})(\d{2})$/g, '$2 $3');
}

function timeStrToColonTimeStr(timeString) {
    return timeString.replace(/(\d{2})(?=\d)/g, '$1:');
}

function ShortWDataUnit(timeString = '0') {
    this.baseDate = 'empty-date';
    this.baseTime = 'empty-time';
    this.fcstDate = 'empty-date';
    this.fcstTime = 'empty-time';
    this.tmp = new WDataItem('1시간 기온', '0', '℃');
    this.pop = new WDataItem('강수확률', '0', '%');
    this.pty = new WDataItem('강수형태', '0', 'none');
    this.pcp = new WDataItem('1시간 강수량', '0', 'mm');
    this.reh = new WDataItem('습도', '0', '%');
    this.sno = new WDataItem('1시간 신적설', '0', 'cm');
    this.sky = new WDataItem('하늘상태', '0', 'none');
    this.tmn = new WDataItem('일 최저 기온', '0', '℃');
    this.tmx = new WDataItem('일 최고 기온', '0', '℃');
    this.uuu = new WDataItem('풍속(동서성분)', '0', 'm/s');
    this.vvv = new WDataItem('풍속(남북성분)', '0', 'm/s');
    this.wav = new WDataItem('파고', '0', 'M');
    this.vec = new WDataItem('풍향', '0', '˚');
    this.wsd = new WDataItem('풍속', '0', 'm/s');
}


function getShortForecastDataSet(weatherDataResponseBody) {
    let dataTable = weatherDataResponseBody.items;
    let parsedData = [];

    for (var i = 0; i < weatherDataResponseBody.totalCount; i++) {
        switch (dataTable.item[i].category) {
            case 'TMP': // '1시간 기온'을 뜻하는 카테고리 값
                // 데이터가 카테고리의 값이 TMP인 곳에서 새로운 주기로써
                // 다시 반복되므로 여기서 날씨 데이터 유닛 생성
                parsedData.push(new ShortWDataUnit());
                var j = parsedData.length - 1;
                if (j >= 0) {
                    parsedData[j].baseDate = // 발표일자 (type: string)
                        dateStrToSpacedDateStr(dataTable.item[i].baseDate);
                    parsedData[j].baseTime = // 발표시각 (type: string)
                        timeStrToColonTimeStr(dataTable.item[i].baseTime);
                    parsedData[j].fcstDate = // 예보일자 (type: string)
                        dateStrToSpacedDateStr(dataTable.item[i].fcstDate);
                    parsedData[j].fcstTime = // 예보시각 (type: string)
                        timeStrToColonTimeStr(dataTable.item[i].fcstTime); //console.log(dataTable.item[i].fcstTime);
                    parsedData[j].tmp.value = dataTable.item[i].fcstValue; // 기온 값 설정
                }
                break;
            case 'POP': // 강수확률
                parsedData[j].pop.value = dataTable.item[i].fcstValue; break;
            case 'PTY': // 강수형태
                parsedData[j].pty.value = dataTable.item[i].fcstValue; break;
            case 'PCP': // 1시간 강수량
                parsedData[j].pcp.value = dataTable.item[i].fcstValue; break;
            case 'REH': // 습도
                parsedData[j].reh.value = dataTable.item[i].fcstValue; break;
            case 'SNO': // 1시간 신적설
                parsedData[j].sno.value = dataTable.item[i].fcstValue; break;
            case 'SKY': // 하늘상태
                parsedData[j].sky.value = dataTable.item[i].fcstValue; break;
            case 'TMN': // 일 최저 기온
                parsedData[j].tmn.value = dataTable.item[i].fcstValue; break;
            case 'TMX': // 일 최고 기온
                parsedData[j].tmx.value = dataTable.item[i].fcstValue; break;
            case 'UUU': // 풍속(동서성분)', 
                parsedData[j].uuu.value = dataTable.item[i].fcstValue; break;
            case 'VVV': // 풍속(남북성분)
                parsedData[j].vvv.value = dataTable.item[i].fcstValue; break;
            case 'WAV': // 파고
                parsedData[j].wav.value = dataTable.item[i].fcstValue; break;
            case 'VEC': // 풍향
                parsedData[j].vec.value = dataTable.item[i].fcstValue; break;
            case 'WSD': // 풍속
                parsedData[j].wsd.value = dataTable.item[i].fcstValue; break;
        }
    }

    return parsedData;
}

async function getWeatherData() {
    let fetchResult = 'UNDEFINED';
    let api_url = await apiUrlGenerator();
    
    let response = await fetch(api_url);
    let data = await response.json();
    let realData = data.response.body.items;
    if (realData) {
        fetchResult = 'SUCCESS';
    }
    else
        fetchResult = 'FAILED';
    let res = getShortForecastDataSet(data.response.body);
    console.log('res: ', res);
    generateWeatherChart(res);
    return fetchResult;
}

async function apiUrlGenerator(genMode = 'SHORT') {
    let baseUrl;
    let requestedSubUrl;
    let servKey;
    if (genMode != 'AIR') {
        baseUrl = 'https://apis.data.go.kr/1360000/';
        servKey = '1C9fRws3TXsQk8WQRwdiB26o7A%2FJqvW%2BNS39AokRnLSqqiSEQeAtuxk0Y1hKWJkvDuNKAdTwv4W76JDXNaMA%2FA%3D%3D';
    } else {
        baseUrl = 'https://apis.data.go.kr/B552584/';
        servKey = '1C9fRws3TXsQk8WQRwdiB26o7A%2FJqvW%2BNS39AokRnLSqqiSEQeAtuxk0Y1hKWJkvDuNKAdTwv4W76JDXNaMA%2FA%3D%3D';
    }
    let pageNo = '1';
    let numOfRows;
    let dataType = 'json';//'json;'
    let baseDate;
    let baseTime;
    let nx, ny;
    let regionId;
    let sidoName;
    let timeFc;
    let resUrl = '';
    switch (genMode) {
        case 'CURRENT':
            requestedSubUrl = 'VilageFcstInfoService_2.0/getUltraSrtNcst?';
            numOfRows = 1000;
            baseDate = await getCurrentDateStream();
            baseTime = adjustTime(await getCurrentTimeStream());//'0100';//await getCurrentTimeStream();

            ({ GRIDX: nx, GRIDY: ny } = getPosObj());

            resUrl = `${baseUrl}${requestedSubUrl}serviceKey=${servKey}`
                + `&pageNo=${pageNo}&numOfRows=${numOfRows}`
                + `&dataType=${dataType}&base_date=${baseDate}`
                + `&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
            break;
        case 'SHORT':
            requestedSubUrl = 'VilageFcstInfoService_2.0/getVilageFcst?';
            numOfRows = 1000;
            /*let timeVal = await getCurrentTimeStream();
            baseTime = adjustTime(timeVal, genMode);//0500';//await getCurrentTimeStream();
            if ((+(timeVal) >= '0000') && (+(timeVal) < 210)) { // 현재 시간이 0시 0분에서 2시 10분전이면
                // 예보의 날짜가 이전 날짜 23시 10문에 발표된 것을 기반으로 하므로 날짜를 하루 앞당겨 준다.
                
                baseDate = await getCurrentDateStream(1);
                console.log('back1', baseDate);
            } else { // 현재 시간이 그 외의 시간일 경우는 그냥 당일 날짜를 기반으로 한다.
                
                baseDate = await getCurrentDateStream();
                console.log('back0', baseDate);
            }*/
            baseDate = await getCurrentDateStream();
            console.log('Date: ', baseDate);
            baseTime = await getCurrentTimeStream();
            ({ GRIDX: nx, GRIDY: ny } = getPosObj());
            //nx = 55;
            //ny = 127;
            resUrl = `${baseUrl}${requestedSubUrl}serviceKey=${servKey}`
                + `&pageNo=${pageNo}&numOfRows=${numOfRows}`
                + `&dataType=${dataType}&base_date=${baseDate}`
                + `&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
            console.log('url: ', resUrl);
            break;
        case 'MID':
            requestedSubUrl = 'MidFcstInfoService/getMidLandFcst?';
            numOfRows = 10;
            regionId = '11B00000';
            baseDate = getCurrentDateStream();
            resUrl = `${baseUrl}${requestedSubUrl}serviceKey=${servKey}`
                + `&pageNo=${pageNo}&numOfRows=${numOfRows}`
                + `&dataType=${dataType}&regId=${regionId}`
                + `&tmFc=${baseDate}0600`;
            break;
        case 'AIR':
            requestedSubUrl = 'ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?';
            numOfRows = 100;
            sidoName = '경기';
            resUrl = `${baseUrl}${requestedSubUrl}serviceKey=${servKey}`
                + `&returnType=${dataType}&numOfRows=${numOfRows}`
                + `&pageNo=${pageNo}&sidoName=${sidoName}`
                + '&ver=1.4';
            break;
    }
    
    return resUrl;
}

// 실황 날씨 데이터 갱신 시간에 맞도록 필요시 조정된 시간 문자열 되돌려주고
// 조정이 필요 없는 시간, 그러니 이 경우는 40분을 넘어서는 분을 가진 시간의
// 경우엔 그냥 시간의 조정없이 원래 넘겨진 시간 그대로 되돌려준다.
function adjustTime(time, mode) {
    if (mode == 'SHORT') {
        if ((2310 <= +(time)) && (+(time) < 210)) {
            return '2300';
        } else if ((210 <= +(time)) && (+(time) < 510)) {
            return '0200';
        } else if ((510 <= +(time)) && (+(time) < 810)) {
            return '0500';
        } else if ((810 <= +(time)) && (+(time) < 1110)) {
            return '0800';
        } else if ((1110 <= +(time)) && (+(time) < 1410)) {
            return '1100';
        } else if ((1410 <= +(time)) && (+(time) < 1710)) {
            return '1400';
        } else if ((1710 <= +(time)) && (+(time) < 2010)) {
            return '1700';
        } else if ((2010 <= +(time)) && (+(time) < 2310)) {
            return '2000';
        } 
    } else {
        let regex = /([0-9]{2})([0-9]{2})/; // 4자리의 숫자 문자열에서 앞의 두 자리, 뒤의 두 자리를 그룹으로 묶어 분리 판단하는 정규식이다.
        let results = time.match(regex);
        // splice는 배열에서 삭제된 그 요소를 반환한다. 그렇기 때문에 만약에 어떤 배열에서
        // 특정 요소가 제거되어 빠진 전체 결과 배열을 쓰고자 한다면 xxx.match(yyy).splice(0,1)를
        // 결과로 받아 쓰지 말고 그냥 xxx.match(yyy)의 결과에 splice를 적용해서 zzz.splice(0,1)
        // 그 zzz를 쓰는 쪽으로 활용하도록 한다. 참고로 이 경우 xxx.match(yyy)의 결과를
        // 저장한 변수는 zzz가 된다.
        results.splice(0, 1);
        if ((+results[1]) <= 40) { // 분 부분이 40분 이하 값인지 보고 해당되면
            // 시간 부분을 문자열에서 숫자로 바꿔주고 1시간 이전 시간 값으로 바꿔준뒤 24시
            // 시간 체제에 맞도록 수를 바꿔준 뒤 0이 선행하는 2자릿수 형태의 문자열로
            // 포맷을 맞춘 문자열로 results[0] 값을 세팅해준 후에 시간부분인 results[0]와
            // 분 부분인 results[1]를 결합한 문자열 반환해준다.
            results[0] = String(((+results[0]) - 1) % 24).padStart(2, '0');
            return `${results[0]}${results[1]}`
        } else { // 분 부분이 40을 초과하는 값이라면 시간의 조정 없이
            // 그냥 원래의 시간 문자열 값을 그대로 반환해준다.
            return time;
        }
    }
    
}


async function getCurrentDateStream(backupDate = 0) {
    let d = new Date();
    d.setDate(d.getDate() - backupDate);
    return d.toLocaleDateString(
        'ko-KR', { year: "numeric", month: "2-digit", day: "2-digit" })
        .replace(/^([0-9]*). ([0-9]*). ([0-9]*).$/, '$1$2$3');
}

async function getCurrentTimeStream() {
    // 옵션에서 hour12가 있을 경우 설령 false로 되어 있다해도 hourCycle도 옵션에 같이 선언되어 있을 경우 hourCycle을 무효화 한다.
    // 기상청 날씨 데이터를 받아오기 위한 요청 url을 구성하는데 있어 24시 즉 자정 12시의 표시는 24시가 아닌 00시로 보내야
    // 인식이 되는 특성이 있어서 반드시 hourCycle: "h23"을 옵션에 선언해줘야 하므로 만약에 옵션에 hour12가 있을 경우 그건
    // 빼준다.
    return new Date().toLocaleTimeString(
        'ko-KR', { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) 
        .replace(/^([0-9]*):([0-9]*)$/, '$1$2');
}

/*var scrollHandler = function (e) {
    if (chart.container().getContainerElement().getBoundingClientRect().top < 50) {
        window.removeEventListener('scroll', scrollHandler)
        chart.draw();
    }
};

window.addEventListener('scroll', scrollHandler, false);*/



/*var inView = false;

function isScrolledIntoView(elem) {
    var htmlElem = document.querySelector('html');
    //var docViewTop = $(window).scrollTop();
    var docViewTop = document.documentElement.scrollTop();
    //var docViewBottom = docViewTop + $(window).height();
    var docViewBottom = docViewTop + htmlElem.clientHeight;
    var el = document.querySelector(elem);
    var rect = el.getBoundingClientRect();
    var offset = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };

    //var elemTop = $(elem).offset().top;
    var elemTop = offset.top;
    //var elemBottom = elemTop + $(elem).height();
    var elemBottom = elemTop + el.clientHeight;

    return ((elemTop <= docViewBottom) && (elemBottom >= docViewTop));
}*/

/*$(window).scroll(function () {
    if (isScrolledIntoView('#canvas')) {
        if (inView) { return; }
        inView = true;
        new Chart(document.getElementById("canvas").getContext("2d")).Pie(data);
    } else {
        inView = false;
    }
});*/
let LabelInfo = {
    text: 'none',       // 라벨에 표시될 텍스트 정보
    xBase: 0,          // 라벨의 x 기준위치
    yBase: 0,          // 라벨의 y 기준위치
    xCurrent: 0,       // 라벨의 현재 x 위치
    yCurrent: 0,       // 라벨의 현재 y 위치
    width: 0,          // 라벨의 너비
    height: 0,         // 라벨의 높이
    axisID: 'none',        // 라벨이 관련된 축의 이름, x축 또는 y축 어느쪽에든 관련있는
    // 1대1 관계로 관련되기 마련인 것이 라벨이므로, xAxisID, yAxisID
    // 라고 하지 않고 그냥 관련된 축 하나만 지정하면 되므로 axisID
    // 라 했다.
    inView: false,          // 현재 뷰포트 안에 있는지 여부 플래그
};

let arrLabelInfo = [];

function initLableInfo(labelItem, scale) {
    const ctx = document.getElementById('chart').getContext("2d");
    let textMetrics = ctx.measureText(labelItem.label);

    let newLabelInfo = {
        source: labelItem,      // 전달된 라벨 소스에 대한 참조 변수
        text: labelItem.label,       // 라벨에 표시될 텍스트 정보

        xBase: labelItem.options.translation[0],          // 라벨의 x 기준위치
        yBase: labelItem.options.translation[1],          // 라벨의 y 기준위치

        xCurrent: labelItem.options.translation[0],       // 라벨의 현재 x 위치
        yCurrent: labelItem.options.translation[1],       // 라벨의 현재 y 위치

        width: textMetrics.width,                 // 라벨의 너비
        height: labelItem.font.lineHeight,      // 라벨의 높이

        scaleStart: scale.left,
        scaleEnd: scale.right,

        axisID: scale.id,        // 라벨이 관련된 축의 이름, x축 또는 y축 어느쪽에든 관련있는
        // 1대1 관계로 관련되기 마련인 것이 라벨이므로, xAxisID, yAxisID
        // 라고 하지 않고 그냥 관련된 축 하나만 지정하면 되므로 axisID
        // 라 했다.

        inView: true,          // 현재 뷰포트 안에 있는지 여부 플래그
    };

    return newLabelInfo;
}

function isLabelInView(inViewFlag) {

}

function getLabelWidthList(chart) {
    const ctx = document.getElementById('chart').getContext("2d");

    for (let i = 2; i <= 5; i++) {
        const scale = chart.scales[`x${i}`];
        const items = scale.getLabelItems();
        //if(i == 3)console.log(scale);
        arrLabelInfo.push(initLableInfo(items[0], scale));
    }

    // 화면에 라벨이 가려지기 전까지 왼쪽으로 갈 수 있는 가상 좌측 경계값
    //arrLabelInfo[0].source.options.translation[0]  ;//640;//671.3731343283582;

}

function getDayWord(num) {
    switch (num) {
        case 0: return '일';
        case 1: return '월';
        case 2: return '화';
        case 3: return '수';
        case 4: return '목';
        case 5: return '금';
        case 6: return '토';
    }
}

function generateWeatherChart(weatherData) {
    const ctx = document.getElementById('chart');
    const wArrowImg = new Image(33, 33);
    wArrowImg.src = "IMAGE/WARROW.png";
    let angle = [];
    let xLables = [];
    stickySetup();
    let temp = [];
    let currentYear = new Date().getFullYear();
    let eachDateHour = 0, dayBase = 0;
    let dayWords = ['일', '월', '화', '수', '목', '금', '토'];
    for (let i = 0; i < weatherData.length; i++) {
        xLables.push(['t', 't', weatherData[i].fcstTime]);
        console.log('d: ', weatherData[i].fcstDate);
        //console.log(weatherData[i].fcstTime);

        if (weatherData[i].fcstTime != '00:00') {
            eachDateHour++; // '00:00'시 외의 모든 시간 1씩 증가 시켜서 1개부터 카운트 들어간다.
        } else {
            rowDateDistributionLen.push(eachDateHour);
            
            let date = weatherData[i].fcstDate.replace(' ', '/');
            
            if (rowDateDistributionLen.length == 1) { // 날짜 표시 플렉스 박스의 첫 번째 푸시가 일어난 후
                dayBase = new Date(`${date} ${currentYear}`).getDay(); // 첫 번째 날짜의 요일 기준점 찾기
            } else { // 이후 뒤따르는 요일들은 순차적으로 1씩 증가하고
                dayBase++;
            }
            date += '(' + dayWords[(dayBase % 7)] + ')'; // 일주일 간격을 고려한 모듈러 연산을 통해 요일 색인값 산출해서 구체적인 요일 문자열로 대체
            // 결과적으로 얻은 날짜 및 요일로 p 요소의 텍스트 채워주기
            document.querySelector(`.date0${rowDateDistributionLen.length}.sticky-label p`).innerText = date;
                
            eachDateHour = 1; // '00:00'시로 탐지된 항목 자체부터 1개로 다시 카운트를 들어간다.
        }

        temp.push(weatherData[i].tmp.value); // 온도값
    }
    rowDateDistributionLen.push(eachDateHour); // 마지막 날의 남은 시간들 개수도 마지막으로 누적시켜 준다.
    document.querySelector(`.date0${rowDateDistributionLen.length}.sticky-label p`).innerText =
        weatherData[weatherData.length - 1].fcstDate.replace(' ', '/') +
        '(' + dayWords[((dayBase + 1) % 7)] + ')';
    colTotalLen = weatherData.length; // 생성된 총 단기 날씨 열들의 개수

    // 기록한 각 날짜가 표에서 차지하는 열들의 수에 따라 flex값을 설정해서 플렉스 박스 안에서 차지하는 비율을 결정한다.
    // 이 비율에 따라 해당하는 열의 개수만큼의 너비에 걸쳐 그 날짜를 표시하는 구역으로 할당하게 된다.
    document.querySelector('.date01Container').style.flex = `${rowDateDistributionLen[0]}`;
    document.querySelector('.date02Container').style.flex = `${rowDateDistributionLen[1]}`;
    document.querySelector('.date03Container').style.flex = `${rowDateDistributionLen[2]}`;
    document.querySelector('.date04Container').style.flex = `${rowDateDistributionLen[3]}`;

    // 만약에 해당 날짜가 차지하는 열의 개수가 한 개 밖에 안될 경우 sticky를 단순한 block으로 
    // 바꿔주고 그 앞뒤의 blank 역시 display 값을 none으로 해 화면상에서 제거한 채 단일 
    // 열 너비의 공간에 날짜를 표시하게 된다.
    for (var i = 1; i <= 4; i++) {
        if (rowDateDistributionLen[i - 1] == 1) {
            /*document.querySelector(`.date0${i}.sticky-label`).style.setProperty(`--singleFlg0${i}`, "");
            console.log(document.querySelector(`.date0${i}.sticky-label`).style.width);*/
            //document.querySelector(`.date0${i}.sticky-label`).style.flexBasis = "";
            //document.querySelector(`.date0${i}.sticky-label`).style.display = 'block';
            document.querySelectorAll(`.date0${i}Container .blank`).forEach((elem) => {
                elem.style.display = 'none';
            });
            document.querySelector(`.date0${i}.sticky-label`).style.flex = "1";
        } else {
            //let val = 
            document.querySelector(`.date0${i}.sticky-label`).style.flex = `0 0 ${(1 / rowDateDistributionLen[i - 1]) * 120}%`;
        }
    }
    //element.style.setProperty("--my-var", jsVar + 4);
    //stickySetup();
    let tempMin = Math.min(...temp);
    let tempMax = Math.max(...temp);

    const ArrPrecipitationIdx = 2;
    const ArrRainProbIdx = 3;
    const ArrWindDirIdx = 4;
    const ArrWindSpdIdx = 5;
    const ArrHumidIdx = 6;

    const ArrWeatherIconIdx = 7;
    const ArrWeatherDescIdx = 8;
    const wIconArr = [];

    for (let i = 0; i < weatherData.length; i++) {
        angle.push(weatherData[i].vec.value);

    }


    // hoverSegment plugin
    const hoverSegment = {
        id: 'hoverSegment',
        beforeDatasetsDraw(chart, args, plugins) {

            const { ctx,
                chartArea: { top, bottom, left, right, width, height },
                scales: { x, y } } = chart;

            let segment = width / (x.max + 1);
            if (hovering != undefined) {
                ctx.fillStyle = 'rgba(203,223,243,0.5)';
                //ctx.fillStyle = 'rgba(203,223,243,0)';
                //console.log(top);
                //ctx.fillRect(x.getPixelForValue(hovering) - (segment / 2), top, segment, height);
                ctx.fillRect(x.getPixelForValue(hovering) - (segment / 2), 0, segment, bottom);
            }
        },
        afterEvent(chart, args, plugins) {
            const { ctx,
                chartArea: { top, bottom, left, right, width, height },
                scales: { x, y } } = chart;
            /*if (args.inChartArea == true) {*/
            // chart js에서 inChartArea가 true가 되는 상황이 딱 그리드 내부 영역에만 있는 상황이
            // 아니라 그 밖으로도 (특히 x축으로) 몇 픽셀 밖으로 삐져나와있는 걸로 설정되어 있어서 
            // 이를 기반으로 그리드의 특정 행이나 열의 배경색을 칠했을 경우 x나 y축 tick 영역의 행 
            // 또는 열까지 배경색을 칠하거나 그리드 안쪽의 행 또는 열을 칠한다고 해도 이를 판단하는
            // 마우스의 위치를 그리드 밖으로 수 픽셀 벗어나는 건 파악못하고 계속 그리드 안쪽 행
            // 또는 열 배경을 칠해놓은 상태로 유지되는 현상이 생긴다. 그렇다고 하드코딩으로
            // 수 픽셀 좌우 깎아먹도록 정해 탐지하는 것도 디바이스 환경이 바뀔 때마다 어찌될지 모르니
            // 불안한 측면이 있으므로 chart js에서 판단하는 inChartArea 플래그 값에 기반해서 판단하지
            // 말고 차라리 차트 영역의 상하좌우의 범위 안에 마우스 포인터가 들어와 있는지 아래와 같이
            // 직접 판단하는 쪽이 이 경우엔 낫겠다.
            if (((top < args.event.y) && (bottom > args.event.y))
                && ((left < args.event.x) && (right > args.event.x))) {
                /*if ((x2.getPixelForTick(0) > args.event.x)
                    && (x2.getPixelForTick(x2.ticks.length - 1) < args.event.x))*/
                hovering = x.getValueForPixel(args.event.x);
            } else {
                hovering = undefined;
            }
            args.changed = true;
        }
    };
    let hovering = undefined;


    const showPointValue = { // 온도값 표시 플러그인
        id: 'showPointValue',

        afterDraw: function () {

            const ctx = document.getElementById('chart').getContext("2d");

            // 아래에서 y좌표에 대해 getPixelForTick이 아닌 getPixelForValue를 쓴 이유는
            // getPixelForTick의 경우 매개변수로 색인 값을 받고 색인이 증가하면서 그 색인에
            // 대응되는 y축의 tick 값이 증가하게 된다. 문제는 그 y좌표축의 색인에 따라 증가하는 
            // tick 값에 해당하는 픽셀의 위치 값을 받아오게 될 경우 만약에 여기서의 경우처럼
            // 좌표에 최소, 최대값을 min, max를 통해 제한하게 되면 예를 들어 tick 값은 색인이
            // 증가하더라도 tick 값이 max에 도달하고 나서는 계속 같은 tick 값을 유지하게 되는
            // 형태가 되며 결과적으로 거기서 받아오게 되는 픽셀의 y 값은 계속 같은 높이 값만
            // 받아오게 된다. 그래서 대신에 getPixelForValue를 써야 라인 그래프의 각 포인트의
            // 값이 곧 y축 tick 값과 대응되므로 거기서 제대로 각 포인트에 해당하는 y축 픽셀 높이
            // 값을 받아올 수 있는 것이다. 하지만 반대로 x축에 대해서는 포인트에 저장된 값이 y축에
            // 대응되는 값이므로 오히려 getPixelForValue를 쓸 수 없고 순차적으로 증가하는 색인에
            // 일대일 대응되는 tick을 활용해 x좌표값을 받아올 수 있는 getPixelForTick을 써야한다.
            //ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            myChart.data.datasets[1].data.forEach(function (value, index) {
                let x = myChart.scales.x.getPixelForTick(index);
                let y = myChart.scales.y.getPixelForValue(value) - 25;
                if (index == 0) {
                    ctx.fillStyle = 'red';
                } else {
                    ctx.fillStyle = 'black';
                }
                ctx.fillText(value + '˚C', x, y);
            })
            ctx.restore();
        }
    };

    const showPrecipitation = { // 강수량 표시 플러그인
        id: 'showPrecipitation',
        afterDraw: function () {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";//"middle";
            ctx.fillStyle = 'black';
            for (var i = 0; i < weatherData.length; i++) {
                ctx.fillText(
                    weatherData[i].pcp.value,
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y0.getPixelForValue(myChart.data.datasets[ArrPrecipitationIdx].data[i]));
            }
        }
    };

    const showRainProbability = { // 강수확률 표시 플러그인
        id: 'showRainProbability',
        afterDraw: function () {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";//"middle";
            ctx.fillStyle = 'black';
            for (var i = 0; i < weatherData.length; i++) {
                ctx.fillText(
                    weatherData[i].pop.value + weatherData[i].pop.unit,
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y0.getPixelForValue(myChart.data.datasets[ArrRainProbIdx].data[i]));
            }
        }
    };

    const showWindSpdDir = { // 풍향, 풍속 표시 플러그인
        id: 'showWindSpdDir',
        afterDraw: function () {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";//"middle";
            ctx.fillStyle = 'black';
            for (var i = 0; i < weatherData.length; i++) {
                ctx.fillText(
                    weatherData[i].vec.value + weatherData[i].vec.unit,
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y0.getPixelForValue(myChart.data.datasets[ArrWindDirIdx].data[i]));

                ctx.fillText(
                    weatherData[i].wsd.value + weatherData[i].wsd.unit,
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y0.getPixelForValue(myChart.data.datasets[ArrWindSpdIdx].data[i]));
            }
        }
    };

    const showHumidity = { // 습도 표시 플러그인
        id: 'showHumidity',
        afterDraw: function (chart, args, options) {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";//"middle";
            ctx.fillStyle = 'black';
            for (var i = 0; i < weatherData.length; i++) {
                ctx.fillText(
                    weatherData[i].reh.value + weatherData[i].reh.unit,
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y0.getPixelForValue(myChart.data.datasets[ArrHumidIdx].data[i]));
            }
        }
    };

    const showWeatherDesc = {
        id: 'showWeatherDesc',
        afterDraw: function (chart, args, options) {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = 'black';
            for (var i = 0; i < weatherData.length; i++) {
                ctx.fillText(
                    decodeWeather( //문자열 형태로 저장된 숫자값을 +를 붙여 숫자로 변환
                        +weatherData[i].sky.value,
                        +weatherData[i].pty.value),
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y2.getPixelForValue(myChart.data.datasets[ArrWeatherDescIdx].data[i]));
            }
        }
    };

    /*const decodeWeather = function (skyStatus, rainType) {
        if (rainType == 0) {
            switch (skyStatus) {
                case 1: return '맑음';
                case 3: return '구름많음';
                case 4: return '흐림';
                default: return `noValue${skyStatus}`;
            }
        } else {
            switch (rainType) {
                case 1: return `비`;
                case 2: return `비/눈`;
                case 3: return `눈`;
                case 4: return `소나기`;
            }
        }
    };

    const getWIcon = function (result) {
        switch (result) {
            case '맑음': return 'sunny2';
            case '구름많음': return 'cloud25';
            case '흐림': return 'cloudy1';
            case '비': return 'rain2';
            case '비/눈': return 'snowDrops12';
            case '눈': return 'snowDrops22';
            case '소나기': return 'thunderStorm2';
            default: return 'sunny2';
        }
    }*/

    const canvasBackgroundColor = {
        id: 'canvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
            const { ctx,
                chartArea: { top, bottom, left, right, width, height },
                scales } = chart;

            ctx.save();
            options['color'].forEach((backgroundColor, i) => {
                ctx.fillStyle = options['color'][i];
                ctx.fillRect(left, scales[`y${i}`].top, width, scales[`y${i}`].height);
            });
            ctx.restore();
        }
    };
    let initLabelInfo = true;
    const followingDateDisplay = {
        id: 'followingDateDisplay',
        //beforeDraw(chart) {
        afterDraw(chart, args, options) {
            /*const scale = chart.scales.x2;
            const items = scale.getLabelItems();
            //console.log(items);
            const { data } = chart.getDatasetMeta(9);
            const { x, width } = data[0];
            const newX = x - width / 2 + 150;*/
            if (initLabelInfo == true) {
                getLabelWidthList(chart);
                initLabelInfo = false;
            }

        },
        afterEvent(chart, args, plugins) {
            if (initLabelInfo == false) {
                if (scrolling == true) {

                    scrolling = false;
                    myChart.update();

                }
            }
        }
    };

    var myChart = new Chart(ctx, {
        // 복수의 플러그인 넣을 땐 이와 같이 배열을 활용한다. 배열의 요소는 각 플러그인의
        // 객체명이 쓰인다. 각각의 플러그인은 그 안에 고유한 id가 있어야 하지만 아래의 
        // 배열에서 쓰이는 건 방금전에도 말했듯이 어디까지나 해당 플러그인 객체명을
        // 쓰게 되고 각각 고유한 id가 내부에 있어야 하긴 하지만 id가 유일하기만 하면 될 뿐
        // 그게 아래 배열에서 쓰이는 게 아니기 때문에 해당 플러그인의 객체명과 그 id는 같을
        // 필요는 없다.
        plugins: [
            hoverSegment,
            showPointValue,
            showPrecipitation,
            showRainProbability,
            showWindSpdDir,
            showHumidity,
            showWeatherDesc,
            canvasBackgroundColor,
            //followingDateDisplay
        ],
        //type: 'line',//'bar',
        data: {
            labels: xLables, //['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                    type: 'bar',
                    label: 'test2',
                    data: Array(temp.length).fill([tempMin - 5, tempMin - 1]),
                    categoryPercentage: 1,
                    barPercentage: 1,
                    backgroundColor: 'rgba(0,0,0,0)',
                    xAxisID: 'x',
                    yAxisID: 'y',
                },
                {
                    type: 'line',
                    label: 'middleTempGraph',
                    data: temp,//[12, 19, 3, 5, 2, 3],
                    borderWidth: 1,
                    fill: false,
                    pointStyle: wArrowImg,
                    xAxisID: 'x',
                    //xAxisID: 'x2',
                    yAxisID: 'y',
                    order: 0,
                    pointRotation: angle // 풍향 각도 변수(angle)에 따른 포인터 화살표 이미지 회전
                },
                { // 아래쪽 섹션 강수량
                    type: 'line',
                    label: 'belowPrecipitation',
                    data: Array(temp.length).fill(9),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    //xAxisID: 'x',
                    yAxisID: 'y0',
                },
                { // 아래쪽 섹션 강수 확률
                    type: 'line',
                    label: 'belowRainProbability',
                    data: Array(temp.length).fill(7),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    //xAxisID: 'x',
                    yAxisID: 'y0',
                },
                { // 아래쪽 섹션 풍향
                    type: 'line',
                    label: 'belowWindDir',
                    data: Array(temp.length).fill(5),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    //xAxisID: 'x',
                    yAxisID: 'y0',
                },
                { // 아래쪽 섹션 풍속
                    type: 'line',
                    label: 'belowWindSpd',
                    data: Array(temp.length).fill(3),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    //xAxisID: 'x',
                    yAxisID: 'y0',
                },
                { // 아래쪽 섹션 습도
                    type: 'line',
                    label: 'belowHumid',
                    data: Array(temp.length).fill(1),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    //xAxisID: 'x',
                    yAxisID: 'y0',
                },
                { // 위쪽 섹션 기상 상태 아이콘
                    type: 'line',
                    label: 'aboveWeatherIcon',
                    data: Array(temp.length).fill(6),
                    pointStyle: function (context) {
                        //console.log(context);
                        let idx = context.dataIndex;
                        //const wIcon = new Image(50, 50);
                        //wIcon.src = `IMAGE/wIcon/sunny.jpg`;
                        //return wIcon;
                        let result = decodeWeather( //문자열 형태로 저장된 숫자값을 +를 붙여 숫자로 변환
                            +weatherData[idx].sky.value,
                            +weatherData[idx].pty.value);
                        let iconName = getWIcon(result);
                        const wIcon = new Image(50, 50);
                        wIcon.src = `IMAGE/wIcon/${iconName}.png`;
                        //wIcon.aspectRatio = 'auto';
                        //wIcon.style.objectFit = 'cover';
                        return wIcon;
                    },
                    borderColor: 'rgba(0, 0, 0, 0)',
                    xAxisID: 'x',
                    yAxisID: 'y2',
                },
                { // 위쪽 섹션 기상 상태 설명
                    type: 'line',
                    label: 'aboveWeatherDesc',
                    data: Array(temp.length).fill(2),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    xAxisID: 'x',
                    yAxisID: 'y2',
                },
                /*{
                    type: 'bar',
                    label: 'bunk',
                    categoryPercentage: 1,
                    barPercentage: 1,
                    data: [10],
                    xAxisID: 'x2'
                }*/
            ]
        },
        options: {
            maintainAspectRatio: false,//영상
            layout: {//영상
                autoPadding: false,
                padding: {
                    top: -12,

                }
            },
            /*animation: {
                //duration: 0,
                onComplete: function () {
                    //var meta = myChart.getDatasetMeta(9);
                    //console.log(meta);
                    if (scrolling == true) {
                        scrolling = false;
                        myChart.update();
                    }
                }
            },*/
            plugins: {
                canvasBackgroundColor: {
                    color: ['rgba(0, 0, 255, 0.3)', , 'rgba(0, 255, 0, 0.3)']
                },
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                },
            },
            transitions: {
                active: {
                    animation: {
                        duration: 0
                    }
                }
            },
            responsive: false,
            scales: {
                y0: {
                    border: {
                        display: false
                    },
                    // 동일 축상에 쌓이는 y축들은 scales에서 먼저 등장해 정의되는 것이
                    // 그래프의 제일 아래쪽에 위치하게 된다. 그래프가 그려지는 캔버스의
                    // 기준점이 좌측 상단인걸 감안하면 순서가 반대가 되어야 하는거 아닌가도
                    // 싶은데 굳이 스택이라는 프로퍼티 이름을 써서 정의하는 성질인만큼
                    // 그 성질에 맞게 정의된 것이 아닌가 싶다.

                    min: 0,
                    max: 11,
                    //labels: ['ON', 'OFF'], // y축의 경우 틱 값이 배열의 앞에 있는 요소일수록
                    // 위쪽으로 간다. 차트가 그려지는 캔버스의 좌표값 위로갈수록 y값이
                    // 작아진다는 걸 감안하면 이 또한 그 방향성에 영향을 받는듯 하다.
                    // 차트를 그릴 때는 y축 틱 값은 숫자일 경우 아래쪽으로 갈수록 작아지
                    // 지만 틱의 배열 요소의 색인 값은 그 증감의 방향이 반대임을 기억하자.
                    stack: 'demo',
                    stackWeight: 4,//2,
                    position: 'left',
                    grid: {
                        //tickLength: 15,
                        drawTicks: false,
                        //display: false,
                        drawBorder: true
                    },
                    ticks: {
                        autoSkip: false,
                        stepSize: 1,
                        display: false,
                    },

                },
                y: {
                    border: {
                        display: false
                    },
                    stack: 'demo',
                    stackWeight: 5,//3,
                    position: 'left',
                    min: tempMin - 3,
                    max: tempMax + 3,
                    grid: {
                        //tickLength: 15,
                        //display: false, // y축에 수직인 수평 그리드 라인 제거
                        z: 2,
                        color: 'rgba(0,0,0,0.1)',
                        drawTicks: false,//영상
                        drawBorder: true
                    },
                    ticks: {
                        autoSkip: false,
                        stepSize: 1,
                        //beginAtZero: false,
                        display: false,//영상
                        z: 1,
                        callback: function (value, index, values) {
                            return value + '˚C';
                        }
                    },

                },
                y2: {
                    border: {
                        display: false,

                    },
                    min: 0,
                    max: 10,
                    stack: 'demo',
                    stackWeight: 3,//2,
                    position: 'left',
                    grid: {
                        //tickLength: 15,
                        drawTicks: false,
                        //display: false,
                        drawBorder: true//영상
                    },
                    ticks: {
                        autoSkip: false,
                        stepSize: 1,
                        display: false,
                    },

                },
                x: {
                    /*afterFit: (axis) => {
                        // 가장 우측 끝의 세로 라인이 이 값을 0으로 하면 안보인다.
                        //axis.height = 10;
                        console.log(axis);
                    },*/
                    border: {
                        display: true,
                    },
                    position: 'top',
                    afterFit: (axis) => {
                        axis.width = 15;
                    },
                    grid: {
                        //drawOnChartArea: true,
                        z: 2, // x축에 대해 수직으로 세로로 그어지는 그리드 라인들을
                        // z 깊이를 설정한다. value <= 0인 경우엔 데이터셋 뒤쪽에
                        // 그리드가 깔려 그려지고 value > 0인 경우엔 데이터셋 앞에
                        // 그리드가 그려진다. 다시 말해 그리그의 그래프에 겹쳐지는
                        // 부분에 있어 그리드가 그래프를 덮어 그 위에 그려지고 그래프
                        // 가 그리드에 일부 가려지게 되는 것이다.
                        //offset: true,
                        tickLength: 17,
                        drawTicks: true,
                        color: 'rgb(48,128,208)',//['rgba(0,0,0, 0.0)'].concat(Array(temp.length).fill('rgb(48,128,208)')),
                        //color: 'rgb(48,128,208)',
                        /*color: {
                            callback: function (test) {
                                console.log(test);
                                if (index == 0) {
                                    return 'rgb(48,128,208, 0.0)';
                                } else {
                                    return 'rgb(48,128,208)';
                                }
                            }
                        },*/
                        //display: false,
                        //drawTicks: false,
                        drawBorder: true
                    },
                    ticks: {

                        /*font: {
                            size: 20
                        },*/

                        padding: -14, // x좌표축 상에 함께 표시되는 틱 값들을 보다 x축
                        // 쪽으로 바짝붙여서 틱 구분선 사이에 보다 확실히 들어오도록
                        // 하기 위해 음수 패딩을 줬다. 다만 이것만 가지고는 틱 값의 위쪽
                        // 글자가 잘리는 부작용이 있어서 글자 위에 쓸모없는 글자들을
                        // 추가로 넣어 표시가 필요한 글자는 상대적으로 더 아래쪽으로 밀려
                        // 나도록 함께 조치해줬다(['test', 'test', weatherData[i].fcstDate, weatherData[i].fcstTime]).
                        // 위의 경우 두 개의 'test' 만큼 표시 되는 틱 값 전체의 높이가 높아지면서 사실상
                        // 그 'test' 두개는 버려지는 부분이 되고 그 다음의 날짜 및 시간부분이 더 x축쪽으로
                        // 밀려나 표현이 되면서 x축에 좀 더 바짝붙이면서도 표시가 필요한 틱 값은 전부
                        // 살릴 수 있게 되는 것이다.

                        z: 1, // 이걸 안하면 호버링시 칠해지는 옅은 배경색이 x축의 
                        // tick(여기서의 경우엔 날짜 및 시간)을 덮어버려 배경색의 
                        // 투명도 만큼 해당 텍스트가 가려져 흐릿하게 나온다.

                        //labelOffset: 10, // x좌표 레이블의 수평 오프셋 값

                        min: 0, // 여기서의 min과 max는 각 틱의 최소, 최대 값이라기 보다는
                        max: xLables.length - 1, // 틱 색인값의 최소, 최대 값을 나타내는 옵션이다.

                        autoSkip: false, // 틱 값들이 서로 간섭이 일어나든 어쩌든 상관없이
                        // 스킵되지 않고 전부 표시되도록 하려면 이와 같이 autoSkip을 false
                        // 로 세팅해준다. 다만 이것만 가지고는 원하는대로 잘 작동하지 않고
                        // 틱 값들이 스킵되는 경우가 종종 보이는데 이를 방지하기 위해선
                        stepSize: 1, // 이와 같이 틱 값들 간의 단계 수치를 지정해주는
                        // 옵션인 stepSize의 값을 이와 같이 지정해주는게 좋다.
                        /*callback: function (value, index, values) { // x축에 날짜 및 시간 표시
                            if ((value == 0) || (this.getLabelForValue(value)[3] == '00:00')) {
                                return this.getLabelForValue(value); // 날짜와 시간 표시
                            } else {
                                return this.getLabelForValue(value)[3]; // 시간만 표시
                            }
                        },*/
                        callback: function (value, index, values) {
                            //console.log(this.getLabelForValue(value));
                            //ctx.font = 'bold';
                            return this.getLabelForValue(value);
                        },

                    },

                },
                /*x5: {
                    type: 'category',
                    offset: true,
                    labels: [x2Lables[3]],//Array(arrStackWeight[3]).fill(x2Lables[3]),//x2Lables[3],
                    stack: 'day',
                    stackWeight: arrStackWeight[3],//7,
                    border: {
                        display: true,
                        color: 'blue',// grid.borderColor가 대체된 형태
                        width: 5
                    },
                    position: 'top',
                    grid: {
                        offset: true,
                        color: 'rgba(0,0,255, 0.2)',
                        //borderColor: 'blue'// grid.borderColor는 border.color로 대체됐다.
                    },
                    ticks: {
                        //backdropPadding: 0,
                        align: 'inner',
                        //count: arrStackWeight[3],
                        maxTicksLimit: 2,
                        callback: function (value, index, values) {
                            //return this.getLabelForValue(value);
                            //console.log('get');
                            //console.log(.scales.x2.getLabelItems());
                            //console.log(this);
                            if (index == 0) {
                                return x2Lables[3];
                            } else {
                                return '';
                            }
                        },
                        display: true,
                        //stepSize: 1,
                        autoSkip: false,
                        z: 1
                        //padding: 10
                    }
                },
                x4: {
                    type: 'category',
                    offset: true,
                    labels: [x2Lables[2]],//Array(arrStackWeight[2]).fill(x2Lables[2]),//x2Lables[2],
                    stack: 'day',
                    stackWeight: arrStackWeight[2],//7,
                    border: {
                        display: true,
                        color: 'red',
                        width: 5
                    },
                    position: 'top',
                    grid: {
                        offset: true,
                        color: 'rgba(255,0,0, 0.2)',
                        //borderColor: 'red'
                    },
                    ticks: {
                        //backdropPadding: 0,
                        align: 'inner',
                        //count: arrStackWeight[2],
                        maxTicksLimit: 2,
                        callback: function (value, index, values) {
                            //console.log(this.getLabelForValue(value));
                            //return this.getLabelForValue(value);
                            if (index == 0) {
                                return x2Lables[2];
                            } else {
                                return '';
                            }
                        },
                        display: true,
                        //stepSize: 1,
                        autoSkip: false,
                        z: 1
                        //padding: 10
                    }
                },
                x3: {
                    type: 'category',
                    offset: true,
                    labels: [x2Lables[1]],//Array(arrStackWeight[1]).fill(x2Lables[1]),//x2Lables[1],
                    stack: 'day',
                    stackWeight: arrStackWeight[1],//7,
                    border: {
                        display: true,
                        color: 'green',
                        width: 5
                    },
                    position: 'top',
                    grid: {
                        offset: true,
                        color: 'rgba(0,255,0, 0.2)',
                        //borderColor: 'green'
                    },
                    ticks: {
                        //backdropPadding: 0,
                        align: 'inner',
                        //count: arrStackWeight[1],
                        maxTicksLimit: 2,
                        callback: function (value, index, values) {
                            //console.log(this.getLabelForValue(value));
                            //return this.getLabelForValue(value);
                            if (index == 0) {
                                return x2Lables[1];
                            } else {
                                return '';
                            }
                        },
                        display: true,
                        //stepSize: 1,
                        autoSkip: false,
                        z: 1
                        //padding: 10
                    }
                },
                x2: {
                    afterFit: (axis) => {
                        //console.log('left');
                        //console.log(axis.left);
                    },
                    type: 'category',
                    offset: true,
                    labels: [x2Lables[0]],//Array(arrStackWeight[0]).fill(x2Lables[0]),//x2Lables[0],
                    stack: 'day',
                    stackWeight: arrStackWeight[0],//1,
                    border: {
                        display: true,
                        color: 'purple',
                        width: 5
                    },
                    position: 'top',
                    grid: {
                        offset: true,
                        color: 'rgba(128,128,128, 0.2)',
                        //borderColor: 'purple'
                    },
                    ticks: {
                        //backdropPadding: 0,
                        align: 'inner',
                        //count: arrStackWeight[0],
                        maxTicksLimit: 2,
                        callback: function (value, index, values) {
                            //console.log(this.getLabelForValue(value));
                            //return this.getLabelForValue(value);
                            if (index == 0) {
                                //console.log(Array(arrStackWeight[0]).fill(x2Lables[0]));
                                //console.log(this);// 여기서 this는 스케일 객체 x2 자체를 의미한다.
                                return x2Lables[0];
                            } else {
                                return '';
                            }
                        },
                        display: true,
                        //stepSize: 1,
                        autoSkip: false,
                        z: 1
                        //padding: 10
                    }
                },*/
                y3: {
                    afterFit: (axis) => {
                        // 가장 우측 끝의 세로 라인이 이 값을 0으로 하면 안보인다.
                        axis.width = 2;
                    },
                    position: 'right',
                    grid: {
                        display: false
                    },
                    ticks: {
                        padding: 0,
                        display: false
                    }

                }
            }
        },
    });

    const drawYAxis = {
        id: 'drawYAxis',
        afterDatasetDraw: function (chart, args, options) {
            let { ctx, chartArea: { left, right, top, bottom, width, height }, scales: { x, y } } = fixedYAxisChart;
            //console.log(left, right, top, bottom);
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgb(48,128,208)';
            ctx.moveTo(56, top - 30);
            ctx.lineTo(56, bottom);
            ctx.stroke();
            ctx.closePath();
        }
    };

    const getScrollbarWidth = function (className) {
        return document.querySelector(className).offsetHeight - document.querySelector(className).clientHeight;
    };

    const ctxY = document.getElementById('fixedYAxis');
    var fixedYAxisChart = new Chart(ctxY, {
        plugins: [
            drawYAxis
        ],
        data: {
            //labels: ['test'],
            datasets: [
                {
                    display: true,
                    type: 'bar',
                    data: [5],//myChart.data.datasets[0].data[0],
                    yAxisID: 'yMiddle',
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [26],//myChart.data.datasets[1].data[0],
                    yAxisID: 'yMiddle',
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [myChart.data.datasets[2].data[0]],
                    yAxisID: 'yBottom'
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [myChart.data.datasets[3].data[0]],
                    yAxisID: 'yBottom'
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [myChart.data.datasets[4].data[0]],
                    yAxisID: 'yBottom'
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [myChart.data.datasets[5].data[0]],
                    yAxisID: 'yBottom'
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [myChart.data.datasets[6].data[0]],
                    yAxisID: 'yBottom'
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [myChart.data.datasets[7].data[0]],
                    yAxisID: 'yTop'
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [myChart.data.datasets[8].data[0]],
                    yAxisID: 'yTop'
                },
                /*{
                    type: 'line',
                    data: 0,
                    yAxisID: 'yAboveTop',
                    xAxisID: 'xRoof'
                }*/
            ]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                autoPadding: false,
                padding: {
                    top: -10,
                    /*top: () => {
                        console.log(Chart.defaults.font.size);//12
                        return myChart.scales.y2.getPixelForValue(10) + document.querySelector('.wholeDateContainer').clientHeight;
                    }, //myChart.scales.y2.getPixelForValue(10),// + 22,//document.querySelector('.wholeDateContainer').height*/
                    bottom: getScrollbarWidth('.columnWide')
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            //responsive: false,
            scales: {
                yBottom: {
                    stack: 'yFixed',
                    stackWeight: 4,
                    position: 'left',
                    min: 0,
                    max: 11,
                    beginAtZero: true,//영상
                    afterFit: (axis) => {//영상
                        //axis.left = 0;
                        //axis.right = 0;
                        //console.log("axis: ", axis);
                        axis.paddingTop = 0;
                        axis.width = 55;
                    },
                    grid: {
                        //tickLength: 5,
                        drawTicks: false,
                        //display: false
                    },
                    ticks: {

                        //padding: -5,
                        align: 'end',
                        crossAlign: 'center',
                        autoSkip: false,
                        stepSize: 1,
                        display: true,
                        callback: function (value, index, ticks) {
                            switch (value) {
                                case 1: return '습도';
                                case 3: return '풍속';
                                case 5: return '풍향';
                                case 7: return '강수확률';
                                case 9: return '강수량';
                                default: return '';
                            }
                        }
                    },
                    border: {
                        display: true
                    }
                },
                yMiddle: {
                    stack: 'yFixed',
                    stackWeight: 5,
                    position: 'left',
                    min: tempMin - 3,
                    max: tempMax + 3,
                    //beginAtZero: true,
                    afterFit: (axis) => {
                        axis.paddingTop = 0;
                        axis.width = 55;
                    },
                    grid: {
                        //tickLength: 5,
                        //display: false, // y축에 수직인 수평 그리드 라인 제거
                        //z: 2,
                        color: 'rgba(0,0,0,0.1)',
                        drawTicks: false
                    },
                    ticks: {
                        display: true,
                        align: 'end',
                        crossAlign: 'center',
                        autoSkip: false,
                        stepSize: 1,
                        callback: function (value, index, ticks) {
                            let min = tempMin - 3;
                            let max = tempMax + 3;//myChart.scales.y2
                            //let val = (value % );
                            //console.log(val);
                            if (value == Math.ceil(min + ((max - min) / 2))) {
                                return '기온   ';
                            } else {
                                return '';
                            }
                        }
                    },
                    border: {
                        display: true
                    }
                },
                yTop: {
                    stack: 'yFixed',
                    stackWeight: 3,
                    min: 0,
                    max: 10,
                    position: 'left',
                    beginAtZero: true,
                    afterFit: (axis) => {
                        axis.paddingTop = 0;
                        axis.width = 55;
                    },
                    grid: {
                        //tickLength: 5,
                        drawTicks: false,
                        //display: false
                    },
                    ticks: {

                        //padding: -5,
                        align: 'end',
                        crossAlign: 'center',
                        autoSkip: false,
                        stepSize: 1,
                        display: true,
                        callback: function (value, index, ticks) {
                            switch (value) {
                                case 5: return '날씨   ';
                                default: return '';
                            }
                        }
                    },
                    border: {
                        display: true
                    }
                },
                yAboveTop: {
                    layout: {
                        autoPadding: false,
                        padding: {
                            top: 0
                        }
                    },
                    stack: 'yFixed',
                    stackWeight: 1,
                    position: 'left',
                    min: 0,
                    max: 10,
                    afterFit: (axis) => {//영상
                        //axis.left = 0;
                        //axis.right = 0;
                        axis.paddingTop = 0;  // 아래쪽으로 다소 밀려있는 y축 위쪽 0에 해당하는 위치로 복구
                        // 이 프로퍼티가 제대로 효과를 보기 위해서는 동일 축상에 누적돼 쌓여있는 여러 y축들
                        // 전부에 동일하게 이 프로퍼티가 적용되어 있어야 한다. 축선 상의 제일 위쪽에 있는 y축
                        // 요소에만 이 프로퍼티를 적용했을 경우 여전히 y축전체가 다소 아래로 밀려나 있는 현상을
                        // 보인다.
                        axis.width = 55;
                    },
                    grid: {
                        //tickLength: 5,
                        drawTicks: false,
                        //display: false
                    },
                    ticks: {
                        align: 'start',
                        crossAlign: 'center',
                        autoSkip: false,
                        stepSize: 1,
                        display: true,
                        callback: function (value, index, ticks) {
                            switch (value) {
                                case 3: return '시간   ';
                                case 9: return '날짜   ';
                                default: return '';
                            }
                        }
                    },
                },
                x: {

                    offset: true,
                    ticks: {
                        display: false
                    },
                    grid: {
                        drawTicks: false
                    }
                },
                /*xRoof: {
                    position: 'top',
                    ticks: {
                        mirror: true
                    },
                    ticks: {
                        display: false
                    },
                    grid: {
                        drawTicks: false
                    }
                }*/
            }
        }
    });

    function scrollWheel(event, chart) {
        let canvas = document.querySelector('#chart');
        var canvasRect = canvas.getBoundingClientRect();

        //console.log(canvasRect);

        //var x = event.clientX - clientRect.left;
        //var y = event.clientY - clientRect.top;
        //console.log(x + " / " + y);
    }

    /*myChart.canvas.addEventListener('wheel', (e) => {
        scrollWheel(e, myChart);
    });*/

    var updated = false;
    let scrollXDelta = 0;
    document.querySelector('.columnWide').addEventListener('scroll', (e) => {

        //if (scrolling == true) {
        //const containerBox = document.querySelector('.columnWide');
        //console.log('si');
        scrolling = true;
        if (initLabelInfo == false) {
            const containerBox = document.querySelector('.columnWide');
            arrLabelInfo[0].source.options.translation[0] = 60;

            /*arrLabelInfo.forEach((val, index, arr) => {
                console.log('fe');
                if (index == 0) {
                    if (getScrollDirection(containerBox) == 1) {    // when scrolled right
                        // ↓라벨의 좌측이 좌표축의 좌측 시작 경계를 넘어서서 왼쪽으로 가려할 때
                        console.log('try right');
                        //console.log(labelPadding + val.source.options.translation[0]);
                        //console.log(containerBox.getBoundingClientRect().left);
                        //if ((labelPadding + val.source.options.translation[0]) - containerBox.scrollLeft < containerBox.getBoundingClientRect().left) {
                        if (val.source.options.translation[0] - containerBox.scrollLeft < containerBox.getBoundingClientRect().left) {
                            // ↓라벨의 좌측에 라벨의 너비를 더한 라벨의 우측 좌표가 스크롤 크기만큼
                            // 더해줬을 경우 좌표축의 끝을 아직은 넘기지 않았을 경우
                            console.log('less than cb');
                            //val.source.options.translation[0] = containerBox.scrollLeft;
                            val.source.options.translation.splice(0, 1, 60);
                            
                            //updated = true;
                            if (updated == false) {
                                myChart.update();
                                console.log('after', val.source.options.translation[0]);
                                updated = true;
                            }

                            //if ((val.source.options.translation[0] + val.width) + (xBefore-containerBox.scrollLeft) < val.scaleEnd) {
                            if (containerBox.scrollLeft + val.width < val.scaleEnd) {
                                // ↓라벨의 좌측에 라벨의 너비를 더한 라벨의 우측 좌표 크기에 스크롤 크기만큼
                                // 더해줬을 경우 좌표축의 끝을 넘을 때 스크롤 크기만큼 더하지 말고 그냥
                                // 좌표축 끝까지 남은 소량의 공간 만큼만을 더해주고 라벨의 이동을 끝낸다.
                                //console.log('in end')
                                //console.log('before', val.source.options.translation[0]);
                                //val.source.options.translation[0] = containerBox.scrollLeft;
                                //console.log('after', val.source.options.translation[0]);
                                //myChart.update();
                                if ((val.source.options.translation[0] + val.width + containerBox.scrollLeft) > val.scaleEnd) {
                                    val.source.options.translation[0] += (val.scaleEnd - (val.source.options.translation[0] + val.width));
                                } else { // 스크롤 크기만큼 더해줘도 아직은 좌표축의 끝을 넘기지 않으므로 스크롤 크기만큼 더해줌
                                    val.source.options.translation[0] += box.scrollLeft;
                                }
                            }
                            //else {
                            //    val.source.options.translation[0] = val.scaleEnd - val.width;
                            //}
                        } // 스크롤 했어도 아직은 라벨의 좌측이 좌표축의 좌측 시작 경계의 오른쪽에 있어 라벨이동이 필요없는 경우
                    } else {
                        // when scrolled right
                    }
                }
                
            });*/
        }

        //}
    });

    /*let labelPadding = 31;
    let xBefore = 0;
    function getScrollDirection(elem) {
        if (xBefore < elem.scrollLeft) {
            xBefore = elem.scrollLeft; // update xBefore position
            console.log('right dir');
            console.log(elem.scrollLeft);
            return 1; // indicates scrolled to right
        } else if (xBefore > elem.scrollLeft) {
            xBefore = elem.scrollLeft;
            console.log('left dir');
            console.log(elem.scrollLeft);
            return -1; // indicates no movement or scrolled to left
        }
    }
    let scrolling = false;*/
    //stickySetup();
}



// 스크롤 날짜 표시 관련 부분
let observers = [];
let prevScroll = 0;
let scrollDirection = -1;
let initStickyPosition = [];
let scrollElem; // 스크롤 뷰를 제공하는 요소
let wholeContainer; // sticky 라벨들 전부를 감싸는 요소

stickySetup = function () { // lazy sticky related setup
    scrollElem = document.querySelector('.columnWide');
    wholeContainer = document.querySelector('.wholeDateContainer');
    wholeContainer.style.visibility = 'visible';

    scrollElem.onscroll = function (e) {
        if (prevScroll > e.target.scrollLeft) {
            // 오른쪽으로 스크롤, scrollLeft값 증가
            scrollDirection = -1;
        } else {
            // 왼쪽으로 스크롤, scrollLeft값 감소
            scrollDirection = 1;
        }
        prevScroll = e.target.scrollLeft;
    }

    function intersectionCallback(entries) {
        entries.forEach((entry) => {
            let elem = entry.target;
            // 클래스 명에서 색인넘버 추출 후 배열 색인 넘버 체계에 맞도록
            // 1을 빼서 제로를 시작으로 하는 숫자 체계의 색인 값으로 변환.
            let i = (+elem.getAttribute("class").match(/\d+/)[0]) - 1;

            if (entry.isIntersecting) { // 일단 뷰 안에서 왔다갔다 하는 상황
                if (entry.intersectionRatio < 0.5) { // 교차범위가 방향에 상관없이 0.5 미만
                    if ((scrollDirection == 1) && ((initStickyPosition[i] == false))) {
                        // 오른쪽으로 스크롤 중이면서, 해당 요소가 뷰 밖으로 나간적 없는 상황
                        elem.querySelector('.sticky-label').style.left = "0";
                        elem.querySelector('.sticky-label').style.right = "";
                    } else if ((scrollDirection == -1) || (initStickyPosition[i] == true)) {
                        // 왼쪽으로 스크롤 중이면서, 해당 요소가 완전히 뷰 밖에 있다가
                        // 뷰 안으로 진입하고 있는 상황
                        elem.querySelector('.sticky-label').style.left = "";
                        elem.querySelector('.sticky-label').style.right = "0";
                    }
                } else { // 교차범위가 방향에 상관없이 0.5 이상
                    if (scrollDirection == 1) {
                        // 오른쪽으로 스크롤
                        elem.querySelector('.sticky-label').style.left = "0";
                        elem.querySelector('.sticky-label').style.right = "";
                    } else {
                        // 왼쪽으로 스크롤
                        elem.querySelector('.sticky-label').style.left = "";
                        elem.querySelector('.sticky-label').style.right = "0";
                    }
                }
            } else {
                // sticky 요소가 완전히 뷰 밖으로 나가버려서 다시 재진입할시
                // 원하는 끝부분(이 경우는 왼쪽)에 쏠려 있도록 해당 요소의 
                // 위치를 재초기화 해주는 효과가 있는 플래그 변수 세팅.
                // 말하자면 sticky 요소를 원하는 위치로 미리 잡아당겨 놓는 느낌.
                initStickyPosition[i] = true;
            }
        });
    }

    for (var i = 0; i < wholeContainer.children.length; i++) {
        observers[i] = new IntersectionObserver(intersectionCallback, {
            root: scrollElem,
            rootMargin: "20px",
            threshold: [0.0, 1.0]
        });
        initStickyPosition.push(true);
        observers[i].observe(document.querySelector(`.date0${i + 1}Container`));
    }
};

const decodeWeather = function (skyStatus, rainType) {
    if (rainType == 0) {
        switch (skyStatus) {
            case 1: return '맑음';
            case 3: return '구름많음';
            case 4: return '흐림';
            default: return `noValue${skyStatus}`;
        }
    } else {
        switch (rainType) {
            case 1: return `비`;
            case 2: return `비/눈`;
            case 3: return `눈`;
            case 4: return `소나기`;
        }
    }
};

const getWIcon = function (result) {
    switch (result) {
        case '맑음': return 'sunny2';
        case '구름많음': return 'cloud25';
        case '흐림': return 'cloudy1';
        case '비': return 'rain2';
        case '비/눈': return 'snowDrops12';
        case '눈': return 'snowDrops22';
        case '소나기': return 'thunderStorm2';
        default: return 'sunny2';
    }
}
/*window.addEventListener(
    "load",
    (event) => {
        stickySetup();
    },
    false,
);*/