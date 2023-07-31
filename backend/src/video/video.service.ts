import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  create(createVideoDto: CreateVideoDto) {
    return this.videoRepository.insert(createVideoDto);
  }

  findAll() {
    return this.videoRepository.find();
  }

  findOne(id: number) {
    return this.videoRepository.findOneBy({ id });
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return this.videoRepository.update(id, updateVideoDto);
  }

  remove(id: number) {
    return this.videoRepository.delete(id);
  }
}
