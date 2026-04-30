import { redis } from "../../lib/redis.js";

const LUA_SCRIPT = `
-- KEYS[1] = queue list
-- KEYS[2] = set de controle
-- ARGV[1] = playerId

local queueKey = KEYS[1]
local setKey = KEYS[2]
local playerId = ARGV[1]

-- já está na fila?
if redis.call("SISMEMBER", setKey, playerId) == 1 then
    return { "ALREADY_QUEUED" }
end

-- tenta pegar oponente
local opponent = redis.call("LPOP", queueKey)

if opponent then
    if opponent ~= playerId then
        redis.call("SREM", setKey, opponent)
        return { "MATCHED", opponent }
    end
end

-- adiciona na fila
redis.call("RPUSH", queueKey, playerId)
redis.call("SADD", setKey, playerId)

return { "WAITING" }

`;

export class MatchQueueRepository {
    static async enqueuePlayer(playerId: string) {
        const result = await redis.eval(
            LUA_SCRIPT,
            2,
            "queue:players",
            "queue:players:set",
            playerId
        );

        const [status, opponentId] = result as [string, string];

        return {
            status,
            opponentId
        };
    }
}