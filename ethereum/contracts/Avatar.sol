pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';

contract Avatar is ERC721Full, ERC721Mintable {
  //uint256 representing character avatar
  mapping(uint=>uint) public AvatarId;
  // uint256 representing the total  number of tokens
  mapping(address=>uint[]) myTokens;
  uint public createdTokens;

  constructor() ERC721Full("SpinFM", "SpinFM") public {
  }

  function mint(address to, uint Avatar) public  returns (bool) {
        uint tokenId= createdTokens+1;
        _mint(to, tokenId);
        AvatarId[tokenId]=Avatar;
        createdTokens=tokenId;
        return true;
    }

}