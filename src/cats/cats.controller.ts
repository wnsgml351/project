import { HttpExceptionFilter } from 'src/common/excetpions/http-exception.filter';
import { CatsService } from './cats.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatRequestDto } from './dto/cats.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyCatDto } from './dto/cat.dto';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
    constructor(private readonly CatsService: CatsService) {}

    @ApiOperation({ summary: '현재 고양이 가져오기' })
    @Get()
    getCurrentCat() {
        return 'current cat';
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
        return await this.CatsService.signUp(body);
    }

    @ApiOperation({ summary: '로그인' })
    @Post('login')
    logIn() {
        return 'login';
    }

    @ApiOperation({ summary: '로그아웃' })
    @Post('logout')
    logOut() {
        return 'logout';
    }

    @ApiOperation({ summary: '고양이 이미지 업로드' })
    @Post('upload/cats')
    uploadCatImg() {
        return 'uploadImg';
    }
}
