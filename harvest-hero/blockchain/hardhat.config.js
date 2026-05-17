// import { HardhatUserConfig } from 'hardhat/config.js';
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.24',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:8545'
    }
  }
};

// export default config;

