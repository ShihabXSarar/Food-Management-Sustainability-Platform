import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/profile  (protected)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    // req.user from JwtAuthGuard contains payload (id)
    const userId = (req.user as any).id;
    return this.usersService.findById(userId);
  }

  // PATCH /users/profile (protected)
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = (req.user as any).id;
    return this.usersService.updateProfile(userId, dto);
  }
}
