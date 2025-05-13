import { BadRequestException, Body, Controller, Headers, Post, UnauthorizedException, UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { ZodValidationPipe } from "src/validation/pipeValidation";
import { ZodError } from 'zod';
import { LoginInput, RegisterInput, UserValidation, WorkIdentityInput } from './../validation/uservlidation.dto';
import { UserService } from "./users.service";

@Controller('auth')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post('register')
    @UsePipes(new ZodValidationPipe(UserValidation.REGISTER))
    async register(@Body() body: RegisterInput) {
        const { name, email, password } = body;
        try {
            return this.userService.register(name, email, password);
        } catch (err) {
            if (err instanceof ZodError) {
                // Mengambil informasi error dari Zod dan mengembalikannya dalam format issues
                const issues = err.errors.map((error) => ({
                    path: error.path[0], // field yang error (misalnya 'email', 'password')
                    message: error.message, // pesan error dari Zod
                }));
                throw new BadRequestException({ message: 'Validation error', issues });
            }
            throw err; // Error lain yang terjadi
        }
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(UserValidation.LOGIN))
    async login(@Body() body: LoginInput) {
        const { email, password } = body;
        try {
            return this.userService.login(email, password);
        } catch (err) {
            if (err instanceof ZodError) {
                const issues = err.errors.map((error) => ({
                    path: error.path[0],
                    message: error.message,
                }));
                throw new BadRequestException({ message: 'Validation error', issues });
            }
            throw err;
        }
    }

    @UseGuards(AuthGuard)
    @Post('update-work-identity')
    @UsePipes(new ZodValidationPipe(UserValidation.WORK_IDENTITY))
    async updateWorkIdentity(@Body() body: WorkIdentityInput) {
        const { email, password, work_identity } = body;
        try {
            return this.userService.updateWorkIdentity(email, password, work_identity);
        } catch (err) {
            if (err instanceof ZodError) {
                const issues = err.errors.map((error) => ({
                    path: error.path[0],
                    message: error.message,
                }));
                throw new BadRequestException({ message: 'Validation error', issues });
            }
            throw err;
        }
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Headers('Authorization') authHeader: string) {
        const token = authHeader?.split(' ')[1];
        if (!token) throw new UnauthorizedException('No token provided');
        return this.userService.logout(token);
    }
}
