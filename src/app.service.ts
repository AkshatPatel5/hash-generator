import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { ethers, utils } from 'ethers';

@Injectable()
export class AppService {
  getHash(body): object {
    try {
      if (body.hash === null || body.hash === '') {
        return { error: 'Hex is empty' };
      }
      let nonce = new BigNumber(0);
      const initialHash = new BigNumber(body.hash, 16);
      while (1) {
        const input = BigNumber.sum(new BigNumber(body.hash, 16), nonce);
        const hash = this.generateHash(input);
        const newHash = new BigNumber(hash, 16);
        if (initialHash.isGreaterThan(newHash)) {
          return { nonce: nonce.toString(), hash: hash };
        }
        nonce = BigNumber.sum(nonce, 1);
      }
    } catch (error) {
      return { error: error.message };
    }
  }
  generateHash(input): string {
    const hash = input.toString(16);
    if (hash.length % 2 === 0) {
      const ether = ethers.utils.keccak256(utils.arrayify('0x' + hash));
      return ether;
    }
    const ether = ethers.utils.keccak256(utils.arrayify('0x0' + hash));
    return ether;
  }
}
