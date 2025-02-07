import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/battery', (req, res) => {
    const {battery_temp} = req.body;
    // let tempValue = battery_temp;
    // if(typeof battery_temp === 'object' && battery_temp.value)
    // {
    //     tempValue = battery_temp.battery_temp;
    // }
    console.log(req.body)
    res.json({message: 'Data received'});
});

const port = 5000;
app.listen(port, (err) => {
    if(err)
        console.log(`Something went terribly long`);

    console.log(`Server running at http://localhost:5000`);
});