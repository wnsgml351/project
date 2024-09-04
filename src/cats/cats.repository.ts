import { Comments } from '../comments/comments.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat } from './cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class CatsRepository {
    constructor(
        @InjectModel(Cat.name) private readonly catModel: Model<Cat>,
        @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
    ) {}

    async findAll() {
        // const CommentsModel = mongoose.model('comments', CommentsSchema);

        // const result = await this.catModel.find().populate('comments', CommentsModel);

        const result = await this.catModel.find().populate({ path: 'comments', model: this.commentModel });
        return result;
    }

    async findByIdAndUpdateImg(id: string, fileName: string) {
        const cat = await this.catModel.findById(id);

        cat.imgUrl = fileName;

        const newCat = await cat.save();

        console.log(newCat);
        return newCat.readOnlyData;
    }

    async findCatByIdWithoutPassword(catId: string | Types.ObjectId): Promise<Cat | null> {
        const cat = await this.catModel.findById(catId).select('-password');
        return cat;
    }

    async findCatByEmail(email: string): Promise<Cat | null> {
        const cat = await this.catModel.findOne({ email });
        return cat;
    }

    async existsByEmail(email: string): Promise<boolean> {
        const result = await this.catModel.exists({ email });
        if (result) return true;
        else return false;
    }

    async create(cat: CatRequestDto): Promise<Cat> {
        return await this.catModel.create(cat);
    }
}
