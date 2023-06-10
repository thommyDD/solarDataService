'use strict'

import config from './config.json' assert {type: 'json'};
import axois from 'axios';

let solarData = {
    "soc": 0.0,
    "powerPv": 0,
    "powerAccu": 0,
    "powerGrid": 0,
    "powerLoad": 0
}

async function main() {
    
    if (!config.fronius || !config.ccu) return console.error(`Keine Konfigurationsdatei gefunden oder Konfiguration unvollständig!\nAbbruch!`)

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

    console.log("Start zyklische Abfrage der Solardaten");

    let getSolarData = async() => {

        await axois.get(config.fronius.urls.flowRealtimeData, optionsUrls)
        .then(data => {
            
            let solarDataTmp = data.data.Body;

            solarData.powerAccu = solarDataTmp.Data.Site.P_Akku || 0;
            solarData.powerGrid = solarDataTmp.Data.Site.P_Grid || 0;
            solarData.powerLoad = solarDataTmp.Data.Site.P_Load || 0;
            solarData.powerPv = solarDataTmp.Data.Site.P_PV || 0;
            solarData.soc = solarDataTmp.Data.Inverters[1].SOC || 0;

            // console.log(solarData);
        })
        .then(fetchData => {

            const url = `http://${config.ccu.ip}:${config.ccu.port}/sysvar/${config.ccu.sysvars['SoC PV-Speicher']}/~pv`;

            axois.put(url, {"v": solarData.soc})
            .then(() => {
                console.log(`${new Date().toLocaleString()} Daten an die CCU übermittelt`);
            })
            .catch(e => console.error(`Es ist ein Fehler bei der Übertragung zur CCU aufgetreten: ${e}`));
        })
        .catch(e => {
            console.error(`Es ist ein Fehler bei Abfrage der Solardaten aufgetreten: ${e}`);
    })


    }

    setInterval(async() => { await getSolarData() }, config.requestIntervall * 1_000);
}

await main();