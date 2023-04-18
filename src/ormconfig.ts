import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'realworld',
  username: 'realuser',
  password: '123',
};

export default config;
