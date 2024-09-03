import { CatsRepository } from './cats.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Cat } from './cats.schema';
import { Model } from 'mongoose';

@Injectable()
export class CatsService {
    constructor(private readonly CatsRepository: CatsRepository) {}

    async signUp(body: CatRequestDto) {
        const { email, name, password } = body;
        const isCatExist = await this.CatsRepository.existsByEmail(email);

        if (isCatExist) {
            throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const cat = await this.CatsRepository.create({ email, name, password: hashedPassword });

        return cat.readOnlyData;
    }
}
