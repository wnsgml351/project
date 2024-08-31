import { HttpExceptionFilter } from 'src/common/excetpions/http-exception.filter';
import { CatsService } from './cats.service';
import {
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

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
    constructor(private readonly CatsService: CatsService) {}

    @Get()
    getAllCat() {
        // throw new HttpException('api is broken', 401);
        console.log('hello controller');
        return { cats: 'get all cat api' };
    }

    @Get(':id')
    getOneCat(@Param('id', ParseIntPipe) param: number) {
        console.log(param);
        console.log(typeof param);
        return 'get one cat api';
    }

    @Post()
    createCat() {
        return 'create cat';
    }

    @Put(':id')
    updateCat() {
        return 'update cat';
    }

    @Patch(':id')
    updatePartialCat() {
        return 'update';
    }

    @Delete(':id')
    deleteCat() {
        return 'delete cat';
    }
}
