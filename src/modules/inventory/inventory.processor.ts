import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { Job } from 'bull';
import { InventoryService } from './inventory.service';

@Processor('inventory-images-queue')
export class InventoryProcessor {
  constructor(private readonly inventoryService: InventoryService) {}

  private readonly logger = new Logger(InventoryProcessor.name);

  @Process('upload')
  async handleUpload(job: Job) {
    const { name, url } = job.data;

    this.logger.debug(`Start uploading ${name}...`);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data, 'utf-8');

    await this.inventoryService.uploadImageToBucket({ name, buffer });

    this.logger.debug(`Uploading ${name} completed`);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}...`);
  }
}
