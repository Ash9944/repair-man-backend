import { Request } from 'express';
import { DataSource, EntityManager, ObjectLiteral, Repository } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.inteceptor';

export class BaseRepository {
    constructor(
        protected dataSource: DataSource,
        protected request: Request,
    ) { }

    protected getRepository<T extends ObjectLiteral>(entityCls: new () => T): Repository<T> {
        const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
        return entityManager.getRepository(entityCls);
    }
}
