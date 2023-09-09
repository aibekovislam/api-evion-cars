import express from 'express';
import axios from 'axios';
import morgan from 'morgan'; 
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use(express.json());

app.use(cors());

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

const amocrmToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjYxNjI5YWVlMDA0NWNlYjdiZTU0NDI5NjExN2VmMDhmOGZmMGMzNWQ4OWZiNmE3OGUwNGZlMmU3NDdjYmUwZjQzNTk4ZGEwYTQ0NmY0ZWVmIn0.eyJhdWQiOiI3YjQ5MGYxOC0yYmU1LTRhNTUtYTc0ZS0xOTYzYzk2NDFiOTgiLCJqdGkiOiI2MTYyOWFlZTAwNDVjZWI3YmU1NDQyOTYxMTdlZjA4ZjhmZjBjMzVkODlmYjZhNzhlMDRmZTJlNzQ3Y2JlMGY0MzU5OGRhMGE0NDZmNGVlZiIsImlhdCI6MTY5NDI2MzA0MiwibmJmIjoxNjk0MjYzMDQyLCJleHAiOjE2OTQyNjU0NDIsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MCwiYmFzZV9kb21haW4iOm51bGwsInZlcnNpb24iOiJ2MSIsInNjb3BlcyI6WyJjaGF0cyIsImNybSIsIm1haWwiLCJub3RpZmljYXRpb25zIiwidW5zb3J0ZWQiXX0.q_sElD22xhx-zPOzHCwwnrbwf7Owvc6nv3KLMPGtsXYjXrLPHsCASIk9AqTYOFoQQO5Xu07AC4jhQApvWNe43cctNyxuLOmMP5wzjsJC5SZXekqaQyQGP5AgnRfLiyxGnCZKqd4joSwXntZcIOe0ktGVNii6S6FSh6NCpmLSoomClhUGSyb7GOkiKaZTSAFLxo3pmgfPE2M7iIwCqXNoaNSBmnW-bwOJIaeILqsOMM6f0WzXNEvypGX1OwbK7LAmTOE2fKYldT7yvWV1ONb7EKzHKyfaPhYL076pJ4U_6_0CielpMgr50YwuO_KW9ZE0B9y1etY7oHIk_RBlmeZWkg';

const amocrmApiUrl = 'https://evion.amocrm.ru/api/v4/leads'

app.post('/create-leads', async (req, res) => {
  try {
    const leadsData = req.body;

    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${amocrmToken}`,
        'Content-Type': 'application/json',
      },
    };

    // Отправляем запрос на создание сделок
    const response = await axios.post(`${amocrmApiUrl}/leads`, leadsData, requestOptions);

    // Возвращаем ответ клиенту
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error creating leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
