'use strict'

const config = require('./config.json');
const axois = require('axios');

let solarData = {
    "soc": 0.0,
    "powerPv": 0,
    "powerAccu": 0,
    "powerGrid": 0,
    "powerLoad": 0
}

if (!config.fronius || !config.ccu) return console.error(`Keine Konfigurationsdatei gefunden!\nAbbruch!`)

const optionsUrls = {
    optionsUrlPV: {
        method: 'GET',
        url: config.fronius.urls.flowRealtimeData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    },
}

axois.get(config.fronius.urls.flowRealtimeData, optionsUrls)
.then(data => {
    
    let solarDataTmp = data.data.Body;

    solarData.powerAccu = solarDataTmp.Data.Site.P_Akku || 0;
    solarData.powerGrid = solarDataTmp.Data.Site.P_Grid || 0;
    solarData.powerLoad = solarDataTmp.Data.Site.P_Load || 0;
    solarData.powerPv = solarData.Data.Site.P_PV || 0;
    solarData.soc = solarDataTmp.Data.Inverters[1].SOC || 0;

    // console.log(solarData);
})
.then(fetchData => {
    console.log(fetchData);
})
.catch(e => {
    console.error(e)
})