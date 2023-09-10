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
    const clientSecret = '20GnGOC9UacXkMCVrWlVyeCYiyhZ4xY305ToeLPsdLDNzHwvEUR02KGoiM94WqM6';
    const authorizationCode = 'def502006645d60134be19d744ad2eb4cd96a3fe73782d7d1c3676446484ad014387eb590a95dd960e0210f7821100c417115c29b9d5c81fb3b027f09a879038fdd1db162d90cd746b84bca82d69001e08f951670a9c8a82f6d07fa2b12fad69968728830bf68a949fd90d41d554c755ca2a655d4b4784de8150778cb9b888319a456680d7280e4f69eee35d3978babab67c55152fe35810deaf7655a97a8b7e78f8e650f8ddd457ae04b794a7b99a884e9642f8fb947b72484759806c0cce2e19e077b86da7fa390e12f5b0f719af0125900481508cb74bce55e1b787e6ba93e15bbb12e9d741a7b9635d6cb66fc0295c2cff65a7a75174648d348657bbd4e1dfdfdc7677735c218c81cfb6c57f08d9b2581834fec667714f8f4ea9db18740a7f18ba64ffdd728ca753111cee4de048df49c12d9ae58524909d90f693b411e0a9bf5d3100b76fb2de9ba94bd8460aec9ebb349a05729515e53c2b0a79925d323e49c43347812e4565906088b4c8093af1f3b9b52a581329156f403fa54da6c697c899e65f9561453c436a2fa0b4fa5bb66062152d8bd1e6a4288ca71979240776188fcc7c3b9531a21c07b05da15c54735ff41a7a49f058592b63292a94e548a458605aba6b22d9afa1ef280cf09a816a55876cf80301b6fd5422275a768015af9279ec8ea2e3';
    const redirectUri = 'http://localhost:3000/';

    const requestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
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
    const leadData = req.body

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
