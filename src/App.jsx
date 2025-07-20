import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contracts/artifacts/contracts/VoteSystem.sol/VoteSystem.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function loadContract() {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const signer = await provider.getSigner(3); // conta 0 do Hardhat
        const voteContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );

        setContract(voteContract);

        const numCandidates = await voteContract.getNumCandidates();
        const candidates = [];

        for (let i = 0; i < numCandidates; i++) {
          const candidateName = await voteContract.candidates(i);
          const candidateVotes = await voteContract.getCandidateVotes(candidateName)
          candidates.push({ name: candidateName, votes: candidateVotes });
        }

        setCandidates(candidates);
      } catch (err) {
        console.error("Erro ao carregar contrato:", err.message);
      }
    }

    loadContract();
  }, [candidates]);

  const vote = async (candidateName) => {
    try {
      if (!contract) return;

      const tx = await contract.vote(candidateName);
      await tx.wait();

      alert("Voto enviado com sucesso!");
    } catch (err) {
      console.error("Erro ao votar:", err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Sistema de Votação</h1>
      {candidates.map((c, i) => (
        <div key={i} style={{ marginBottom: 15 }}>
          <strong>
            [{c.votes}] {c.name}
          </strong>
          <button onClick={() => vote(c.name)} style={{ marginLeft: 10 }}>
            Votar
          </button>
        </div>
      ))}
    </div>
  );
}
