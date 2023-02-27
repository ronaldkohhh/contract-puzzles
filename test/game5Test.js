const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    let validAddress = false;
    let wallet;
    let address;
    
    while(!validAddress) {
      wallet = ethers.Wallet.createRandom();
      address = await wallet.getAddress();
      if (address < threshold) {
        validAddress = true;
      }
    }

    wallet = wallet.connect(ethers.provider);
    const signer = ethers.provider.getSigner(0);

    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther('200')
    })

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
