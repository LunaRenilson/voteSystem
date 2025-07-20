import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contracts/artifacts/contracts/VoteSystem.sol/VoteSystem.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    async function loadContract() {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const signer = await provider.getSigner(selectedAccount); // conta 0 do Hardhat
        setSelectedAccount(signer.address);

        const accs = await provider.listAccounts();
        setAccounts(() => accs.map((acc, key) => acc.address));

        const voteContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );

        const voted = await voteContract.hasVoted(signer.address);
        setHasVoted(voted)
        console.log(voted)

        setContract(voteContract);

        const numCandidates = await voteContract.getNumCandidates();
        const candidates = [];

        for (let i = 0; i < numCandidates; i++) {
          const candidateName = await voteContract.candidates(i);
          const candidateVotes = await voteContract.getCandidateVotes(
            candidateName
          );
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
      alert("Você já votou!!");
      return;
    }
  };

  return (
    <div className="flex">
      <div className="vote p-5 m-5">
        <h1 className="mb-3">Sistema de Votação</h1>
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

      <div className="flex flex-col p-5">
        <label htmlFor="account-select">Selecione a conta:</label>
        <select
          id="account-select"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="p-2 rounded border text-white bg-gray-900"
        >
          {accounts.map((account) => (
            <option
              key={account}
              value={account}
              className={`${selectedAccount === account ? "bg-green-600" : ""}`}
            >
              {account}''
            </option>
          ))}
        </select>
        <small className={hasVoted ? 'text-green-500' : 'text-red-700'}>{hasVoted ? 'Já votou!' : "Ainda não votou"}</small>
      </div>
    </div>
  );
}
