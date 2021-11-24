import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

// Available Accounts
// ==================
// (0) 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 (100 ETH)
// (1) 0xf17f52151EbEF6C7334FAD080c5704D77216b732 (100 ETH)
// (2) 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef (100 ETH)
// (3) 0x821aEa9a577a9b44299B9c15c88cf3087F3b5544 (100 ETH)
// (4) 0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2 (100 ETH)
// (5) 0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e (100 ETH)
// (6) 0x2191eF87E392377ec08E7c08Eb105Ef5448eCED5 (100 ETH)
// (7) 0x0F4F2Ac550A1b4e2280d04c21cEa7EBD822934b5 (100 ETH)
// (8) 0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc (100 ETH)
// (9) 0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE (100 ETH)

// Private Keys
// ==================
// (0) 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
// (1) 0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
// (2) 0x0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1
// (3) 0xc88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c
// (4) 0x388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418
// (5) 0x659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63
// (6) 0x82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8
// (7) 0xaa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7
// (8) 0x0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4
// (9) 0x8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5

let accounts = [];

export default class Contract {

    constructor(network, callback) {
        let config = Config[network];
        // this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
            accts.forEach((a) => {
                this.web3.eth.getBalance(a).then((weiBalance) => {
                    let ethBalance = this.web3.utils.fromWei(`${weiBalance}`, "ether");
                    console.log(`${a}: ${ethBalance}`);
                });
            });

            this.owner = accts[0];

            accounts = accts;
            let counter = 1;

            while (this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
                // console.log(accts[counter - 1]);
            }

            while (this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            let self = this;

            self.flightSuretyApp.events.OracleRegistered((error, result) => {
                if (error) {
                    console.log(`App.OracleRegistered.error: ${error}`);
                }
                else {
                    // console.log(`App.OracleRegistered.result: ${JSON.stringify(result, null, 2)}`);
                    // console.log(`App.OracleRegistered.result: ${result.returnValues.oracle}`);
                }
            });

            self.flightSuretyApp.events.AirlineRegistered((error, result) => {
                if (error) {
                    console.log(`App.AirlineRegistered error: ${error}`);
                }
                else {
                    console.log(`App.AirlineRegistered: ${JSON.stringify(result, null, 2)}`);
                }
            });

            self.flightSuretyApp.events.FlightRegistered((error, result) => {
                if (error) {
                    console.log(`App.FlightRegistered error: ${error}`);
                }
                else {
                    console.log(`App.FlightRegistered: ${JSON.stringify(result, null, 2)}`);
                }
            });

            // self.flightSuretyApp.events.OracleRequest((error, result) => {
            //     if (error) {
            //         console.log(`App.OracleRequest.error: ${error}`);
            //     }
            //     else {
            //         console.log(result);
            //         console.log(`App.OracleRequest.result: ${JSON.stringify(result, null, 2)}`);
            //     }
            // });

            self.flightSuretyApp.events.OracleReport((error, result) => {
                if (error) {
                    console.log(`App.OracleReport.error: ${error}`);
                }
                else {
                    console.log(result);
                    console.log(`App.OracleReport.result: ${JSON.stringify(result, null, 2)}`);
                }
            });

            self.flightSuretyApp.events.FlightStatusInfo((error, result) => {
                if (error) {
                    console.log(`App.FlightStatusInfo.error: ${error}`);
                }
                else {
                    console.log(result);
                    console.log(`App.FlightStatusInfo.result: ${JSON.stringify(result, null, 2)}`);
                }
            });

            let one_eth = self.web3.utils.toWei("1", "ether");
            for (let ii = 0; ii < accounts.length; ii++) {
                self.flightSuretyApp.methods.registerOracle().send({ from: accounts[ii], value: one_eth, gas: 5000000 }, (error, result) => {
                    if (error) {
                        console.log(`registerOracle ${ii} error: ${error}`);
                    }
                    else {
                        console.log(`registering oracle ${ii}: ${accounts[ii]}`);
                    }
                });
            }

            callback();
        });
    }

    async isOperational(callback) {
        let self = this;
        return await self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner }, (error, result) => {
                callback(error, payload);
            });
    }

    registerAirline(airline) {
        let airlineAddress = airline;
        if (!this.web3.utils.isAddress(airlineAddress)) {
            console.log(`not a valid address: ${airlineAddress}`);
            return;
        }

        console.log(`this.owner: ${this.owner}`);

        this.flightSuretyApp.methods.registerAirline(airlineAddress).send({ from: this.owner }, (error, result) => {
            if (error) {
                console.log(`registerAirline error: ${error}`);
                alert(error.message.split(":").pop().replace('revert', ''));
            }
            else {
                console.log(`registerAirline result: ${result}`);
            }
        });
    }

    registerFlight(airline, flightNumber) {
        if (!this.web3.utils.isAddress(airline)) {
            console.log(`not a valid address: ${airline}`);
            return;
        }

        this.flightSuretyApp.methods.registerFlight(flightNumber).send({ from: airline, gas: 5000000 }, (error, result) => {
            if (error) {
                console.log(`registerFlight error: ${error}`);
                alert(error.message.split(":").pop().replace('revert', ''));
            }
            else {
                console.log(`registerFlight result: ${result}`);
            }
        });
    }
}











