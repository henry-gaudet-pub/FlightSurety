import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

// { flight: airline }
let flightMap = { asdf: "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef" };

flightSuretyApp.events.OracleRequest({
    fromBlock: 0
}, function (error, event) {
    if (error) {
        console.log(error);
    }
    else {
        web3.eth.getAccounts((error, accts) => {
            // console.log(`accts: ${accts}`);
            web3.eth.defaultAccount = accts[event.returnValues.index];
        }).then((error, result) => {
            // console.log(`result: ${result}`);
            console.log(`defaultAccount: ${web3.eth.defaultAccount}`);
            flightSuretyApp.methods.getMyIndexes().send().then((error, result) => {

            })
            flightSuretyApp.methods.submitOracleResponse(
                event.returnValues.index,
                flightMap[event.returnValues.flight],
                event.returnValues.flight,
                Math.floor(Date.now() / 1000),
                10
            ).send({from: web3.eth.defaultAccount}, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                }
            }).catch(console.log);
        }).catch(console.log);
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
    }
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
        message: 'An API for use with your Dapp!'
    })
})

export default app;


