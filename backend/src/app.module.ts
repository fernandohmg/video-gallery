import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './video/entities/video.entity';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'db',
      entities: [Video],
      synchronize: true,
    }),
    VideoModule,
  ],
})
export class AppModule {}
