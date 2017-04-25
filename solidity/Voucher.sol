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
   *    created: the contract is deployed but initial attestation is pending 
   *    active: the initial value has been attested and the attestation window is running
   *    ready: attestation is done and the user can claim the voucher
   *    cleared: the user has claimed the voucher
   */
  enum State { created, active, ready, issued, failed }
  string [5] stateName = [ "created", "active", "ready", "issued", "failed" ];
    
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

  /// @dev a standardized error event
  event Error(string method, string message);

  /// @dev event for voucher issuance
  event VoucherIssuanceEvent(uint timestamp, string method, string newState, uint attestedValue);

  enum Operator { less, greater, equal }

  struct Condition {
    Operator operator;
    uint value;
  }

  Condition condition;
 
  uint public attestedInitialValue;
  uint public attestedFinalValue;

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
  }
    
  /**
   * @dev Attest the feature to the contract
   * @param _data The attested data
   * @return status code:
   *            0 success
   *           -1 invalid contract state
   *           -2 attempt before due time 
   *           -3 invalid attester device
   */
  function attest(uint _data) public
    returns(int)
    //onlyState(State.created)
    //onlyDueTime()
    //onlyParty(device)
  { 
    if(voucherState != State.created || voucherState != State.active) 
    {
      Error("attest", "invalid contract state");
      return -1;
    }
    if(now < validityLife)
    {
      Error("attest", "attempt before due time");
      return -2;
    }
    if(msg.sender != device)
    {
      Error("attest", "invalid attester device");
      return -3;
    }
    if(voucherState == State.created) 
    {
      attestedInitialValue = _data;
      voucherState = State.active;
    } else {
      attestedFinalValue = _data;
      voucherState = State.ready;
    }
    VoucherEvent(now, "attest", stateName[uint(voucherState)], "Attested");
    return 0;
  }

  /**
   * @dev Claim the reward to the contract
   * @return status code 
   *            1 success issued
   *            0 success rejected 
   *           -1 invalid contract state
   *           -3 invalid claimer user)
   */
  function claim() public 
    //onlyState(State.ready)
    //onlyParty(beneficiary)
    returns (int)
  {
    if(voucherState != State.ready)
    {
      Error("attest", "invalid contract state");
      return -1;
    }
    if(msg.sender != beneficiary)
    {
      Error("attest", "invalid attester device");
      return -3;
    }
    uint attestedValue = attestedFinalValue - attestedInitialValue;
    if(condition.operator==Operator.less)
    {
      if(attestedValue < condition.value)
      {
        voucherState = State.issued;
        VoucherIssuanceEvent(now, "claim", stateName[uint(voucherState)], attestedValue);
	return 1;
      }
    } else if (condition.operator==Operator.greater) 
    {  
      if(attestedValue > condition.value)
      {
	voucherState = State.issued;
        VoucherIssuanceEvent(now, "claim", stateName[uint(voucherState)], attestedValue);
        return 1;
      }
    } else if (condition.operator==Operator.equal)
    {
      if(attestedValue == condition.value)
      {
	voucherState = State.issued;
        VoucherIssuanceEvent(now, "claim", stateName[uint(voucherState)], attestedValue);
	return 1;    
      }
    }  
    voucherState = State.failed;
    VoucherIssuanceEvent(now, "claim", stateName[uint(voucherState)], attestedValue);
    return 0;
  }
}
