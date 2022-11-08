//SPDX-License-Identifier:MIT
pragma solidity >=0.4.21 <8.10.0;

contract LottoCoin {
    uint[] submit; // 제출한 로또 
    uint256[] answer; // 로또 정답
    uint256 rank; // 로또 순위
    uint256 public total; // 전체 코인
    mapping (address => uint256) public balanceOf;
    address public owner;

    event WinOfLotto(address indexed winner, uint256 _rank, uint256[] _submit, uint256[] _answer);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        total = 0;
        owner = msg.sender;
    }

    function SetCoin(uint256 num) public onlyOwner {
        require(num >= 1000);
        total = num;
        balanceOf[msg.sender] = num; 
    }

    function GetCoin() public view returns(uint256) {
        return balanceOf[owner];
    }

    function BuyLotto() public {
        require(balanceOf[msg.sender] >= 1);
        balanceOf[msg.sender] -= 1;
        balanceOf[owner] += 1;
        total += 1;
    }

    function ReceiveCoin() public {
        require(balanceOf[owner] >= 10);
        balanceOf[msg.sender] += 10;
        balanceOf[owner] -= 10;
        total -= 10;
    }

    function Send(address _to, uint256 amount) public onlyOwner {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[_to] += amount;
        balanceOf[msg.sender] -= amount;
        total -= amount;
    }

    function Winning(uint256 _rank, uint256[] memory _submit, uint256[] memory _answer) public {
        uint256 coin;
        if(_rank == 1) coin = 5;
        else if(_rank == 2) coin = 3;
        else if(_rank == 3) coin = 2;
        else if(_rank == 4) coin = 1;
        else coin = 0;
        
        require(balanceOf[owner] >= coin);
        emit WinOfLotto(msg.sender, _rank, _submit, _answer);
        balanceOf[msg.sender] += coin;
        balanceOf[owner] -= coin;
        total -= coin;
    }
}