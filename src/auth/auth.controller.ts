import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createUser(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.createUser(authCredentialsDto);
  }
}
