/**
 * @title Voucher is a smart contract to issue vouchers. 
 *
 * @author Javier Moreno Molina <javier.moreno.molina@bbva.com>
 */
pragma solidity ^0.4.10;

contract BaseContract
{ 
  /// @dev owner is the account that payed for the instantiation
  address owner;

  /// @dev Timestamp at contract instantiation
  uint public validityStart;
  /// @dev Every contract must have a maturity date
  uint public validityLife; 

  modifier onlyOwner()
  {
    if( msg.sender!= owner) throw;
    _;
  }


  /** @dev BaseContract constructor
   *  @param duration validity interval in seconds
   *  @notice Every contract must have an owner, who is the entity that payed
   *  for the instantiation, and a maturity date or explicit validity 
   *  interval.
   */
  function BaseContract(uint duration) 
  {
    owner = tx.origin;
    validityStart = now;
    validityLife = validityStart + duration;
  }
    
  /**
   * @dev Destructor function that removes the contract and sends remaining 
   * funds to the owner.
   */
  function destroyContract()
    onlyOwner()
  {
    selfdestruct(owner);
  }
}


contract Voucher is BaseContract
{
  /** @dev State definitions:
   *    created: the contract is active but attestation is pending 
   *    ready: attestation is done and the user can claim the voucher
   *    cleared: the user has claimed the voucher
   */
  enum State { created, ready, issued, failed }
  string [4] stateName = [ "created", "ready", "issued", "failed" ];
    
  /// @dev State of the Contract
  State public voucherState;
   
  /// @dev Duration of the voucher calculation interval in days
  uint public duration;

  /** @dev beneficiary is the user that signed the contract and will receive 
   *  the voucher
   */
  address public beneficiary;

  /// @dev device that will attest its data to the contract
  address public device;

  /// @dev a standardized event to throw at every transaction execution
  event VoucherEvent(uint timestamp, string method, string newState, string message);

  enum Operator { less, greater, equal }

  struct Condition {
    Operator operator;
    uint value;
  }

  Condition condition;
 
  uint public attestedValue;

  modifier onlyParty(address _address)
  {
    if(msg.sender!=_address) throw;
    _;
  }
    
  modifier onlyState(State _state)
  {
    if(voucherState != _state) throw;
    _;
  }

  modifier onlyDueTime()
  {
    if(now < validityLife) throw;
    _;
  }
    
  function Voucher(address _beneficiary, address _device, uint _duration, uint _conditionOperator, uint _conditionValue) 
    BaseContract (_duration * 1 days)
  {
    beneficiary = _beneficiary;
    device = _device;
    duration = _duration;
    condition.operator = Operator(_conditionOperator);
    condition.value = _conditionValue;
    VoucherEvent(now, "Voucher", stateName[uint(voucherState)], "constructor");
  }
    
  /**
   * @dev Attest the feature to the contract
   * @param _data The attested data
   */
  function attest(uint _data) public
    onlyState(State.created)
    onlyDueTime()
    onlyParty(device)
  { 
    attestedValue = _data;
    voucherState = State.ready;
    VoucherEvent(now, "attest", stateName[uint(voucherState)], "Attested");
  }

  /**
   * @dev Claim the reward to the contract
   * @return true in case of success or false otherwise
   */
  function claim() public
    onlyState(State.ready)
    onlyParty(beneficiary)
    returns (bool)
  {
    if(condition.operator==Operator.less)
    {
      if(attestedValue < condition.value)
      {
        voucherState = State.issued;
        VoucherEvent(now, "claim", stateName[uint(voucherState)], "Issued");
	return true;
      }
    } else if (condition.operator==Operator.greater) 
    {  
      if(attestedValue > condition.value)
      {
	voucherState = State.issued;
        VoucherEvent(now, "claim", stateName[uint(voucherState)], "Issued");
        return true;
      }
    } else if (condition.operator==Operator.equal)
    {
      if(attestedValue == condition.value)
      {
	voucherState = State.issued;
        VoucherEvent(now, "claim", stateName[uint(voucherState)], "Issued");
	return true;    
      }
    } else 
    {
      voucherState = State.failed;
      VoucherEvent(now, "claim", stateName[uint(voucherState)], "Failed");
    }
  }
}
