import { DataSource } from "typeorm"
import { dataSourceOptions } from "./db.connection"

const AppDataSource = new DataSource({
  ...dataSourceOptions,
  entities: ['*/**/*.entity{.js,.ts}'],
  migrations: ['src/migrations/*.ts']
})

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })

export default AppDataSource