import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async register(dto) {
    const exist = await this.userModel.findOne({ email: dto.email });
    if (exist) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPass = await bcrypt.hash(dto.password, 10);

    const user = new this.userModel({
      ...dto,
      password: hashedPass,
    });

    await user.save();
    return { message: 'User registered successfully' };
  }

  async login(dto) {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid password');


 const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
   expiresIn: '7d',
 });


    return { token, user };
  }
}
