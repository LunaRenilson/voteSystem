// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VoteSystem {
    string[] public candidates;

    constructor(string[] memory _candidates){
        candidates = _candidates;
    }

    function candidateExists(string memory _candidate) internal view returns (bool) {
        for (uint i = 0; i < candidates.length; i++){
            if (keccak256(bytes(candidates[i])) == keccak256(bytes(_candidate))) {
                return true;
            }
        }
        return false;
    }

    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;

    function vote(string memory _candidate) public {
        require(!hasVoted[msg.sender], "Ja votou!");
        require(candidateExists(_candidate), "Candidato invalido!");
        votes[_candidate]++;
        hasVoted[msg.sender] = true;
    }

    function getCandidateVotes(string memory _candidate) public view returns (uint){
        return votes[_candidate];
    }
    
    function getNumCandidates() public view returns (uint) {
        return candidates.length;
    }

    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }
}

