pragma solidity ^0.4.25;

interface IFlightSuretyData {
    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
     * @dev Get operating status of contract
     *
     * @return A bool that is the current operating status
     */
    function isOperational() external view returns (bool);

    /**
     * @dev Sets contract operations on/off
     *
     * When operational mode is disabled, all write transactions except for this one will fail
     */
    function pause() external;

    /**
     * @dev Sets contract operations on/off
     *
     * When operational mode is disabled, all write transactions except for this one will fail
     */
    function resume() external;

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     *
     */
    function registerAirline(address airlineToRegister) external;

    /**
     * @dev Check if an airline is registered
     *
     */
    function isRegistered(address airline) external returns (bool);

    /**
     * @dev Buy insurance for a flight
     *
     */
    function buy() external payable;

    /**
     *  @dev Credits payouts to insurees
     */
    function creditInsurees() external pure;

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    function pay() external pure;

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */
    function fund() external payable;
}
