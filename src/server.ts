import express from 'express';
import path from 'path';

const app = express();
const appPath = path.resolve("./");
const PORT = 7777;

app.use(express.static(appPath));

app.listen(process.env.PORT || PORT, () => {
    const banner = `
        **************************************
        **** SERVER WORKING ON PORT ${PORT} **
        **************************************
    `
    console.log(banner);
});