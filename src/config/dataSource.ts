import { Company } from 'src/entities/company.entity';
import { UserCompany } from 'src/entities/user-company.entity';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';
import { URL } from 'url';

const dbUrl = new URL('postgresql://postgres:1234@localhost:5432/questarc');
const routingId = dbUrl.searchParams.get('options');
dbUrl.searchParams.delete('options');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl.toString(),
  ssl: false,
  extra: {
    options: routingId,
  },
  //   timeTravelQueries: false,
  entities: [Company, User, UserCompany],
  synchronize: true,
});
