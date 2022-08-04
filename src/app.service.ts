import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

@Injectable()
export class AppService {
  getHash(body): object {
    let nonce = new BigNumber(0);
    const initialHash = new BigNumber(body.hash, 16);
    console.log(nonce.toString());
    while (1) {
      const input = BigNumber.sum(new BigNumber(body.hash, 16), nonce);
      console.log('input: ' + input.toString());
      const hash = this.generateHash(input);
      const newHash = new BigNumber(hash, 16);
      console.log(
        'hash: ' + initialHash.toString() + new BigNumber(hash, 16).toString(),
      );
      if (initialHash.isGreaterThan(newHash)) {
        console.log('nonce:' + nonce.toString());
        return { nonce: nonce.toString(), hash: hash };
      }
      nonce = BigNumber.sum(nonce, 1);
    }
  }
  generateHash(input): string {
    const hash = input.toString(16);
    console.log('generateHash: ' + hash);
    const ether = ethers.utils.keccak256('0x' + hash);
    console.log('ether:' + ether.toString());
    return ether;
  }
}
