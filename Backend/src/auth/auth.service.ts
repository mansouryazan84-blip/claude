import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email: dto.email.toLowerCase().trim() })
      .getOne();

    if (!user) throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    if (!user.isActive) throw new UnauthorizedException('الحساب موقوف، يرجى التواصل مع المدير');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('بيانات الدخول غير صحيحة');

    return this.signToken(user);
  }

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (exists) throw new ConflictException('البريد الإلكتروني مسجل مسبقاً');

    const user = this.userRepo.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      password: dto.password,
      role: 'operator',
    });

    await user.hashPassword();
    const saved = await this.userRepo.save(user);
    return this.signToken(saved);
  }

  async forgotPassword(email: string) {
    // In production: generate reset token and email it
    // For now just confirm the endpoint works
    const user = await this.userRepo.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    // Always return success to prevent email enumeration
    return { message: 'إذا كان البريد مسجلاً، سيتم إرسال رابط إعادة التعيين' };
  }

  async me(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.serializeUser(user);
  }

  private signToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user: this.serializeUser(user),
    };
  }

  private serializeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      warehouseId: user.warehouseId,
      createdAt: user.createdAt,
    };
  }
}
