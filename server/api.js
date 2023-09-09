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

const amocrmToken = 'def5020004ec85d747c8f3281e75ee5a8d07f13c5e650300a2b20fb94258ca1d5c6a5c29b0f05d6bd3827a768395169c9be5c8a4a1d4361a2339b92cb48aea1d5eda58c9e14c64a690d957518c911a19c532368b2ae4b007d0cb282a51116f9daaaf1fde563726f062f8532d5d148e233e5027a02de7357b38d5abca74a59b10641e80c5c35df5fa7e024b54a4d8f25c3d70adcbfa3a99f50284d45120d1022fe9f13a01f4c535112c1b20af00ed8e7ee475d67c67e176b871f928441657c0959c8048015af2dcf57430157a43615ec7d48601c2ec0b7074c9a608537b9197c605651d3c25c3859bb01e9ba12e4cba0997e8882e332ec21c310e2182e0c205d020aae7a1c6b91ad90f70c0e86a11604d7e49e0726510fcc8ec38c5d5487eeeecb2b1eef2e1208a073b0309c7d1388731fe0ad9044f98e911eef0d70438d28b7800e75a82e5fa700a45ad952c7736e74e75e1aa2b4e30ebc5f6c4b46f62839c954ffe76840d95218c88a7ce963ad37da9a5c86c10768d4e49504df281014154d350da92459469350111eb7720c3b5a29ca6ad9e9632cfbfed8a111e00862970180cb03daa30f59e1bb55362829c64be1ce379d0c87078ae83690dfdc4e7407d071e9023c86831988cf9c520c2d68650b560e27ff20838ab';
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
    const response = await axios.post('https://evion.amocrm.ru/api/v4/leads', leadsData, {
      headers: {
        'Authorization': `Bearer ${amocrmToken}`,
        'Content-Type': 'application/json',
      },
    });

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
