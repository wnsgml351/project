import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { CatsController } from './controllers/cats.controller';
import { CatsRepository } from './cats.repository';
import { Cat, CatSchema } from './cats.schema';
import { CatsService } from './services/cats.service';
import { CommentsSchema, Comments } from '../comments/comments.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forFeature([
            { name: Comments.name, schema: CommentsSchema },
            { name: Cat.name, schema: CatSchema },
        ]),
        forwardRef(() => AuthModule),
    ],
    controllers: [CatsController],
    providers: [CatsService, CatsRepository],
    exports: [CatsService, CatsRepository],
})
export class CatsModule {}
