import { CatsRepository } from '../cats.repository';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CatRequestDto } from '../dto/cats.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Cat } from '../cats.schema';
import { Model } from 'mongoose';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CatsService {
    private readonly awsS3: AWS.S3;
    public readonly S3_BUCKET_NAME: string;

    constructor(
        private readonly catsRepository: CatsRepository,
        private readonly configService: ConfigService,
    ) {
        this.awsS3 = new AWS.S3({
            accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
            secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
            region: this.configService.get('AWS_S3_REGION'),
        });
        this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
    }

    async getAllCat() {
        const allCat = await this.catsRepository.findAll();
        const readOnlyCats = allCat.map((cat) => cat.readOnlyData);
        return readOnlyCats;
    }

    async signUp(body: CatRequestDto) {
        const { email, name, password } = body;
        const isCatExist = await this.catsRepository.existsByEmail(email);

        if (isCatExist) {
            throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const cat = await this.catsRepository.create({ email, name, password: hashedPassword });

        return cat.readOnlyData;
    }

    async uploadImg(cat: Cat, file: any) {
        const fileName = file.key;
        console.log(fileName);
        const newCat = await this.catsRepository.findByIdAndUpdateImg(cat.id, fileName);
        console.log(newCat);
        return newCat;
    }

    async uploadFileToS3(
        folder: string,
        file: Express.Multer.File,
    ): Promise<{
        key: string;
        s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
        contentType: string;
    }> {
        try {
            const key = `${folder}/${Date.now()}_${path.basename(file.originalname)}`.replace(/ /g, '');

            const s3Object = await this.awsS3
                .putObject({
                    Bucket: this.S3_BUCKET_NAME,
                    Key: key,
                    Body: file.buffer,
                    ACL: 'public-read',
                    ContentType: file.mimetype,
                })
                .promise();
            return { key, s3Object, contentType: file.mimetype };
        } catch (error) {
            throw new BadRequestException(`File upload failed : ${error}`);
        }
    }

    async deleteS3Object(
        key: string,
        callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
    ): Promise<{ success: true }> {
        try {
            await this.awsS3
                .deleteObject(
                    {
                        Bucket: this.S3_BUCKET_NAME,
                        Key: key,
                    },
                    callback,
                )
                .promise();
            return { success: true };
        } catch (error) {
            throw new BadRequestException(`Failed to delete file : ${error}`);
        }
    }

    public getAwsS3FileUrl(objectKey: string) {
        return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
    }
}
