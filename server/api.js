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
        updated_by
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImI2NGEzNzVhNWU2MDRhODlkZDZlMmUwYWVjMDlmMTM4YmM5MmI1MmZjZDBhMmRjNWNmNWI1MWUyMmIxOTcwMzU0ODFjYjM0M2ZiZDk2Y2RhIn0.eyJhdWQiOiI3YjQ5MGYxOC0yYmU1LTRhNTUtYTc0ZS0xOTYzYzk2NDFiOTgiLCJqdGkiOiJiNjRhMzc1YTVlNjA0YTg5ZGQ2ZTJlMGFlYzA5ZjEzOGJjOTJiNTJmY2QwYTJkYzVjZjViNTFlMjJiMTk3MDM1NDgxY2IzNDNmYmQ5NmNkYSIsImlhdCI6MTY5NDI2MDYyMSwibmJmIjoxNjk0MjYwNjIxLCJleHAiOjE2OTQyNjMwMjEsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MCwiYmFzZV9kb21haW4iOm51bGwsInZlcnNpb24iOiJ2MSIsInNjb3BlcyI6WyJjaGF0cyIsImNybSIsIm1haWwiLCJub3RpZmljYXRpb25zIiwidW5zb3J0ZWQiXX0.G1_bcboWOHTps9uenAY7hRMZX9vOPma6Z0cV3Z-zXn8GUQO_H-7TbME5WY-M4K08s1uq50vyu1R7yqQnvbSZCeXNf3r28Bnogzf0UstPrgCJzeEY9735ePPvwjJykiVaElQVKJLf7RqA6qYLwAigbF0GYMqHzqPM7dlzDReoMqlSL6hIsnvhpeRy3sVtwmn5l39NaK0GcM3pD_7FiQtCAiaLnDs4vOB0PEYZ5-SnG5hQRNMy84f6420lf3IWsmvtVJX-keItBZV9mC7yAAO-rthYnP3tsOoKGdziUPjSBlRc1bqF9K_QtzKaE6DOJ-Z9vdQXEfR0NvdY0xL9i3Mk0A`,
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
    console.error('Ошибка при обработке запроса:', error.message);
    console.error('Стек ошибки:', error.stack);
    res.status(500).json({
      message: 'Internal server error',
    });  
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
