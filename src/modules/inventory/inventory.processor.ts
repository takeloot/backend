import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Job } from 'bull';
import { InventoryService } from './inventory.service';

const BUCKET_NAME = 'steam';
const FILE_EXTENSION = 'png';
@Processor('inventory-images-queue')
export class InventoryProcessor {
  constructor(
    private readonly configService: ConfigService,
    private readonly inventoryService: InventoryService,
  ) {}

  private readonly logger = new Logger(InventoryProcessor.name);

  @Process('upload')
  async handleUpload(job: Job) {
    const { name, url, skinId } = job.data;

    this.logger.debug(`Start uploading ${name}...`);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data, 'utf-8');

    const res = await this.inventoryService.uploadImageToBucket({
      name,
      buffer,
    });

    if (res) {
      await this.inventoryService.updateSkinImage({
        skinId,
        skinImgURL: `${this.configService.get(
          'base.cdnURL',
        )}/${BUCKET_NAME}/${name}.${FILE_EXTENSION}`,
      });
    }

    this.logger.debug(`Uploading ${name} completed`);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}...`);
  }
}
