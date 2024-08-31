import { HttpExceptionFilter } from 'src/http-exception.filter';
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
} from '@nestjs/common';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
    constructor(private readonly CatsService: CatsService) {}

    @Get()
    getAllCat() {
        throw new HttpException('api is broken', 401);
        return 'all cat';
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
