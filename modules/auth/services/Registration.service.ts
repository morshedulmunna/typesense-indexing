import { Injectable } from '@nestjs/common';
import { registerDto } from '../dto/index.dto';
import { FastifyReply } from 'fastify';
import { CommonUtilityModule, CommonUtilityService } from '@app/common-utility';
import { EmailOptionTypes, SendMailService } from '@app/send-mailer';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly commonUtility: CommonUtilityService,
    private readonly SendMailService: SendMailService,
    private readonly AuthRepository: AuthRepository,
  ) {}

  async registration(register_info: registerDto, response: FastifyReply) {
    const { email, name, password } = register_info;

    // Random Number generate
    const activationCode = this.commonUtility.randomNumber(9000);

    // Generate Email validation token for sending
    const email_validation_token = await this.commonUtility.generateToken({
      payload: {
        email,
        name,
        activationCode,
        password,
      },
      secret: process.env.EMAIL_VALIDATION_JWT_SECRET,
      expiresIn:
        parseInt(process.env.EMAIL_VALIDATION_JET_SECRET_EXPIRE) * 60 * 1000,
    });

    const emailOptions: EmailOptionTypes = {
      email: email,
      subject: 'Verification Code for Registration!',
      template: '/modules/auth/templates/activation-mail.ejs',
      data: { name, activationCode },
    };

    // Email send for validation code
    try {
      // TODO: -> After add this       AuthEntity was not found
      const res = await this.AuthRepository.registerUser(register_info);
      await this.SendMailService.sendEmail(emailOptions);
      console.log(res);
    } catch (error) {
      throw new Error(error.message);
    }

    // response.setCookie('verification_token', email_validation_token);

    return {
      message: 'Verification Code Sent!',
      token: email_validation_token,
    };
  }
}
