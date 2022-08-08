import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'await-of';
import BigNumber from 'bignumber.js';
import { Queue } from 'bull';
import { ethers, utils } from 'ethers';
import { Repository } from 'typeorm';
import { Hash, ResultStatusEnum } from './database/entities/hash.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('upload-hash') private uploadHash: Queue,
    @InjectRepository(Hash) private readonly hashRepository: Repository<Hash>,
  ) {}

  generateHash(input): string {
    const hash = input.toString(16);
    if (hash.length % 2 === 0) {
      const ether = ethers.utils.keccak256(utils.arrayify('0x' + hash));
      return ether;
    }
    const ether = ethers.utils.keccak256(utils.arrayify('0x0' + hash));
    return ether;
  }

  async getDetails(record) {
    try {
      console.log('record', record);
      const { input_hex, nonce_range } = record;
      if (input_hex === null || input_hex === '') {
        return { error: 'Hex is empty' };
      }
      const initialHash = new BigNumber(input_hex, 16);
      const { start_process_nonce, end_process_nonce } = nonce_range;
      let nonce = new BigNumber(start_process_nonce);
      for (let i = start_process_nonce; i < end_process_nonce; i++) {
        const input = BigNumber.sum(new BigNumber(input_hex, 16), nonce);
        const hash = this.generateHash(input);
        const newHash = new BigNumber(hash, 16);
        if (initialHash.isGreaterThan(newHash)) {
          return { nonce: nonce.toString(), outputHex: hash };
        }
        nonce = BigNumber.sum(nonce, 1);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
