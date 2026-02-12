import { Controller, Post, Body, Param } from '@nestjs/common';
import { producer } from '../kafka/producer';

@Controller()
export class JobsController {

  // 🔹 Topic 1
  @Post('jobs')
  async createJob(@Body() body: any) {
    await producer.send({
      topic: 'job-events',
      messages: [
        {
          key: 'job-created',
          value: JSON.stringify({
            type: 'JOB_CREATED',
            jobId: Date.now(),
            title: body.title,
          }),
        },
      ],
    });

    return { message: 'Job created event published' };
  }

  // 🔹 Topic 2
  @Post('jobs/:id/view')
  async viewJob(@Param('id') id: string) {
    await producer.send({
      topic: 'analytics-events',
      messages: [
        {
          key: 'job-viewed',
          value: JSON.stringify({
            type: 'JOB_VIEWED',
            jobId: id,
            viewedAt: new Date(),
          }),
        },
      ],
    });

    return { message: 'Analytics event published' };
  }
}
