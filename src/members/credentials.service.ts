import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Credential } from './entities';

@Injectable()
export class CredentialsService {
  constructor(private dataSource: DataSource) {}

  private readonly logger = new Logger(CredentialsService.name);

  async createCredential(user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const credentialInstance = queryRunner.manager.create(Credential, {
        firstName: user.firstName,
        lastName: user.lastName,
      });
      const credential = await queryRunner.manager.save(
        Credential,
        credentialInstance,
      );
      await queryRunner.commitTransaction();
      return credential;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getMemberCredential(member: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const credential = await queryRunner.manager.findOne(Credential, {
        where: { member: { id: member.id } },
      });
      await queryRunner.commitTransaction();
      return credential;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateCredential(credential: any, body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const credentialInstance = queryRunner.manager.merge(
        Credential,
        credential,
        {
          ...body,
        },
      );
      const updatedCredential = await queryRunner.manager.save(
        Credential,
        credentialInstance,
      );
      await queryRunner.commitTransaction();
      return updatedCredential;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
    } finally {
      await queryRunner.release();
    }
  }
}
