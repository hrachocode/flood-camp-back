// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import { NFT } from './NFT.sol';

contract NFTStore {
    address[] private nft;

    event NFTAdded(address nft, address owner, uint numOfNFTs, address[] nfts);

    constructor() {}

    function addNFT(address _nft) public {
        nft.push(_nft);
        emit NFTAdded(_nft, NFT(_nft).ownerOf(0), nft.length, nft);
    }

    function allNFTs() public view returns (address[] memory) {
        return nft;
    }

}