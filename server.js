const app = require('./index')
const { connection } = require('./db')

try {
  connection.sync({ force: true }).then(() => {
    console.log("Database connected")
    app.listen(3008, () => {
      console.log('Server listening on port 3008');
    });
  });
} catch(err) {
  console.log(err)
};