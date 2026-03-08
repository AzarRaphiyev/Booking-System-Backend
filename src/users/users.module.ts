import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminController } from './admin.controller';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController, AdminController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule], 
})
export class UsersModule {}
