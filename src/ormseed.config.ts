import { DataSource } from "typeorm"
import { dataSourceOptions } from "./db.connection"


const ormseedconfig = {
  ...dataSourceOptions,
  migrations: [ __dirname + '/seeds/**/*{.ts,.js}' ],
  cli: {
    migrationsDir: 'src/seeds'
  }
}

const ormSeedConfigInstance = new DataSource(ormseedconfig)

export default ormSeedConfigInstance