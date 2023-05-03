import { DataSourceOptions } from "typeorm"
import { config } from "dotenv"
config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}

// const dataSource = new DataSource(dataSourceOptions)
// export default dataSource