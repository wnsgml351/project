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

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
    constructor(private readonly CatsService: CatsService) {}

    @Get()
    getCurrentCat() {
        return 'current cat';
    }

    @Post()
    async signUp(@Body() body: CatRequestDto) {
        return await this.CatsService.signUp(body);
    }

    @Post('login')
    logIn() {
        return 'login';
    }

    @Post('logout')
    logOut() {
        return 'logout';
    }

    @Post('upload/cats')
    uploadCatImg() {
        return 'uploadImg';
    }
}
