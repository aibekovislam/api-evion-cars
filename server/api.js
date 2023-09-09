import express from 'express';
import axios from 'axios';
import morgan from 'morgan'; 

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  next();
});


app.get('/getProducts', async (req, res) => {
  try {
    const response = await axios.get(
      'https://online.moysklad.ru/api/remap/1.2/entity/product',
      {
        headers: {
          Authorization: 'Bearer 224525b73a9c5cf1f31973127b90897be84d1916',
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      const filteredDataPromises = data.rows.map(async (item) => {
        if (item.pathName === "Каталог товаров/Электромобили") {
          return item;
        }
      });

      const filteredData = (await Promise.all(filteredDataPromises)).filter(Boolean);
      res.json(filteredData);
    } else {
      res.status(response.status).json({
        message: 'Error fetching data from the external API',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

app.get('/getImages/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/product/${req.params.id}/images`, {
      headers: {
        Authorization: 'Bearer 224525b73a9c5cf1f31973127b90897be84d1916',
      }
    })
    if (response.status === 200) {
      const data = response.data;
      res.json(data);
    } else {
      res.status(response.status).json({
        message: 'Error fetching data from the external API',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
})

app.get('/car/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://online.moysklad.ru/api/remap/1.2/entity/product/${req.params.id}`, {
      headers: {
        Authorization: 'Bearer 224525b73a9c5cf1f31973127b90897be84d1916',
      }
    })
    if (response.status === 200) {
      const data = response.data;
      res.json(data);
    } else {
      res.status(response.status).json({
        message: 'Error fetching data from the external API',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
})

app.post('/addLead', async (req, res) => {
  try {
    const { name, price, status_id, pipeline_id, created_by, updated_by } = req.body;

    const clientId = 'e427c3a4-e7b1-41f2-9e36-216b7aedb018';
    const clientSecret = '36xXa5rP1AOh93kDfOLo5UMHZcljxj5GV4psh4IuvW6HNBVwXmcRF3AB2LCWQexS';
    const authorizationUrl = `https://www.amocrm.ru/oauth?client_id=${clientId}&mode=popup`;


    const response = await axios.post(
      'https://evion.amocrm.ru/api/v4/leads',
      {
        name,
        price,
        status_id,
        pipeline_id,
        created_by,
        updated_by,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1Y2UyNzZiYTUzZDVhZDQ3NDgxMDJiMzY1OWMzMmZiNTJmYTNhN2ViMTk2Mjk5ODZjMTRhYzk5NTdjNjM0YjIyMThmZGJiYzkzNzU1MmE4In0eyJhdWQiOiI3YjQ5MGYxOC0yYmU1LTRhNTUtYTc0ZS0xOTYzYzk2NDFiOTgiLCJqdGkiOiI2NWNlMjc2YmE1M2Q1YWQ0NzQ4MTAyYjM2NTljMzJmYjUyZmEzYTdlYjE5NjI5OTg2YzE0YWM5OTU3YzYzNGIyMjE4ZmRiYmM5Mzc1NTJhOCIsImlhdCI6MTY5NDIzNTc3OCwibmJmIjoxNjk0MjM1Nzc4LCJleHAiOjE2OTQyMzgxNzgsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MCwiYmFzZV9kb21haW4iOm51bGwsInZlcnNpb24iOiJ2MSIsInNjb3BlcyI6WyJjaGF0cyIsImNybSIsIm1haWwiLCJub3RpZmljYXRpb25zIiwidW5zb3J0ZWQiXX0RS8ptXUF8bavK5R2yITekxu-pwGyC7UNCotVvQ06gJwD0DhKSi3PeA4tSr84ZFSLEbw_eqVegSX3A7PNBRhbfVQiALskgy3ln5uxPFy1-cwrtmrieIOTBbiwXksG1Jn1J4PcjdMs7A1Lh9nHT0mBlaMCuL8Q6hgAYhUPc3_C0yFSF6wrMtUSdI7FAdIbv57hNpMGGdJphpEty-mn908qR0zuIrTcRweA7YNElCffYmH_DYlWztPbUAT775GgAGzWoIZGUwbOhF9hlUleFt1-AgWgFh1swvovOcxoo3Z0KCghcstlT9PeEh46Ng4U6JKSDSOsowMhrUNY5KxfTgE35w`,
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      res.json(data);
    } else {
      res.status(response.status).json({
        message: 'Error adding lead to AmoCRM',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
