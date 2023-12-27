let colLength;
let rowDateDistributionLen = [];

function WDataItem(name, value, unit) {
    this.name = name;
    this.value = value;
    this.unit = unit;
}

function dateAndTimeFromDTStr(timeString = '0') {
    let extendedTimeArr = [];

    if (timeString == '0')
        return '0000 00 00 00:00:00';
    else {
        if (timeString.length != 12) return 'Invalid Date';

        let timeArr = [...timeString];
        for (var i = 0; i < timeString.length; i++) {
            extendedTimeArr.push(timeArr[i]);
            if (i == 3 || i == 5 || i == 7) {
                extendedTimeArr.push(' ');
            } else if (i == 9 || i == 11) {
                extendedTimeArr.push(':');
            }
        }
    }

    return extendedTimeArr.join('') + "00";
}

function dateStrToSpacedDateStr(dateString) {
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
            case 'TMP':
                parsedData.push(new ShortWDataUnit());
                var j = parsedData.length - 1;
                if (j >= 0) {
                    parsedData[j].baseDate =
                        dateStrToSpacedDateStr(dataTable.item[i].baseDate);
                    parsedData[j].baseTime =
                        timeStrToColonTimeStr(dataTable.item[i].baseTime);
                    parsedData[j].fcstDate =
                        dateStrToSpacedDateStr(dataTable.item[i].fcstDate);
                    parsedData[j].fcstTime =
                        timeStrToColonTimeStr(dataTable.item[i].fcstTime);
                    parsedData[j].tmp.value = dataTable.item[i].fcstValue;
                }
                break;
            case 'POP':
                parsedData[j].pop.value = dataTable.item[i].fcstValue; break;
            case 'PTY':
                parsedData[j].pty.value = dataTable.item[i].fcstValue; break;
            case 'PCP':
                parsedData[j].pcp.value = dataTable.item[i].fcstValue; break;
            case 'REH':
                parsedData[j].reh.value = dataTable.item[i].fcstValue; break;
            case 'SNO':
                parsedData[j].sno.value = dataTable.item[i].fcstValue; break;
            case 'SKY':
                parsedData[j].sky.value = dataTable.item[i].fcstValue; break;
            case 'TMN':
                parsedData[j].tmn.value = dataTable.item[i].fcstValue; break;
            case 'TMX':
                parsedData[j].tmx.value = dataTable.item[i].fcstValue; break;
            case 'UUU':
                parsedData[j].uuu.value = dataTable.item[i].fcstValue; break;
            case 'VVV':
                parsedData[j].vvv.value = dataTable.item[i].fcstValue; break;
            case 'WAV':
                parsedData[j].wav.value = dataTable.item[i].fcstValue; break;
            case 'VEC':
                parsedData[j].vec.value = dataTable.item[i].fcstValue; break;
            case 'WSD':
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
    let dataType = 'json';
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
            baseTime = adjustTime(await getCurrentTimeStream());

            ({ GRIDX: nx, GRIDY: ny } = getPosObj());

            resUrl = `${baseUrl}${requestedSubUrl}serviceKey=${servKey}`
                + `&pageNo=${pageNo}&numOfRows=${numOfRows}`
                + `&dataType=${dataType}&base_date=${baseDate}`
                + `&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
            break;
        case 'SHORT':
            requestedSubUrl = 'VilageFcstInfoService_2.0/getVilageFcst?';
            numOfRows = 1000;
            
            baseDate = await getCurrentDateStream();
            baseTime = await getCurrentTimeStream();
            ({ GRIDX: nx, GRIDY: ny } = getPosObj());
            
            resUrl = `${baseUrl}${requestedSubUrl}serviceKey=${servKey}`
                + `&pageNo=${pageNo}&numOfRows=${numOfRows}`
                + `&dataType=${dataType}&base_date=${baseDate}`
                + `&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
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
        let regex = /([0-9]{2})([0-9]{2})/;
        let results = time.match(regex);
        
        results.splice(0, 1);
        if ((+results[1]) <= 40) { 
            results[0] = String(((+results[0]) - 1) % 24).padStart(2, '0');
            return `${results[0]}${results[1]}`
        } else { 
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
    return new Date().toLocaleTimeString(
        'ko-KR', { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) 
        .replace(/^([0-9]*):([0-9]*)$/, '$1$2');
}

let LabelInfo = {
    text: 'none',
    xBase: 0,          
    yBase: 0,          
    xCurrent: 0,       
    yCurrent: 0,       
    width: 0,          
    height: 0,         
    axisID: 'none',        
    inView: false,         
};

let arrLabelInfo = [];

function initLableInfo(labelItem, scale) {
    const ctx = document.getElementById('chart').getContext("2d");
    let textMetrics = ctx.measureText(labelItem.label);

    let newLabelInfo = {
        source: labelItem,      
        text: labelItem.label,  

        xBase: labelItem.options.translation[0],          
        yBase: labelItem.options.translation[1],          

        xCurrent: labelItem.options.translation[0],       
        yCurrent: labelItem.options.translation[1],       

        width: textMetrics.width,                 
        height: labelItem.font.lineHeight,      

        scaleStart: scale.left,
        scaleEnd: scale.right,

        axisID: scale.id,        
        inView: true,          
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
        arrLabelInfo.push(initLableInfo(items[0], scale));
    }

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

        if (weatherData[i].fcstTime != '00:00') {
            eachDateHour++;
        } else {
            rowDateDistributionLen.push(eachDateHour);
            
            let date = weatherData[i].fcstDate.replace(' ', '/');
            
            if (rowDateDistributionLen.length == 1) {
                dayBase = new Date(`${date} ${currentYear}`).getDay(); 
            } else {
                dayBase++;
            }
            date += '(' + dayWords[(dayBase % 7)] + ')';
            
            document.querySelector(`.date0${rowDateDistributionLen.length}.sticky-label p`).innerText = date;
                
            eachDateHour = 1;
        }

        temp.push(weatherData[i].tmp.value);
    }
    rowDateDistributionLen.push(eachDateHour);
    document.querySelector(`.date0${rowDateDistributionLen.length}.sticky-label p`).innerText =
        weatherData[weatherData.length - 1].fcstDate.replace(' ', '/') +
        '(' + dayWords[((dayBase + 1) % 7)] + ')';
    colTotalLen = weatherData.length;

    document.querySelector('.date01Container').style.flex = `${rowDateDistributionLen[0]}`;
    document.querySelector('.date02Container').style.flex = `${rowDateDistributionLen[1]}`;
    document.querySelector('.date03Container').style.flex = `${rowDateDistributionLen[2]}`;
    document.querySelector('.date04Container').style.flex = `${rowDateDistributionLen[3]}`;

    for (var i = 1; i <= 4; i++) {
        if (rowDateDistributionLen[i - 1] == 1) {
            document.querySelectorAll(`.date0${i}Container .blank`).forEach((elem) => {
                elem.style.display = 'none';
            });
            document.querySelector(`.date0${i}.sticky-label`).style.flex = "1";
        } else {
            document.querySelector(`.date0${i}.sticky-label`).style.flex = `0 0 ${(1 / rowDateDistributionLen[i - 1]) * 120}%`;
        }
    }

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

    const hoverSegment = {
        id: 'hoverSegment',
        beforeDatasetsDraw(chart, args, plugins) {

            const { ctx,
                chartArea: { top, bottom, left, right, width, height },
                scales: { x, y } } = chart;

            let segment = width / (x.max + 1);
            if (hovering != undefined) {
                ctx.fillStyle = 'rgba(203,223,243,0.5)';
                ctx.fillRect(x.getPixelForValue(hovering) - (segment / 2), 0, segment, bottom);
            }
        },
        afterEvent(chart, args, plugins) {
            const { ctx,
                chartArea: { top, bottom, left, right, width, height },
                scales: { x, y } } = chart;
            if (((top < args.event.y) && (bottom > args.event.y))
                && ((left < args.event.x) && (right > args.event.x))) {

                hovering = x.getValueForPixel(args.event.x);
            } else {
                hovering = undefined;
            }
            args.changed = true;
        }
    };
    let hovering = undefined;


    const showPointValue = {
        id: 'showPointValue',

        afterDraw: function () {

            const ctx = document.getElementById('chart').getContext("2d");

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

    const showPrecipitation = {
        id: 'showPrecipitation',
        afterDraw: function () {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = 'black';
            for (var i = 0; i < weatherData.length; i++) {
                ctx.fillText(
                    weatherData[i].pcp.value,
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y0.getPixelForValue(myChart.data.datasets[ArrPrecipitationIdx].data[i]));
            }
        }
    };

    const showRainProbability = {
        id: 'showRainProbability',
        afterDraw: function () {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = 'black';
            for (var i = 0; i < weatherData.length; i++) {
                ctx.fillText(
                    weatherData[i].pop.value + weatherData[i].pop.unit,
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y0.getPixelForValue(myChart.data.datasets[ArrRainProbIdx].data[i]));
            }
        }
    };

    const showWindSpdDir = {
        id: 'showWindSpdDir',
        afterDraw: function () {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
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

    const showHumidity = { 
        id: 'showHumidity',
        afterDraw: function (chart, args, options) {
            const ctx = document.getElementById('chart').getContext("2d");

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
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
                    decodeWeather(
                        +weatherData[i].sky.value,
                        +weatherData[i].pty.value),
                    myChart.scales.x.getPixelForTick(i),
                    myChart.scales.y2.getPixelForValue(myChart.data.datasets[ArrWeatherDescIdx].data[i]));
            }
        }
    };

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
        afterDraw(chart, args, options) {
            
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
        plugins: [
            hoverSegment,
            showPointValue,
            showPrecipitation,
            showRainProbability,
            showWindSpdDir,
            showHumidity,
            showWeatherDesc,
            canvasBackgroundColor,
        ],
        data: {
            labels: xLables,
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
                    data: temp,
                    borderWidth: 1,
                    fill: false,
                    pointStyle: wArrowImg,
                    xAxisID: 'x',
                    yAxisID: 'y',
                    order: 0,
                    pointRotation: angle
                },
                {
                    type: 'line',
                    label: 'belowPrecipitation',
                    data: Array(temp.length).fill(9),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    yAxisID: 'y0',
                },
                {
                    type: 'line',
                    label: 'belowRainProbability',
                    data: Array(temp.length).fill(7),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    yAxisID: 'y0',
                },
                {
                    type: 'line',
                    label: 'belowWindDir',
                    data: Array(temp.length).fill(5),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    yAxisID: 'y0',
                },
                {
                    type: 'line',
                    label: 'belowWindSpd',
                    data: Array(temp.length).fill(3),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    yAxisID: 'y0',
                },
                {
                    type: 'line',
                    label: 'belowHumid',
                    data: Array(temp.length).fill(1),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    yAxisID: 'y0',
                },
                {
                    type: 'line',
                    label: 'aboveWeatherIcon',
                    data: Array(temp.length).fill(6),
                    pointStyle: function (context) {
                        let idx = context.dataIndex;
                        let result = decodeWeather( 
                            +weatherData[idx].sky.value,
                            +weatherData[idx].pty.value);
                        let iconName = getWIcon(result);
                        const wIcon = new Image(50, 50);
                        wIcon.src = `IMAGE/wIcon/${iconName}.png`;
                        return wIcon;
                    },
                    borderColor: 'rgba(0, 0, 0, 0)',
                    xAxisID: 'x',
                    yAxisID: 'y2',
                },
                {
                    type: 'line',
                    label: 'aboveWeatherDesc',
                    data: Array(temp.length).fill(2),
                    pointStyle: false,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    xAxisID: 'x',
                    yAxisID: 'y2',
                },
            ]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                autoPadding: false,
                padding: {
                    top: -12,

                }
            },
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

                    min: 0,
                    max: 11,
                    
                    stack: 'demo',
                    stackWeight: 4,
                    position: 'left',
                    grid: {
                        drawTicks: false,
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
                    stackWeight: 5,
                    position: 'left',
                    min: tempMin - 3,
                    max: tempMax + 3,
                    grid: {
                        z: 2,
                        color: 'rgba(0,0,0,0.1)',
                        drawTicks: false,
                        drawBorder: true
                    },
                    ticks: {
                        autoSkip: false,
                        stepSize: 1,
                        display: false,
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
                    stackWeight: 3,
                    position: 'left',
                    grid: {
                        drawTicks: false,
                        drawBorder: true
                    },
                    ticks: {
                        autoSkip: false,
                        stepSize: 1,
                        display: false,
                    },

                },
                x: {
                    border: {
                        display: true,
                    },
                    position: 'top',
                    afterFit: (axis) => {
                        axis.width = 15;
                    },
                    grid: {
                        z: 2, 
                        tickLength: 17,
                        drawTicks: true,
                        color: 'rgb(48,128,208)',
                        drawBorder: true
                    },
                    ticks: {
                        padding: -14, 
                        z: 1, 
                        min: 0, 
                        max: xLables.length - 1,
                        autoSkip: false,
                        stepSize: 1,
                        callback: function (value, index, values) {
                            return this.getLabelForValue(value);
                        },

                    },

                },
                y3: {
                    afterFit: (axis) => {
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
            datasets: [
                {
                    display: true,
                    type: 'bar',
                    data: [5],
                    yAxisID: 'yMiddle',
                },
                {
                    type: 'line',
                    pointStyle: false,
                    data: [26],
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
            ]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                autoPadding: false,
                padding: {
                    top: -10,
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
            scales: {
                yBottom: {
                    stack: 'yFixed',
                    stackWeight: 4,
                    position: 'left',
                    min: 0,
                    max: 11,
                    beginAtZero: true,
                    afterFit: (axis) => {
                        axis.paddingTop = 0;
                        axis.width = 55;
                    },
                    grid: {
                        drawTicks: false,
                    },
                    ticks: {
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
                    afterFit: (axis) => {
                        axis.paddingTop = 0;
                        axis.width = 55;
                    },
                    grid: {
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
                            let max = tempMax + 3;
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
                        drawTicks: false,
                    },
                    ticks: {
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
                    afterFit: (axis) => {
                        axis.paddingTop = 0;
                        axis.width = 55;
                    },
                    grid: {
                        drawTicks: false,
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
            }
        }
    });

    function scrollWheel(event, chart) {
        let canvas = document.querySelector('#chart');
        var canvasRect = canvas.getBoundingClientRect();
    }

    var updated = false;
    let scrollXDelta = 0;
    document.querySelector('.columnWide').addEventListener('scroll', (e) => {
        scrolling = true;
        if (initLabelInfo == false) {
            const containerBox = document.querySelector('.columnWide');
            arrLabelInfo[0].source.options.translation[0] = 60;
        }
    });
}

let observers = [];
let prevScroll = 0;
let scrollDirection = -1;
let initStickyPosition = [];
let scrollElem; 
let wholeContainer;

stickySetup = function () { 
    scrollElem = document.querySelector('.columnWide');
    wholeContainer = document.querySelector('.wholeDateContainer');
    wholeContainer.style.visibility = 'visible';

    scrollElem.onscroll = function (e) {
        if (prevScroll > e.target.scrollLeft) {
            scrollDirection = -1;
        } else {
            scrollDirection = 1;
        }
        prevScroll = e.target.scrollLeft;
    }

    function intersectionCallback(entries) {
        entries.forEach((entry) => {
            let elem = entry.target;
            let i = (+elem.getAttribute("class").match(/\d+/)[0]) - 1;

            if (entry.isIntersecting) { 
                if (entry.intersectionRatio < 0.5) {
                    if ((scrollDirection == 1) && ((initStickyPosition[i] == false))) {
                        elem.querySelector('.sticky-label').style.left = "0";
                        elem.querySelector('.sticky-label').style.right = "";
                    } else if ((scrollDirection == -1) || (initStickyPosition[i] == true)) {
                        elem.querySelector('.sticky-label').style.left = "";
                        elem.querySelector('.sticky-label').style.right = "0";
                    }
                } else {
                    if (scrollDirection == 1) {
                        elem.querySelector('.sticky-label').style.left = "0";
                        elem.querySelector('.sticky-label').style.right = "";
                    } else {
                        elem.querySelector('.sticky-label').style.left = "";
                        elem.querySelector('.sticky-label').style.right = "0";
                    }
                }
            } else {
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