import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { CandidateModule } from './candidate/candidate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    CandidateModule,
  ],
  controllers: [AppController], // Add the AppController here
})
export class AppModule {}
