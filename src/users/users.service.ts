import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(data: Partial<User>) {
    if (!data.role) data.role = UserRole.CUSTOMER;
    const user = new this.userModel(data);
    return user.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(filter: any) {
    return this.userModel.findOne(filter).exec();
  }
}
