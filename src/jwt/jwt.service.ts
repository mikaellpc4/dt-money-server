import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as JwtNestService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomJwtService {
  constructor(
    private jwtService: JwtNestService,
    private prisma: PrismaService,
  ) {}

  async generateRefreshToken(userId: string) {
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        // 1 Week
        expiresIn: 60 * 60 * 24 * 7,
        secret: process.env.REFRESH_SECRET,
      },
    );

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokens: {
          push: refreshToken,
        },
      },
    });

    // If already has more than 5 Sessions remove the oldest session

    const { refreshTokens } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        refreshTokens: true,
      },
    });

    if (refreshTokens.length >= 5) {
      const lastTokens = refreshTokens.splice(-5);
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshTokens: {
            set: lastTokens,
          },
        },
      });
    }

    return refreshToken;
  }

  async generateAcessToken(userId: string) {
    const acessToken = await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        // 15 Minutes
        expiresIn: 60 * 15,
        secret: process.env.ACESS_SECRET,
      },
    );

    return acessToken;
  }

  async getTokens(userId: string) {
    const [acessToken, refreshToken] = await Promise.all([
      this.generateAcessToken(userId),
      this.generateRefreshToken(userId),
    ]);

    return {
      acess_token: acessToken,
      refresh_token: refreshToken,
    };
  }

  async validateRefreshToken(refreshToken: string) {
    const decodedToken = this.jwtService.decode(refreshToken) as JwtPayload;
    if (!decodedToken || !decodedToken.sub) {
      return {
        status: 'Invalid',
        decodedToken: null,
      };
    }
    const validRefreshToken = await this.prisma.user.findFirst({
      where: {
        AND: [
          { id: decodedToken.sub },
          {
            refreshTokens: {
              has: refreshToken,
            },
          },
        ],
      },
    });
    const expired = dayjs(decodedToken.exp * 1000).isBefore(dayjs());
    if (!validRefreshToken) {
      return {
        status: 'Invalid',
        decodedToken,
      };
    }

    if (expired) {
      return {
        status: 'Expired',
        decodedToken,
      };
    }

    return {
      status: 'Ok',
      decodedToken,
    };
  }

  async updateRefreshToken(oldRefreshToken: string) {
    const { status, decodedToken } = await this.validateRefreshToken(
      oldRefreshToken,
    );
    if (status !== 'Expired' && status !== 'Ok') {
      throw new UnauthorizedException(`${status} Refresh Token`);
    }
    await this.removeRefreshToken(oldRefreshToken);
    return this.getTokens(decodedToken.sub);
  }

  async removeRefreshToken(refreshToken: string) {
    const decodedToken = this.jwtService.decode(refreshToken) as JwtPayload;
    const { refreshTokens } = await this.prisma.user.findUnique({
      where: {
        id: decodedToken.sub,
      },
      select: {
        refreshTokens: true,
      },
    });
    await this.prisma.user.updateMany({
      where: {
        refreshTokens: {
          has: refreshToken,
        },
      },
      data: {
        refreshTokens: {
          set: refreshTokens.filter((token) => token !== refreshToken),
        },
      },
    });
  }
}
