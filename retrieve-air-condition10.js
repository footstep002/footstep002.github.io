let area;

let colorRangePM25 = [15, 19, 39];
let colorRangePM10 = [30, 49, 69];
let colorRangeO3 = [0.03, 0.059, 0.059];
let colorRangeCO = [2.0, 6.99, 5.99];
let colorRangeNO2 = [0.03, 0.029, 0.089];
let colorRangeSO2 = [0.02, 0.029, 0.099];

let pm25GradeProfile = [0, 16, 36, 76];
let pm10GradeProfile = [0, 31, 81, 151];
let o3GradeProfile = [0, 0.031, 0.091, 0.151];
let coGradeProfile = [0, 2.01, 9.01, 15.01];
let no2GradeProfile = [0, 0.031, 0.061, 0.151];
let so2GradeProfile = [0, 0.021, 0.051, 0.151];

const PM25 = 0;
const PM10 = 1;
const O3 = 2;
const CO = 3;
const NO2 = 4;
const SO2 = 5;

let meterVal = [0, 0, 0, 0, 0];

function getParticulateObj(elemId, srcData) {
    switch (elemId) {
        case 'dust25Chart':
            return srcData.pm25Value;
            break;
        case 'dust10Chart':
            return srcData.pm10Value;
            break;
        case 'o3Chart':
            return srcData.o3Value;
            break;
        case 'coChart':
            return srcData.coValue;
            break;
        case 'no2Chart':
            return srcData.no2Value;
            break;
        case 'so2Chart':
            return srcData.so2Value;
            break;
    }
}

function getColorForGrade(grade) {
    let gradeColorProfile = {
        baseColor: [],
        lighterColor: [],
        lightestColor: [],
        darkerColor: []
    };

    switch (grade) {
        case '2': 
            gradeColorProfile.baseColor = [96, 195, 129];
            gradeColorProfile.lighterColor = [162, 227, 184];
            gradeColorProfile.lightestColor = [236, 249, 240];
            gradeColorProfile.darkerColor = 'lightseagreen';
            break;
        case '3': 
            gradeColorProfile.baseColor = [242, 157, 82];
            gradeColorProfile.lighterColor = [255, 208, 166];
            gradeColorProfile.lightestColor = [253, 248, 244];
            gradeColorProfile.darkerColor = 'coral';
            break;
        case '4': 
            gradeColorProfile.baseColor = [229, 43, 39];
            gradeColorProfile.lighterColor = [248, 121, 118];
            gradeColorProfile.lightestColor = [252, 238, 238];
            gradeColorProfile.darkerColor = 'darkred';
            break;
        case '1': 
        default: 
            gradeColorProfile.baseColor = [0, 165, 232];
            gradeColorProfile.lighterColor = [176, 217, 237];
            gradeColorProfile.lightestColor = [245, 252, 255];
            gradeColorProfile.darkerColor = 'dodgerblue';
    }

    return gradeColorProfile;
}

function gradeValue(pName, srcData) {

    switch (pName) {
        case 'pm25Grade1h':
            for (var i = 1; i <= 3; i++) {
                if ((pm25GradeProfile[i - 1] <= srcData.pm25Value)
                    && (pm25GradeProfile[i] > srcData.pm25Value)) {
                    return i;
                }
            }
            return i;
        case 'pm10Grade1h':
            for (var i = 1; i <= 3; i++) {
                if ((pm10GradeProfile[i - 1] <= srcData.pm10Value)
                    && (pm10GradeProfile[i] > srcData.pm10Value)) {
                    return i;
                }
            }
            return i;
        case 'o3Grade':
            for (var i = 1; i <= 3; i++) {
                if ((o3GradeProfile[i - 1] <= srcData.o3Value)
                    && (o3GradeProfile[i] > srcData.o3Value)) {
                    return i;
                }
            }
            return i;
        case 'coGrade':
            for (var i = 1; i <= 3; i++) {
                if ((coGradeProfile[i - 1] <= srcData.coValue)
                    && (coGradeProfile[i] > srcData.coValue)) {
                    return i;
                }
            }
            return i;
        case 'no2Grade':
            for (var i = 1; i <= 3; i++) {
                if ((no2GradeProfile[i - 1] <= srcData.no2Value)
                    && (no2GradeProfile[i] > srcData.no2Value)) {
                    return i;
                }
            }
            return i;
        case 'so2Grade':
            for (var i = 1; i <= 3; i++) {
                if ((so2GradeProfile[i - 1] <= srcData.so2Value)
                    && (so2GradeProfile[i] > srcData.so2Value)) {
                    return i;
                }
            }
            return i;
        default: return 0;
    }
}

function ACDataItem(name, value, unit) {
    this.name = name; 
    this.value = value; 
    this.unit = unit; 
}

function AirConditionDataUnit() {
    this.baseDate = 'empty-date';
    this.baseTime = 'empty-time';
    this.stationName = '';
    this.stationCode = '';
    this.sidoName = '';
    this.mangName = '';
    this.so2Value = new ACDataItem('아황산가스 농도', '-', 'ppm');
    this.coValue = new ACDataItem('일산화탄소 농도', '-', 'ppm');
    this.o3Value = new ACDataItem('오존 농도', '-', 'ppm');
    this.no2Value = new ACDataItem('이산화질소 농도', '-', 'ppm');
    this.pm10Value = new ACDataItem('미세먼지(PM10) 농도', '-', '㎍/m³');
    this.pm10Value24 = new ACDataItem('미세먼지(PM10) 24시간예측이동농도', '-', '㎍/m³');
    this.pm25Value = new ACDataItem('초미세먼지(PM2.5) 농도', '-', '㎍/m³');
    this.pm25Value24 = new ACDataItem('초미세먼지(PM2.5) 24시간예측이동농도', ' - ', '㎍/m³');
    this.khaiValue = new ACDataItem('통합대기환경수치', '-', '');
    this.khaiGrade = new ACDataItem('통합대기환경지수', '-', '');
    this.so2Grade = new ACDataItem('아황산가스 지수', '-', '');
    this.coGrade = new ACDataItem('일산화탄소 지수', '-', '');
    this.o3Grade = new ACDataItem('오존 지수', '-', '');
    this.no2Grade = new ACDataItem('이산화질소 지수', '-', '');
    this.pm10Grade = new ACDataItem('미세먼지(PM10) 24시간 등급', '-', '');
    this.pm25Grade = new ACDataItem('초미세먼지(PM2.5) 24시간 등급', '-', '');
    this.pm10Grade1h = new ACDataItem('미세먼지(PM10) 1시간 등급', '-', '');
    this.pm25Grade1h = new ACDataItem('초미세먼지(PM2.5) 1시간 등급', '-', '');
    this.so2Flag = new ACDataItem('아황산가스 플래그', '-', '');
    this.coFlag = new ACDataItem('일산화탄소 플래그', '-', '');
    this.o3Flag = new ACDataItem('오존 플래그', '-', '');
    this.no2Flag = new ACDataItem('이산화질소 플래그', '-', '');
    this.pm10Flag = new ACDataItem('미세먼지(PM10) 플래그', '-', '');
    this.pm25Flag = new ACDataItem('초미세먼지(PM2.5) 플래그', '-', '');
}

async function getAirConditionData() {
    area = '정자동';
    let fetchResult = 'UNDEFINED';
    let api_url = await apiUrlGenerator('AIR');

    let response = await fetch(api_url);
    let data = await response.json();

    let realData = data.response.body.items;
    if (realData) {
        fetchResult = 'SUCCESS';
    }
    else
        fetchResult = 'FAILED';

    let res = parseAirConditionData(realData.find(isArea));

    generateCharts(res);
}

function isArea(arr) {
    return arr.stationName == area;
}

function parseAirConditionData(data) {
    let parsedData = new AirConditionDataUnit();

    for (var propName in data) {
        switch (propName) {
            case 'dataTime':
                let dateStr = new Date(data[propName]);
                parsedData.baseDate = dateStr.toDateString();
                parsedData.baseTime = dateStr.toTimeString().slice(0, 8);
                break;
            case 'stationName':
            case 'stationCode':
            case 'sidoName':
            case 'mangName':
                parsedData[propName] = data[propName];
                break;
            default:
                if (data[propName] != null) {
                    parsedData[propName].value = data[propName];
                } else {
                    switch (propName) {
                        case 'pm25Grade1h':
                        case 'pm10Grade1h':
                        case 'o3Grade':
                        case 'coGrade':
                        case 'no2Grade':
                        case 'so2Grade':
                            parsedData[propName].value = gradeValue(propName, data);
                    }
                }
        }
    }

    return parsedData;
}

const colorProfiles = [];
function generateCharts(data) {
    const chartLimits = [75, 150, 0.38, 32, 1.1, 0.6]; 

    const PM25Idx = 0;
    const PM10Idx = 1;
    const O3Idx = 2;
    const COIdx = 3;
    const NO2Idx = 4;
    const SO2Idx = 5;

    const pm25ChartElem = document.querySelector('#dust25Chart');
    const pm10ChartElem = document.querySelector('#dust10Chart');
    const o3ChartElem = document.querySelector('#o3Chart');
    const coChartElem = document.querySelector('#coChart');
    const no2ChartElem = document.querySelector('#no2Chart');
    const so2ChartElem = document.querySelector('#so2Chart');

    colorProfiles.push(getColorForGrade(data.pm25Grade1h.value));
    colorProfiles.push(getColorForGrade(data.pm10Grade1h.value));
    colorProfiles.push(getColorForGrade(data.o3Grade.value));
    colorProfiles.push(getColorForGrade(data.coGrade.value));
    colorProfiles.push(getColorForGrade(data.no2Grade.value));
    colorProfiles.push(getColorForGrade(data.so2Grade.value));

    const drawGaugeBackground = {
        id: 'drawGaugeBackground',
        beforeDraw(chart, args, options) {
            const { ctx } = chart;

            const xCenter = chart.getDatasetMeta(0).data[0].x;
            const yCenter = chart.getDatasetMeta(0).data[0].y;

            const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
            const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
            const radius = ((outerRadius - innerRadius) / 2) + innerRadius;

            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 2;

            ctx.strokeStyle = 'grey';

            ctx.arc(xCenter, yCenter, radius, -205 * (Math.PI / 180), 25 * (Math.PI / 180));
            ctx.clip();

            ctx.fillStyle = `rgba(
                ${colorProfiles[chart.id].lightestColor[0]},
                ${colorProfiles[chart.id].lightestColor[1]},
                ${colorProfiles[chart.id].lightestColor[2]}, 1)`;

            ctx.fillRect(0, 0, chart.width, chart.height);

            ctx.closePath();
            ctx.stroke();

            if ((getParticulateObj(ctx.canvas.id, data).value == '-') || (chart.data.datasets[0].data[0] == 0)) {
                chart.data.datasets[0].data[0] = chartLimits[PM25Idx];
                chart.data.datasets[0].data[1] = 0;
                ctx.shadowColor = 'grey';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.stroke();
            }

            ctx.restore();
        }
    };

    const applyChartShadow = {
        id: 'applyChartShadow',
        afterDatasetDraw(chart, args, plugins) {
            const { ctx } = chart;

            let _fill = ctx.fill;
            ctx.fill = function () {
                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.5)';

                ctx.shadowBlur = 7;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 3;

                _fill.apply(this, arguments);
                ctx.restore();
            }

            let _stroke = ctx.stroke;
            ctx.stroke = function () {
                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.5)';

                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 3;

                _stroke.apply(this, arguments);
                ctx.restore();
            }

        }
    };

    const gaugeFlowMeter = {
        id: 'gaugeFlowMeter',
        beforeDraw(chart, args, plugins) {
            const { ctx } = chart;
            const xCenter = chart.getDatasetMeta(0).data[0].x;
            const yCenter = chart.getDatasetMeta(0).data[0].y;
            const fullCircumference = 4.014257; //4.014257279586958;
            let decimalDigit = 0;
            let valueFontSize = 3.1;
            let unitFontSize = 1.3;
            let yOffset = [3, 20];
            if (chart.id > 1) {
                decimalDigit = 3;
                valueFontSize = 1.2;
                unitFontSize = 0.9;
                yOffset = [3, 9]
            }

            let circumference = ((chart.getDatasetMeta(0).data[0].circumference / fullCircumference) * chartLimits[chart.id]).toFixed(decimalDigit);

            ctx.save();

            ctx.font = `bold ${valueFontSize}em sans-serif`;
            ctx.fillStyle = 'grey';
            ctx.textAlign = 'center';
            if (circumference == 0) { 
                if ((getParticulateObj(ctx.canvas.id, data).value == '-') && (reverseFlags[chart.id] == false)) {
                    circumference = '-';
                } 
            } 

            meterVal[PM25] = circumference;
            ctx.fillText(`${(+circumference).toString()}`, xCenter, yCenter - yOffset[0]);
            ctx.font = `bold ${unitFontSize}em sans-serif`;
            ctx.fillText(`${getParticulateObj(ctx.canvas.id, data).unit}`, xCenter, yCenter + yOffset[1]); 

            ctx.restore();
        }
    };

    const generateData = (ctx, limitIdx) => {
        let obj = getParticulateObj(ctx.canvas.id, data);

        if ((obj.value == '-') || (obj.value == 0)) {
            return [chartLimits[limitIdx], 0];
        } else {
            return [obj.value, chartLimits[limitIdx] - obj.value];
        }
    };

    const getBackgroundColorProfile = (limitIdx) => {
        let primaryColor =
            `rgb(${colorProfiles[limitIdx].baseColor[0]},${colorProfiles[limitIdx].baseColor[1]},${colorProfiles[limitIdx].baseColor[2]})`;
        let secondaryColor =
            `rgb(${colorProfiles[limitIdx].lighterColor[0]},${colorProfiles[limitIdx].lighterColor[1]},${colorProfiles[limitIdx].lighterColor[2]})`;

        return [primaryColor, secondaryColor];
    };

    const getBorderColorProfile = (limitIdx) => {
        let primaryColor = colorProfiles[limitIdx].darkerColor;
        let secondaryColor =
            `rgb(${colorProfiles[limitIdx].lighterColor[0]},${colorProfiles[limitIdx].lighterColor[1]},${colorProfiles[limitIdx].lighterColor[2]})`;

        return [primaryColor, secondaryColor];
    };

    var reverseFlags = [true, true, true, true, true, true];

    var pm25Chart = new Chart(pm25ChartElem, {
        type: 'doughnut',
        data: {
            labels: ['Red'],
            datasets: [{
                label: data.pm25Value.name,
                data:
                    generateData(pm25ChartElem.getContext("2d"), PM25Idx),
                backgroundColor:
                    getBackgroundColorProfile(PM25Idx),
                hoverBackgroundColor:
                    getBackgroundColorProfile(PM25Idx),
                hoverBorderColor:
                    getBorderColorProfile(PM25Idx),
                borderWidth: [2, 0],
                circumference: 230,
                cutout: '85%',
                hoverOffset: 0,
                borderRadius: [
                    {
                        outerStart: 15,
                        outerEnd: 0,
                        innerStart: 15,
                        innerEnd: 0
                    },
                    {
                        outerStart: 0,
                        outerEnd: 15,
                        innerStart: 0,
                        innerEnd: 15
                    }
                ],
            }]
        },
        options: {
            aspectRatio: 1.1,
            events: [],
            layout: {
                padding: { top: 10, left: 20, bottom: 20, right: 20 }
            },
            animation: {
                onComplete(e) {
                    if (data.pm25Value.value == '-') {
                        if (reverseFlags[0] == true) {
                            reverseFlags[0] = false;
                            e.chart.toggleDataVisibility(0);
                            e.chart.update('hide');
                        }
                    } else if (data.pm25Value.value == 0) {
                        if (reverseFlags[0]) {
                            reverseFlags[0] = false;
                            e.chart.data.datasets[0].data = [0, chartLimits[PM25Idx]];
                            e.chart.update();
                        }
                    }
                },
                animateScale: false
            },
            rotation: -115,
            scales: {
            },
            plugins: {
                title: {
                    display: true,
                    text: data.pm25Value.name,
                    position: 'bottom',
                    padding: { top: 10 },
                    font: {
                        size: 20
                    }
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false
                },
            },
        },
        plugins: [drawGaugeBackground, applyChartShadow, gaugeFlowMeter]
    });
    pm25Chart.setActiveElements([{
        datasetIndex: 0,
        index: 0,
    }]);

    var pm10Chart = new Chart(pm10ChartElem, {
        type: 'doughnut',
        data: {
            labels: ['Red'],
            datasets: [{
                label: data.pm10Value.name,
                data:
                    generateData(pm10ChartElem.getContext("2d"), PM10Idx),
                backgroundColor:
                    getBackgroundColorProfile(PM10Idx),
                hoverBackgroundColor:
                    getBackgroundColorProfile(PM10Idx),
                hoverBorderColor:
                    getBorderColorProfile(PM10Idx),
                borderWidth: [2, 0],
                circumference: 230,
                cutout: '85%',
                hoverOffset: 0,
                borderRadius: [
                    {
                        outerStart: 15,
                        outerEnd: 0,
                        innerStart: 15,
                        innerEnd: 0
                    },
                    {
                        outerStart: 0,
                        outerEnd: 15,
                        innerStart: 0,
                        innerEnd: 15
                    }
                ],
            }]
        },
        options: {
            aspectRatio: 1.1,
            events: [],
            layout: {
                padding: { top: 10, left: 20, bottom: 20, right: 20 }
            },
            animation: {
                onComplete(e) {
                    if (data.pm10Value.value == '-') {
                        if (reverseFlags[1] == true) {
                            reverseFlags[1] = false;
                            e.chart.toggleDataVisibility(0);
                            e.chart.update('hide');
                        }
                    } else if (data.pm10Value.value == 0) {
                        if (reverseFlags[1]) {
                            reverseFlags[1] = false;
                            e.chart.data.datasets[0].data = [0, chartLimits[PM10Idx]];
                            e.chart.update();
                        }
                    }
                },
                animateScale: false
            },
            rotation: -115,
            scales: {
            },
            plugins: {
                title: {
                    display: true,
                    text: data.pm10Value.name,
                    position: 'bottom',
                    padding: { top: 10 },
                    font: {
                        size: 20
                    }
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false
                },
            },
        },
        plugins: [drawGaugeBackground, applyChartShadow, gaugeFlowMeter]
    });
    pm10Chart.setActiveElements([{
        datasetIndex: 0,
        index: 0,
    }]);

    var o3Chart = new Chart(o3ChartElem, {
        type: 'doughnut',
        data: {
            labels: ['Red'],
            datasets: [{
                label: data.o3Value.name,
                data:
                    generateData(o3ChartElem.getContext("2d"), O3Idx),
                backgroundColor:
                    getBackgroundColorProfile(O3Idx),
                hoverBackgroundColor:
                    getBackgroundColorProfile(O3Idx),
                hoverBorderColor:
                    getBorderColorProfile(O3Idx),
                borderWidth: [2, 0],
                circumference: 230,
                cutout: '85%',
                hoverOffset: 0,
                borderRadius: [
                    {
                        outerStart: 15,
                        outerEnd: 0,
                        innerStart: 15,
                        innerEnd: 0
                    },
                    {
                        outerStart: 0,
                        outerEnd: 15,
                        innerStart: 0,
                        innerEnd: 15
                    }
                ],
            }]
        },
        options: {
            aspectRatio: 1.1,
            events: [],
            layout: {
                padding: 10
            },
            animation: {
                onComplete(e) {
                    if (data.o3Value.value == '-') {
                        if (reverseFlags[2] == true) {
                            reverseFlags[2] = false;
                            e.chart.toggleDataVisibility(0); 
                            e.chart.update('hide');
                        }
                    } else if (data.o3Value.value == 0) {
                        if (reverseFlags[2]) {
                            reverseFlags[2] = false;
                            e.chart.data.datasets[0].data = [0, chartLimits[O3Idx]]; 
                            e.chart.update();
                        }
                    }
                },
                animateScale: false
            },
            rotation: -115,
            scales: {
            },
            plugins: {
                title: {
                    display: true,
                    text: data.o3Value.name,
                    position: 'bottom',
                    padding: { top: 1, bottom: -5 },
                    font: {
                        size: 14
                    }
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false
                },
            },
        },
        plugins: [drawGaugeBackground, applyChartShadow, gaugeFlowMeter]
    });
    o3Chart.setActiveElements([{
        datasetIndex: 0,
        index: 0,
    }]);

    var coChart = new Chart(coChartElem, {
        type: 'doughnut',
        data: {
            labels: ['Red'],
            datasets: [{
                label: data.coValue.name,
                data:
                    generateData(coChartElem.getContext("2d"), COIdx),
                backgroundColor:
                    getBackgroundColorProfile(COIdx),
                hoverBackgroundColor:
                    getBackgroundColorProfile(COIdx),
                hoverBorderColor:
                    getBorderColorProfile(COIdx),
                borderWidth: [2, 0],
                circumference: 230,
                cutout: '85%',
                hoverOffset: 0,
                borderRadius: [
                    {
                        outerStart: 15,
                        outerEnd: 0,
                        innerStart: 15,
                        innerEnd: 0
                    },
                    {
                        outerStart: 0,
                        outerEnd: 15,
                        innerStart: 0,
                        innerEnd: 15
                    }
                ],
            }]
        },
        options: {
            aspectRatio: 1.1,
            events: [],
            layout: {
                padding: 10
            },
            animation: {
                onComplete(e) {
                    if (data.coValue.value == '-') {
                        if (reverseFlags[3] == true) {
                            reverseFlags[3] = false;
                            e.chart.toggleDataVisibility(0);
                            e.chart.update('hide');
                        }
                    } else if (data.coValue.value == 0) {
                        if (reverseFlags[3]) {
                            reverseFlags[3] = false;
                            e.chart.data.datasets[0].data = [0, chartLimits[COIdx]];
                            e.chart.update();
                        }
                    }
                },
                animateScale: false
            },
            rotation: -115,
            scales: {
            },
            plugins: {
                title: {
                    display: true,
                    text: data.coValue.name,
                    position: 'bottom',
                    padding: { top: 1, bottom: -5 },
                    font: {
                        size: 14
                    }
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false
                },
            },
        },
        plugins: [drawGaugeBackground, applyChartShadow, gaugeFlowMeter]
    });
    coChart.setActiveElements([{
        datasetIndex: 0,
        index: 0,
    }]);

    var no2Chart = new Chart(no2ChartElem, {
        type: 'doughnut',
        data: {
            labels: ['Red'],
            datasets: [{
                label: data.no2Value.name,
                data:
                    generateData(no2ChartElem.getContext("2d"), NO2Idx),
                backgroundColor:
                    getBackgroundColorProfile(NO2Idx),
                hoverBackgroundColor:
                    getBackgroundColorProfile(NO2Idx),
                hoverBorderColor:
                    getBorderColorProfile(NO2Idx),
                borderWidth: [2, 0],
                circumference: 230,
                cutout: '85%',
                hoverOffset: 0,
                borderRadius: [
                    {
                        outerStart: 15,
                        outerEnd: 0,
                        innerStart: 15,
                        innerEnd: 0
                    },
                    {
                        outerStart: 0,
                        outerEnd: 15,
                        innerStart: 0,
                        innerEnd: 15
                    }
                ],
            }]
        },
        options: {
            aspectRatio: 1.1,
            events: [],
            layout: {
                padding: 10 
            },
            animation: {
                onComplete(e) {
                    if (data.no2Value.value == '-') {
                        if (reverseFlags[4] == true) {
                            reverseFlags[4] = false;
                            e.chart.toggleDataVisibility(0); 
                            e.chart.update('hide');
                        }
                    } else if (data.no2Value.value == 0) {
                        if (reverseFlags[4]) {
                            reverseFlags[4] = false;
                            e.chart.data.datasets[0].data = [0, chartLimits[NO2Idx]]; 
                            e.chart.update();
                        }
                    }
                },
                animateScale: false
            },
            rotation: -115,
            scales: {
            },
            plugins: {
                title: {
                    display: true,
                    text: data.no2Value.name,
                    position: 'bottom',
                    padding: { top: 1, bottom: -5 },
                    font: {
                        size: 14
                    }
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false
                },
            },
        },
        plugins: [drawGaugeBackground, applyChartShadow, gaugeFlowMeter]
    });
    no2Chart.setActiveElements([{
        datasetIndex: 0,
        index: 0,
    }]);

    var so2Chart = new Chart(so2ChartElem, {
        type: 'doughnut',
        data: {
            labels: ['Red'],
            datasets: [{
                label: data.so2Value.name,
                data:
                    generateData(so2ChartElem.getContext("2d"), SO2Idx),
                backgroundColor:
                    getBackgroundColorProfile(SO2Idx),
                hoverBackgroundColor:
                    getBackgroundColorProfile(SO2Idx),
                hoverBorderColor:
                    getBorderColorProfile(SO2Idx),
                borderWidth: [2, 0],
                circumference: 230,
                cutout: '85%',
                hoverOffset: 0,
                borderRadius: [
                    {
                        outerStart: 15,
                        outerEnd: 0,
                        innerStart: 15,
                        innerEnd: 0
                    },
                    {
                        outerStart: 0,
                        outerEnd: 15,
                        innerStart: 0,
                        innerEnd: 15
                    }
                ],
            }]
        },
        options: {
            aspectRatio: 1.1,
            events: [],
            layout: {
                padding: 10 
            },
            animation: {
                onComplete(e) {
                    if (data.so2Value.value == '-') {
                        if (reverseFlags[5] == true) {
                            reverseFlags[5] = false;
                            e.chart.toggleDataVisibility(0); 
                            e.chart.update('hide');
                        }
                    } else if (data.so2Value.value == 0) {
                        if (reverseFlags[5]) {
                            reverseFlags[5] = false;
                            e.chart.data.datasets[0].data = [0, chartLimits[SO2Idx]];
                            e.chart.update();
                        }
                    }
                },
                animateScale: false
            },
            rotation: -115,
            scales: {
            },
            plugins: {
                title: {
                    display: true,
                    text: data.so2Value.name,
                    position: 'bottom',
                    padding: { top: 1, bottom: -5 },
                    font: {
                        size: 14
                    }
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false
                },
            },
        },
        plugins: [drawGaugeBackground, applyChartShadow, gaugeFlowMeter]
    });
    so2Chart.setActiveElements([{
        datasetIndex: 0,
        index: 0,
    }]);
}

window.addEventListener(
    "load",
    (event) => {
        getAirConditionData();
    },
    false,
);