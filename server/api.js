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


app.post('/get-access-token', async (req, res) => {
  try {
    const clientId = 'e427c3a4-e7b1-41f2-9e36-216b7aedb018';
    const clientSecret = '36xXa5rP1AOh93kDfOLo5UMHZcljxj5GV4psh4IuvW6HNBVwXmcRF3AB2LCWQexS';
    const authorizationCode = 'def502009f9f82a388b32c97888398b0aa38d0275ad9da4fb99a78bd4d54ed3da3720faa2d45194375af4593e54111fd83aa833a86ce03e918f135e6a88ccbf91898d32fbd8f78e414f958664dbf124c8c8c98f3acdff9aa61f838113d4ef0ee048e9cb4afafd5f8d15156113566afa36a3a044ec77670fe520f132d2eca30fe7efe16b92ded0db401cf73ba850e8240665865bab29ff8b1f993594f7dfcfee05f37d7b210e17cb25d2500473af573a284dfcdc91c541714757457453b685d132221bbd10595c38e255ae9f9f16494068e35c40da11be57004e6e3f9425f9f861184fa3b2955f8156b4cf9310440d07a187fac0908a561ab60f7491574c65c9c8a4b8db37b67708a214fe4fafadd21e4124e3b3bdfbd710c21bcec8a87f07bca988cc0ed2200107c744aa455b77ef015a134616c4e44d6269734e275c7abd53e5f4fc57463c0bf1c9a3f11e57af67be526700dda75ffe0daea4244ce086c3c0505d68818d7dfb4a27920760ddaa6c4a9ea2c80652735b9f10329ff6e9d7b01a4e13213e20041bbbe584be6ebd90d6c7a9d5b07753eef2027c6d9481345db5e22e201b67dd61e4c36fa4f522e83ab213a9f2616fdf9d127b0012c23e1a328c11c7fd1b654e0ad6f812f5deed4374773d6c196d6f5d7cbcd0751e049dcf7418d9e44f0419dad591c';
    const redirectUri = 'http://localhost:3000/';

    const requestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: redirectUri,
    };

    const response = await axios.post('https://evion.amocrm.ru/oauth2/access_token', requestBody);

    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при запросе к AmoCRM:', error);
    res.status(500).json({ error: 'Ошибка при запросе к AmoCRM' });
  }
});


app.post('/create-leads', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const leadData = req.body;

    console.log(token);
    console.log(leadData)

    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post('https://evion.amocrm.ru/api/v4/leads', leadData, requestOptions);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error creating leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
