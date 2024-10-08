import { Body, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatsService } from '../services/cats.service';
import { CatRequestDto } from '../dto/cats.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Cat } from '../cats.schema';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
    constructor(
        private readonly catsService: CatsService,
        private readonly authService: AuthService,
    ) {}

    @ApiOperation({ summary: '현재 고양이 가져오기' })
    @UseGuards(JwtAuthGuard)
    @Get()
    getCurrentCat(@CurrentUser() cat) {
        return cat.readOnlyData;
    }

    @ApiResponse({
        status: 500,
        description: 'Server Error...',
    })
    @ApiResponse({
        status: 200,
        description: '성공!',
        type: ReadOnlyCatDto,
    })
    @ApiOperation({ summary: '회원가입' })
    @Post()
    async signUp(@Body() body: CatRequestDto) {
        return await this.catsService.signUp(body);
    }

    @ApiOperation({ summary: '로그인' })
    @Post('login')
    logIn(@Body() data: LoginRequestDto) {
        return this.authService.jwtLogIn(data);
    }

    @ApiOperation({ summary: '고양이 이미지 업로드' })
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    async uploadCatImg(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return await this.catsService.uploadFileToS3('cats', file);
    }

    @Post('cats')
    getImageUrl(@Body('key') key: string) {
        return this.catsService.getAwsS3FileUrl(key);
    }

    @ApiOperation({ summary: '모든 고양이 가져오기' })
    @Get('all')
    getAllCat() {
        return this.catsService.getAllCat();
    }
}
