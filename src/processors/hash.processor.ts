import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'await-of';
import { Job } from 'bull';
import { AppService } from 'src/app.service';
import { Hash, ResultStatusEnum } from 'src/database/entities/hash.entity';
import { Repository } from 'typeorm';

@Processor('upload-hash')
export class HashProcessor {
  constructor(
    @InjectRepository(Hash) private hashRepository: Repository<Hash>,
    private readonly appService: AppService,
  ) {}

  @Process('valid-nonce')
  async transcode(job: Job<any>) {
    console.log('job', job.data);
    if (job?.data && job.data.status === ResultStatusEnum.PENDING) {
      const [processRecord, processError] = await of(
        this.hashRepository.findOne({
          where: {
            id: job.data.id,
          },
        }),
      );
      if (processError) throw new Error('Error in finding id');
      if (!processRecord) return {};
      if (processRecord) {
        const processJob = { ...processRecord, ...job?.data };
        const response: any = await this.appService.getDetails(processJob);
        if (Object.keys(response).length && response.nonce) {
          console.log(response);
          const [updateDB, updateError] = await of(
            this.hashRepository.update(
              {
                id: processRecord?.id,
              },
              {
                nonce: response?.nonce,
                status: ResultStatusEnum.COMPLETED,
                output_hex: response?.outputHex,
              },
            ),
          );
          if (updateError)
            throw new Error('Error in updating nonce into database');
          if (!updateDB) return {};
          if (updateDB) {
            return {
              status: ResultStatusEnum.COMPLETED,
              outputHex: response?.outputHex,
            };
          }
        }
      }
    }
  }
}
