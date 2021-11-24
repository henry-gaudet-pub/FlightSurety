import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';

(async () => {
    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            // console.log(error, result);
            if (error) {
                console.log(`isOperational error: ${error}`);
            }
            console.log(`isOperational: ${result}`)
            display('Operational Status', 'Check if contract is operational', [{ label: 'Operational Status', error: error, value: (result ? "Operational" : "Not Operational") }]);
        });

        DOM.elid('register-airline').addEventListener('click', () => {
            let airlineName = DOM.elid('airline-name').value;
            console.log(`Registering airline: ${airlineName}`);
            contract.registerAirline(airlineName);
        });

        DOM.elid('register-flight').addEventListener('click', () => {
            let airlineName = DOM.elid('airline-for-flight').value;
            let flightNumber = DOM.elid('flight-number').value;
            console.log(`Registering flight: ${flightNumber} on airline: ${airlineName}`);
            contract.registerFlight(airlineName, flightNumber);
        });

        DOM.elid('buy-insurance').addEventListener('click', () => {
            let flightNumber = DOM.elid('insurance-flight-number').value;
            let insurancePrice = DOM.elid('insurance-price').value;
            contract.registerFlight(airlineName, flightNumber);
        });

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            console.log(`fetchFlightStatus`);
            contract.fetchFlightStatus(flight, (error, result) => {
                console.log(`fetchFlightStatus result: ${JSON.stringify(result, null, 2)}`);
                // let date = new Date(result.timestamp);
                // display('Oracles', 'Trigger oracles',
                //     [{
                //         label: `Flight ${result.flight}`,
                //         error: error,
                //         value: {
                //             airline: result.airline,
                //             arrivalTime: new Date(result.timestamp)
                //         }
                //     }]);
            });
        })

    });

})();

function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}

// function display(title, description, results) {
//     let displayDiv = DOM.elid("display-wrapper");
//     let section = DOM.section();
//     section.appendChild(DOM.h2(title));
//     section.appendChild(DOM.h5(description));
//     results.map((result) => {
//         let row = section.appendChild(DOM.div({ className: 'row' }));
//         row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
//         row.appendChild(
//             DOM.div({
//                 className: 'col-sm-8 field-value'
//             },
//                 result.error ? String(result.error)
//                     : `${result.value.airline}\nArrival Time: ${result.value.arrivalTime}`)
//         );
//         section.appendChild(row);
//     })
//     displayDiv.append(section);
// }
