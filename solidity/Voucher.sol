/**
 * @title Voucher is a smart contract to issue vouchers. 
 *
 * @author Javier Moreno Molina <javier.moreno.molina@bbva.com>
 */

import "./ContractParty.sol";

contract Voucher
{
    /** @dev State definitions:
     *    created: the contract is active but attestation is pending
     *    ready: attestation is done and the user can claim the voucher
     *    cleared: the user has claimed the voucher
     */
    enum State { created, ready, cleared }
    
    /// @dev State of the Contract
    State public voucherState;
    
    uint public validityStart;
    uint public validityLife;

    uint public duration;

    address public beneficiary;
    address public device;

    event VoucherEvent(address _voucherAddress, State newState);

    modifier onlyParty(address _address)
    {
       if(msg.sender!=_address) throw;
       _
    }
    
    modifier onlyState(State _state)
    {
        if(voucherState != _state) throw;
        _
    }

    modifier onlyDueTime()
    {
        if(now < validityLife) throw;
	_
    }
    
    function Voucher(address _beneficiary, address _device, uint _duration, uint conditionOperator, uint conditionValue)
    {
	beneficiary = _beneficiary;
	device = _device;
	duration = _duration;
	validityStart = now;
        voucherState = created;
	validityLife = validityStart + duration * 1 days;
    }
    
    /**
     * @dev Attest the feature to the contract
     * @param _id The  of the contract party
     */
    function attest(uint _drops) public
      onlyState(State.created)
      onlyDueTime()
      onlyParty(device)
    {
      contractState = State.ready;

    }

    /**
     * @dev Sign the contract 
     */
    function signContract() public
      onlyParty()
      onlyState(baseState.inactive)

    {
      parties[uint(getPartyIndex(msg.sender))].hasSigned();
      signatureCount++;
      evalState();
    }
    
    /**
     * @dev Evaluates the internal state machine of the contract and triggers
     * transitions if that is the case.
     */ 
    function evalState() internal
    {
        if(contractState == baseState.incomplete)
        {
            if(partiesCount == totalParties) contractState = baseState.inactive;
        } 
        if(contractState == baseState.inactive)
        {
            if(signatureCount == totalParties){
              contractState = baseState.locked;
	            activateContract();
	          }
        }
    }

    /**
     * @dev Internal function that changes the internal state, makes all 
     * commitments effective and sets the starting date.
     */
    function activateContract() internal
      onlyState(baseState.locked)
    {
      validityStart = now;
      contractState = baseState.active;
    }
}

