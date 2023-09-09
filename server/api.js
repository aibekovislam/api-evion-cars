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
          'Content-Type': 'application/json'
          // 'Authorization': `Bearer def50200866a1046f0b93b8a653519eba4ddeccc7f0e17a1f74c555aa083488f34e1463b9580bb9078517796b0d6e117ecb6facad3bf6b375285a121c671e0fafd6a006d617ba86466e01f38662708c0c4aff798cf7d284a17c37c523f8d44ab68db244ec6439bcf89b198c33df4cc59e2e6911f71e024221149c5a0046eaa7a55ce4154c2e1f4bf8f8ab46af2f2cd0819faa7f54591414f83a48975a976e69ebc4d721dd84049d2fee64262c95e703d8f5db8747bf0d38f0754f3646ee8ea3067752fe6ac874da76f2603db771b5d6832b7566fe827bf8c4c059b6688f1bbe5e70152da10fbecd5a3c088a2b53f403c5df1e1da710a74ac551bfbd06d039b70409277fdd3a89b6dd8655ebc3a85036f09bbc11c6f8b3553c4de8f379a92e9297451f95f71add0add86299b678f02b557e14bac239de2eb6923b3d50ac4c7d498294deedc44c141bb74392611a805288c3b2d9d502b23bfbcc0b06fad6e04fdc46a5bb6b04aaa2cd99d25bf72829410d491d816c2569d11058506c6498e3c49b55289f35be6a947b06bfc16f04c4e0cc04cc6c3137e063c3f5033b5e748cf96135bdd94b115b14733b9c1a6b6c165727d187df1a963d101fc7c112bd24634dc20a3f6a7ecd045e9163ee99db52dd15873d590c2c8e4c17`,
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
