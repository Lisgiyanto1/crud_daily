import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./users.service";

@Controller('auth')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post('register')
    async register(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string
   
    ) {
        return this.userService.register(name, email, password);
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string

    ) {
        return this.userService.login(email, password);
    }
}