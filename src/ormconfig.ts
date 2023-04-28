const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
  migrations: [ __dirname + 'migrations/**/*{.ts,.js}' ],
}

export default config
