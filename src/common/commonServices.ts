import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export class CommonServices {
    async hashToken(token: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(token, saltOrRounds);
    }

    generateRandomCode(length: number): string {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async compareHashedTokens(hashedToken: string, plainToken: string): Promise<Boolean> {
        return await bcrypt.compare(plainToken, hashedToken);
    }

    async generateJwt(jwtService: JwtService, dataPayload: { userId: string, phoneNumber: string }): Promise<string> {
        return await jwtService.signAsync(dataPayload);
    };

    getIP(request: any): string {
        let ip: string;
        const ipAddr = request.headers['x-forwarded-for'];
        if (ipAddr) {
            const list = ipAddr.split(',');
            ip = list[list.length - 1];
        } else {
            ip = request.connection.remoteAddress;
        }
        return ip.replace('::ffff:', '');
    }
}