import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

// { flight: airline }
let flightMap = { asdf: "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef" };
let accounts = [];
let oracles = {};

flightSuretyApp.events.OracleRegistered((error, result) => {
    if (error) {
        console.log(`OracleRegistered.error: ${error}`);
    }
    else {
        // console.log(`App.OracleRegistered.result: ${JSON.stringify(result, null, 2)}`);
        oracles[result.returnValues.oracle] = result.returnValues.indexes;
    }
});

// flightSuretyApp.events.KeyGenerated((error, result) => {
//     if (error) {
//         console.log(`KeyGenerated.error: ${error}`);
//     }
//     else {
//         console.log(`KeyGenerated.result: ${JSON.stringify(result, null, 2)}`);
//     }
// });

flightSuretyApp.events.OracleRequest({
    fromBlock: 0
}, function (error, event) {
    if (error) {
        console.log(`OracleRequest error: ${error}`);
    }
    else {
        let requestedIndex = event.returnValues.index;
        console.log(`index: ${requestedIndex}`);

        Object.entries(oracles).forEach((oracleEntry) => {
            let oracleAddress = oracleEntry[0];
            let oracleIndices = oracleEntry[1];
            flightSuretyApp.methods.getMyIndexes().call({ from: oracleAddress }, (error, result) => {
                if (error) {
                    console.log(`getMyIndexes error: ${error}`);
                }

                if (result.includes(requestedIndex)) {
                    console.log(`  using oracle ${oracleAddress} with`);
                    console.log(`    indices: ${oracleIndices}`);
                    console.log(`    requestedIndex: ${requestedIndex}`);
                    console.log(`    airline: ${event.returnValues.airline}`);
                    console.log(`    flight ${event.returnValues.flight}`);
                    console.log(`    timestamp ${event.returnValues.timestamp}`);
                    flightSuretyApp.methods.submitOracleResponse(
                                            requestedIndex,
                                            event.returnValues.airline,
                                            event.returnValues.flight,
                                            event.returnValues.timestamp,
                                            10
                                        ).send({ from: oracleAddress }, (error, result) => {
                                            if (error) {
                                                console.log(`submitOracleResponse error: ${error}`);
                                            }
                                            else {
                                                console.log(`submitOracleResponse result: ${result}`);
                                            }
                                        });
                }
            });
        });

        //         for (let ii = 0; ii < result.length; ii++) {
        //             if (result[ii] === requestedIndex) {
        //                 console.log(`  requested index ${requestedIndex} matches for address ${oracleAddress}`);
        //                 flightSuretyApp.methods.submitOracleResponse(
        //                     requestedIndex,
        //                     flightMap[event.returnValues.flight],
        //                     event.returnValues.flight,
        //                     event.returnValues.timestamp,
        //                     10
        //                 ).send({ from: oracleAddress }, (error, result) => {
        //                     if (error) {
        //                         console.log(`submitOracleResponse error: ${error}`);
        //                     }
        //                     else {
        //                         console.log(`submitOracleResponse result: ${result}`);
        //                     }
        //                 });
        //                 oracleFound = true;
        //                 break;
        //         }
        //     }
        // });
        //     console.log("=====================");
        //     if (oracleFound) break;
        // }
    }
});

// web3.eth.getAccounts((error, accts) => {
// accounts = accts;
// web3.eth.defaultAccount = accts[event.returnValues.index];
// console.log(`accts: ${accounts}`);
// console.log(`event.returnValues.index: ${event.returnValues.index}`);
// }).then((error, result) => {
// console.log(`result: ${result}`);
// console.log(`defaultAccount: ${web3.eth.defaultAccount}`);
// flightSuretyApp.methods.getMyIndexes().call({from: web3.eth.defaultAccount}, (error, result) => {
//     if (error) {
//         console.log(`getMyIndexes error: ${error}`);
//     }
//     console.log(`getMyIndexes result: ${result}`);

//     console.log(`getMyIndexes result: ${Object.getOwnPropertyNames(result)}`);
//     for (let ii = 0; ii < result.length; ii++) {
//         if (result[ii] === )
//     }

// })
// flightSuretyApp.methods.submitOracleResponse(
//     event.returnValues.index,
//     flightMap[event.returnValues.flight],
//     event.returnValues.flight,
//     Math.floor(Date.now() / 1000),
//     10
// ).send({from: web3.eth.defaultAccount}, (error, result) => {
//     if (error) {
//         console.log(error);
//     }
//     else {
//         console.log(result);
//     }
// }).catch(console.log);
// }).catch(console.log);
// console.log(`flightMap["asdf"]: ${flightMap["asdf"]}`);
// console.log(`event.returnValues.flight: ${event.returnValues.flight}`);
// console.log(`flightMap[event.returnValues.flight]: ${flightMap[event.returnValues.flight]}`);
/// console.log(event);
// flightSuretyApp.methods.submitOracleResponse(
//     event.returnValues.index,
//     flightMap[event.returnValues.flight],
//     event.returnValues.flight,
//     Math.floor(Date.now() / 1000),
//     10
// ).send({ from: web3.eth.accounts[0] }, (error, result) => {
//     if (error) {
//         console.log(error);
//     }
//     else {
//         console.log(result);
//     }
// });
//     }
// });

const app = express();
app.get('/api', (req, res) => {
    res.send({
        message: 'An API for use with your Dapp!'
    })
})

export default app;


