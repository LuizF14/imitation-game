import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const basePrisma = new PrismaClient({ adapter });

const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const readOperations = [
          'findFirst',
          'findMany',
          'findUnique',
          'findUniqueOrThrow',
          'findFirstOrThrow',
          'count',
          'aggregate',
          'groupBy',
        ];

        if (readOperations.includes(operation)) {
            const queryArgs = args as { where?: any };
            
            queryArgs.where = {
                ...queryArgs.where,
                deletedAt: null,
            };

            return query(queryArgs);
        }

        return query(args);
      },
    },
  },
});

export { prisma };