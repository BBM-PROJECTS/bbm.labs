> Run Migration:

```bash
sequelize db:migrate
```

> First, revert the previous migration:

```bash
npx sequelize-cli db:migrate:undo
```

> Use the sequelize-cli to generate a new migration file with a descriptive name:

```bash
npx sequelize-cli migration:generate --name create_users_table
```

> Ensure that your `User` model is defined correctly and all the fields mentioned in the seeder file match with your model attributes. Then you can run this seeder using Sequelize CLI:

```bash
npx sequelize-cli db:seed:all
```

> And to rollback the seed data:

```bash
npx sequelize-cli db:seed:undo:all
```

> To create a seeder file using Sequelize CLI, you can use the following command:
```bash
npx sequelize-cli seed:generate --name create-users
```

> Drop the Database:

```bash
npx sequelize-cli db:drop
```

> npx sequelize-cli db:create

```bash
npx sequelize-cli db:create
```
