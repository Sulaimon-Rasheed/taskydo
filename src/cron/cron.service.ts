import { Injectable } from '@nestjs/common';
import * as mailService from '../utils/mailer';
import { Task } from 'src/models/task.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { DateTime } from 'luxon';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { Cron} from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    private readonly loggerService: WinstonLoggerService,
  ) {}

  
  @Cron('*/30 * * * *')
  async handleCron() {
    this.loggerService.log('Cron job running...');
    const tasks = await this.taskModel.findAll({
      where: { status: 'Pending' },
      include: [
        {
          model: User,
          attributes: ['_id', 'userName', 'email'],
        },
      ],
    });

    const current_time = DateTime.now();

    for (const task of tasks) {
      let formatedDueDate = DateTime.fromFormat(task.due_date, 'LLL d, yyyy \'at\' HH:mm' )
      const option = {
        email: task.user.email,
        subject: 'Reminder from Taskydo',
        html: `<p>Hi, ${task.user.userName}</P>
                 <p>Don't forget your task, with the details below will be due in about 1hr.</p>
                 <p><strong>Title: </strong>${task.title}</p>
                 <p><strong>Description: </strong>${task.description}</p>
                 <p><strong>Due date and time: </strong>${formatedDueDate}</p>
                 <p>Ensure not to miss the task or appointment.</p>
                 <p>Have a good day</p>`,
      };

      const due_time = DateTime.fromISO(task.due_date);

      const time_diff = Math.round(due_time.diff(current_time, 'hours').hours);

      console.log(time_diff);
      if (time_diff === 1) {
        mailService.sendEmail(option);
      }
    }
  }
}
