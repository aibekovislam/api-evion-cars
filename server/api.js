import express from 'express';
import axios from 'axios';
import morgan from 'morgan'; 
import cors from 'cors';
import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';


const app = express();
const port = process.env.PORT || 3000;
const sheets = google.sheets('v4');

function getJSON() {
  fs.readFile('server/ultimate-flare-394210-984749cf001c.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка чтения файла:', err);
        return;
    }
  
    try {
        const jsonData = JSON.parse(data);
        return jsonData
    } catch (parseError) {
        console.error('Ошибка разбора JSON:', parseError);
    }
  });
}

const credentials = getJSON();

const auth = new google.auth.JWT({
  email: "islam-evion-api@ultimate-flare-394210.iam.gserviceaccount.com",
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCT3x0cfI8qvU1c\n7pAAbANV9WOlvf+2d4nG09f6KCrK0hEt+ZywIXHWbpn+h2/FuX+ER5itXt7xMZm4\nQJuVesnSyPy4iYR575QxKyrfawrTfrMXCP0IBXiuwNSS3gHOUJTT0vVjJYm4vBg2\nnOQZvyIp4SK7Vhm7Rp96HNMC9A24eluoMvJ2qt5U08mTS7hNJZJqV/4PoJzBUjan\n82feoEg15LpCt4zroLbi2X8ZTLAh4YEQ6D8iTu+00x6Zz6eh9xMvpCWT1/my+rj4\nE3k4GXgVT2BXH3sGW0SxTopBuOB9lJOzFOO6MRcEwyyPxjc5waGoz8eA5ccY9zPK\nEzaKSihVAgMBAAECggEAPAsvY3dSnQy0IsW+FGXHrvpPBaiScpG0kNdJjksMIUJO\ndogybzSNaICNqFRvdu69UEXQQanRxkeZPz+AzaBH3n79W6N/dxHo71QzevgYs8tx\nRivAryalm/Qx/RcHzbJb1G2HdcRy2WALRvXLC4dYhH/mHgK2vRxOuoOEzWCzR5JN\ninNK8Fu+5CdQRZMKjd12IcjJ3oySFeDVMaHlf1/ScAVGGukRRDwWKfRKv0B5TBc+\nKGfCojCCqodpRs7kb2CK55SgFPda5TmzXZwE5Z4INxpXvm3DLLe/Tl0hxzkoFi3X\nqro9iP5UBxNzoAB2jRKJN5Br8n2n/YEHGYulHl08+wKBgQDK7MKLd/9T7CNx16Nv\npsbkrgkd8WWYaq/I3oLgHTJBbfgN6/QxGrq8k6RmzYQDBsdNViOqo9zCa13Y2Oda\ndvww89mWfaP74gC2UF3lixB79AEBxl4qf5q400NGbS304ExaZa+oHJQnp6a935/s\nVrXpnE2N88ywkzyOABu4d9BQTwKBgQC6jCY0gNhFUxhR89qTTRyHBdHAs3gt0eZe\nY/t/he15BgsA59vCAVwp/q83tZsBV4eFLgoFXCKfKEc/eDo6G7ffo8qteGYaVW/Z\nNagm+D+8+CbRktU9vmO7uuhs1Odulgs4gNHLtb21tmro20FpF9HY/v3MEWKUUzl0\nxlthDvdQGwKBgHVC8XzEn9/wEd9kO8Z2OnLE+vG5n/q+k8vggQJe/L6AfJoW4mpJ\nxuTX8GWTlxhkn2DaSQv/Wr9iab24QaCuJzdmgjMLcWpJhB3WPRw7CxCFxNswtROb\n3120fyjASJE72ANYxXPA6AAuShVolzJsPPy83LgNzRewTYrFFz+2xMLTAoGBALHs\nOAg9l4jPT1Pi3Gc/1eSmVT+RLR+uoiUHAXnImA2lCNutSLmKKIhZRG9DA/tMq5IH\nrkEcdl0Mwp+zoP2JMF/aTdYUDnYxZMNr3NyGS+yFViju/fms3FzSURp0GeQssbkL\njI3Z4n4s5V0AuittL5Xi5tg7AKXtltBc3Az/hDxfAoGAbu0FKwhDYDoDmlE16Trl\nHPT/t9aoSHkKeNePKrc9UuxbOUBcNUrGnfmHqmwuTq+A5h+2rkSfH9r+NljghM/z\nNFxNSVP1hKeAApJwiI4DXG8kM4wva+fNQ9j/8jOcJDJt9rdHqtu6etcTnAaOkrBR\ncdcBI4VRM3L0RqMPDnA283k=\n-----END PRIVATE KEY-----\n",
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


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

app.get('/google-sheets', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }
    
      const spreadsheetId = '1-fucmPS2DEKP91kQaFTMWJaKuTyyfLwxWGbE5PaA13I';
    
      const sheetName = 'sum';
    
      try {
        const response = await sheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range: `${sheetName}!A1:A3`, 
        });
    
        const data = response.data.values;
        if (data.length === 0) {
          console.log('No data found.');
          res.json({ message: 'No data found' }); 
        } else {
          console.log('Fetched data:', data);
          res.json({ data }); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
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
    const refresh_token = "def5020041970aa527cac66765da383b98e9ef4c9db04828c39bff31f5ddabc5a5d6b78cb974fb4a7e820855a38245b536fead0a76eb94c58e4367ec0d2716119a558afaddcfb848cdbe950d0ff0e266d17d7e57431944593579290e5a8f4d9f50bcd31496d66f9656ff44f11293a376cc6d8df6bae6868a587425c5dcf31d75479266d85686a7907ac0c847243e35f5715d3bb20c37dfa2cbdabb72465f7a0f8dd21b09c85eb6f174a70bc938680a157af7a805d272db3d21c2857bfb84ed671e9537d87ac2ab91d581972858ab0b1710d2f601fa977f6e90b2e730a188781f5922f2643e907c0e9d89227d96abbab4a6d90acf132a2caa62c3631d85fae7acdd7983c281c22c6454d2c26639b776058f3ca2a5d2cda79f2f7e1be8ba565804e0b6677df62d36d54083cbd008ea40af7264130ca5c263c39e878f3ae4268962aa0afab735d2aff7a3fecb87ab6db283bc083f7d22239a7e3be46337d46e5576f55556e6b1d3d5db81528db78080cf0c9fe5e0b7398dc686f63e396a529d3f0ebc6cae237f7857fd9912aafcdc7db6e9c8dd46ec8372854587ef3a368da45135c4eae1b45d06f6e47b85f0b2fdbfa8abba39e5a3bf79d134abed2e87410d06ba43b4ab54c004ff141523462fc03e06bf8f1262df9a47f65f13c28ff35bb235fe5c5992cdba21cb51e4a3daa8bf271050";
    const redirectUri = 'http://localhost:3000/';

    const requestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      redirect_uri: redirectUri,
    };

    const response = await axios.post('https://evion.amocrm.ru/oauth2/access_token', requestBody);

    // Обработка ответа от сервера
    if (response.status === 200) {
      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;

      // Обновите сохраненный Access Token и Refresh Token в вашем хранилище
      // Эти токены будут использоваться для следующих запросов к AmoCRM API
    } else {
      console.error('Ошибка при обновлении Access Token:', response.data);
    }

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


app.get('/tilda-amo', async (req, res) => {
  try {
    const requestOptions = {
      headers: {
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjhjMmU5ZDU5Y2YwOTk1ZDQzZjU1Yzg2ZmMzZTJmYWYzMzQ1NDE0MDNhN2ZhNDk0YjIwYmRjMDg3OGJmYWJlNTI1YWUyNGViN2FlMjc0YTQ1In0.eyJhdWQiOiJlNDI3YzNhNC1lN2IxLTQxZjItOWUzNi0yMTZiN2FlZGIwMTgiLCJqdGkiOiI4YzJlOWQ1OWNmMDk5NWQ0M2Y1NWM4NmZjM2UyZmFmMzM0NTQxNDAzYTdmYTQ5NGIyMGJkYzA4NzhiZmFiZTUyNWFlMjRlYjdhZTI3NGE0NSIsImlhdCI6MTY5NDUxMDI1MSwibmJmIjoxNjk0NTEwMjUxLCJleHAiOjE2OTQ1OTY2NTEsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzEyMDIxMDIsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6InYyIiwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.R4n8GJjAUxkKtG5yafi8WdtApYIWIUVYIEeArx--aOv6f6UETxjfm6kFz2q9h555EHm970sAp8OW6kqaYyHFlX7UuaRIIZlN8dLqLGRAXsYD_GorZI72PuPhtqwqLIcrnfG5QMle20Hcvyi--KCsG_p-PGGK1bSwvbFcN6SIaKzAKeoz5uHtOiPkHSKuPNq7t3YBz4MWnzVOxLnF5-AE8M5XAmSD6pERQOg8coZs3jmpnevusb8bdIY4UetHT7eQ9b_P7jVqj6VKYegnerMfxtLY2mmbQ6P59luoBADzfE9CtCPo8rx7PQUrdj-EzkErZQABs6oDlH1N6DvyI37WIQ`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.get('https://evion.amocrm.ru/api/v4/leads/custom_fields/2627609', requestOptions);
    console.log(response.data)
    res.status(response.status).json(response.data.enums);
  } catch (error) {
    console.error('Error creating leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/tilda-amo/leads', async (req, res) => {
  const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjhjMmU5ZDU5Y2YwOTk1ZDQzZjU1Yzg2ZmMzZTJmYWYzMzQ1NDE0MDNhN2ZhNDk0YjIwYmRjMDg3OGJmYWJlNTI1YWUyNGViN2FlMjc0YTQ1In0.eyJhdWQiOiJlNDI3YzNhNC1lN2IxLTQxZjItOWUzNi0yMTZiN2FlZGIwMTgiLCJqdGkiOiI4YzJlOWQ1OWNmMDk5NWQ0M2Y1NWM4NmZjM2UyZmFmMzM0NTQxNDAzYTdmYTQ5NGIyMGJkYzA4NzhiZmFiZTUyNWFlMjRlYjdhZTI3NGE0NSIsImlhdCI6MTY5NDUxMDI1MSwibmJmIjoxNjk0NTEwMjUxLCJleHAiOjE2OTQ1OTY2NTEsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzEyMDIxMDIsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6InYyIiwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.R4n8GJjAUxkKtG5yafi8WdtApYIWIUVYIEeArx--aOv6f6UETxjfm6kFz2q9h555EHm970sAp8OW6kqaYyHFlX7UuaRIIZlN8dLqLGRAXsYD_GorZI72PuPhtqwqLIcrnfG5QMle20Hcvyi--KCsG_p-PGGK1bSwvbFcN6SIaKzAKeoz5uHtOiPkHSKuPNq7t3YBz4MWnzVOxLnF5-AE8M5XAmSD6pERQOg8coZs3jmpnevusb8bdIY4UetHT7eQ9b_P7jVqj6VKYegnerMfxtLY2mmbQ6P59luoBADzfE9CtCPo8rx7PQUrdj-EzkErZQABs6oDlH1N6DvyI37WIQ'
  const apiUrl = 'https://evion.amocrm.ru/api/v4/leads';
  try {
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    };
    let allLeads = [];
    let nextPage = `${apiUrl}?filter%5Bstatuses%5D%5B142%5D%5B7067962%5D=&page=1&limit=250`;

    while (nextPage) {
      const response = await axios.get(nextPage, requestOptions);
      const leads = response.data._embedded.leads;

      if (leads.length === 0) {
        break;
      }

      allLeads = allLeads.concat(leads);

      nextPage = response.data._links.next?.href;
    }

    res.status(200).json({ totalLeads: allLeads.length});
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});