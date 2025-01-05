import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): { message: string } {
    return {
      message: 'Welcome to the API! Everything is running successfully.',
    };
  }
}
