const hre = require("hardhat");

async function main() {
    const VoteSystem = await hre.ethers.getContractFactory("VoteSystem");
    const voteSystem = await VoteSystem.deploy(['Alice', 'Norman', 'Gerald']);
    
    await voteSystem.waitForDeployment();

    console.log("VoteSystem deployed to: ", voteSystem.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
