import {Redis} from "ioredis";

export const redis = new Redis({
    lazyConnect: true,
    retryStrategy: process.env.NODE_ENV === "test" ? () => null : undefined,
});
