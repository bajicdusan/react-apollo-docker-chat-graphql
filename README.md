docker-compose up -d

npm i

sequelize db:migrate

sequelize db:seed:all

npm run dev

to change mysql data from terminal:

mysql -h 127.0.0.1 -u root -p
