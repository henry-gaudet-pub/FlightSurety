import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';

(async () => {
    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error, result);
            display('Operational Status', 'Check if contract is operational', [{ label: 'Operational Status', error: error, value: result }]);
        });

        DOM.elid('register-airline').addEventListener('click', () => {
            let airlineName = DOM.elid('airline-name').value;
            console.log(`Registering airline: ${airlineName}`);
            contract.registerAirline(airlineName);
        });
        // display('Airlines', 'List of registered airlines', [{ label: 'Airlines', error: error, value: result }]);

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            console.log(`fetchFlightStatus`);
            contract.fetchFlightStatus(flight, (error, result) => {
                let date = new Date(result.timestamp);
                display('Oracles', 'Trigger oracles',
                    [{
                        label: `Flight ${result.flight}`,
                        error: error,
                        value: {
                            airline: result.airline,
                            arrivalTime: new Date(result.timestamp)
                        }
                    }]);
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
        let row = section.appendChild(DOM.div({ className: 'row' }));
        row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
        row.appendChild(
            DOM.div({
                className: 'col-sm-8 field-value'
            },
                result.error ? String(result.error)
                    : `${result.value.airline}\nArrival Time: ${result.value.arrivalTime}`)
        );
        section.appendChild(row);
    })
    displayDiv.append(section);
}
