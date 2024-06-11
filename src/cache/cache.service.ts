import { Injectable } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class CacheService {
    private cache: NodeCache;

    constructor() {
      this.cache = new NodeCache();
    }
  
    get<T>(key: string): T {
      return this.cache.get(key);
    }
  
    set<T>(key: string, value: T, ttl: number): void {
      this.cache.set(key, value, ttl);
    }
  
    del(key: string): void {
      this.cache.del(key);
    }
  
    flushAll(): void {
      this.cache.flushAll();
    }
}
