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

const optionsUrls = {
    optionsUrlPV: {
        method: 'GET',
        url: config.fronius.urls.flowRealtimeData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }
}

if (!config) return console.error(`Keine Konfigurationsdatei gefunden!\nAbbruch!`)

axois.get(config.fronius.urls.flowRealtimeData, optionsUrls)
.then(data => {
    console.log(data)
})
.error(e => {
    console.error(e)
})