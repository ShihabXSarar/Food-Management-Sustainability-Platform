import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // find user by id (exclude password)
  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // find user by email (include password) - used by auth module if needed
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  // update profile (if password provided, hash it)
  async updateProfile(userId: string, dto: UpdateUserDto) {
    const updatePayload: any = { ...dto };

    if (dto.password) {
      const hashed = await bcrypt.hash(dto.password, 10);
      updatePayload.password = hashed;
    }

    const updated = await this.userModel
      .findByIdAndUpdate(userId, { $set: updatePayload }, { new: true })
      .select('-password')
      .lean();

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }
}
