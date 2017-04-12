/**
 * @title ContractParty contains the address acting as contract party and 
 * whether it has signed the contract or not. A contract party should be owned 
 * by the contract itself, so that only the contract can change the signed 
 * state.
 * @author Javier Moreno Molina <javier.moreno.molina@bbva.com>
 */

contract ContractParty
{
    /// @dev The contract party id (address)
    address public partyAddress;

    /// @dev True if contract party has signed the contract, false otherwise
    bool public signed;

    /// @dev The corresponding contract, the only allowed to change its state
    address owner;

    modifier onlyOwner()
    {
        if(msg.sender!=owner) throw;
        _
    }

    /** 
     * @dev Creates a participant in a contract
     * @param lp Legal person becoming contract party
     */   
    function ContractParty(LegalPerson lp)
    {
        legalPerson = lp;
        signed = false;
	owner = msg.sender;
    }

    /**
     * @dev The contract party has signed the contract
     */
    function hasSigned()
        onlyOwner()
    {
        signed = true;
    }
}
