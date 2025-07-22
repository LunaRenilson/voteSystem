import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contracts/artifacts/contracts/VoteSystem.sol/VoteSystem.json";
import voteIcon from './assets/voteIcon.png'
import infoIcon from './assets/info.png'
import checkIcon from './assets/check.png'

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
		<div className="flex flex-col w-full items-center h-screen justify-center">
			<div className="vote p-5 m-5 flex flex-col w-full items-center justify-center gap-y-10">
				<div className="flex flex-col items-center justify-center">
					<img src={voteIcon} alt="vote icon" className="w-50" />
					<h1 className="mb-3">Vote System</h1>
				</div>
				<div className="flex gap-3">
					{candidates.map((c, i) => (
						<div key={i} style={{ marginBottom: 15 }}>
							<strong>
							</strong>
							<button onClick={() => vote(c.name)} style={{ marginLeft: 10 }}>
								({c.votes}) {c.name}
							</button>
						</div>
					))}
				</div>
			</div>

			<div className="flex flex-col p-5 items-center">
				<div className="flex flex-col">
					<label htmlFor="account-select">Select Your Account:</label>
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
				</div>
				<div className={`flex items-center gap-2 justify-center w-fit text-lg text-center font-semibold w-fit py-1 px-3 my-2 rounded-full opacity-50 ${hasVoted ? 'text-green-800 bg-green-200' : 'text-red-900 bg-red-300'}`}>
					<img src={!hasVoted ? infoIcon : checkIcon} alt="info icon" className="w-5" />
					<small>{hasVoted ? 'Already Voted' : "Hasn't Voted Yet"}</small>
				</div>
			</div>
		</div>
	);
}
