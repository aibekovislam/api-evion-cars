import express from 'express';
import axios from 'axios';
import morgan from 'morgan'; 
import cors from 'cors';
import { google } from 'googleapis';
import fs from 'fs/promises';
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
    const refresh_token = "def5020050c765cdef91ea3f56de28033c76b4084bc3b6511182a032c3ddbbf696f7c62883ffdcb8ecb81891ca8c528c8116cfd1815e1cf6ffe1083600a7f3c49cb1032dc13b1072fe09583c6a29e54e4dc5aaee6fcc5621ade8b0c35173bfce9e2cec69f364d551bc8444d7ddd110d867161a3788787856a233253f70f91af6468cdc5aa72994abb2e28da3c4013ab6463c128aa8cef269adda9121c9668e5753c42c2436c48cd9159e7b9297de2b01a2de1c57b74b4f2d27d53cfe37d7f98a5fce0995c813b38ea5c3a31216399042f40e454357dd4ffe57231633c863c975377ebf23df362d0de1179f0f42f14ec370d76273429832230ad0671aaa4d9a430be5a55800b24e15b60f643bf1e768d3b7e62cad0d44c294d0a1545638fa438763ecbae88d04ffc780236cce4984c2aab4f4f4cecca5de28da8db9b748bfed3aebe3adfd39a59947c7f013215f8ea1d4c24a590196fb691c023d305584df078fa8dfdd08aa71b7fe7014543b043285cf4bef188d241fbb826e070913697fa091daef5afe9ba973b19be8a1df7a940265ee6f4823d6c9f60ad0f022a7f15aab00f5f0dcbf89ba3e2d8d44ad40f9c49e91ad9e83b4e112af4f521b38128cad2a6b60393bb17765a565ac6f3c71e504c67a31674dd4d84b8879be55736698fc6a6e3793906d17356e7381e859fb907d46ff";
    const redirectUri = 'http://localhost:3000/';

    const requestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      redirect_uri: redirectUri,
    };

    const response = await axios.post('https://evion.amocrm.ru/oauth2/access_token', requestBody);

    if (response.status === 200) {
      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
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
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIyM2JiNjJlNzA1NjgxOWNjMjljMmNiYzQ1MTIwZjM1ODI0YTk4MDdlNDA0NWRhNjkwZTU2ODQyNjJiNDdmNDAxNDZmYzU2Yjg0MzdhNjBhIn0.eyJhdWQiOiJlNDI3YzNhNC1lN2IxLTQxZjItOWUzNi0yMTZiN2FlZGIwMTgiLCJqdGkiOiJiMjNiYjYyZTcwNTY4MTljYzI5YzJjYmM0NTEyMGYzNTgyNGE5ODA3ZTQwNDVkYTY5MGU1Njg0MjYyYjQ3ZjQwMTQ2ZmM1NmI4NDM3YTYwYSIsImlhdCI6MTY5NDU5ODM3NCwibmJmIjoxNjk0NTk4Mzc0LCJleHAiOjE2OTQ2ODQ3NzQsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzEyMDIxMDIsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6InYyIiwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.EtAyJLBtk6X2jFv55CbmPOfTkMmeXIQctK0MltHJfaDbfMg5WAovFXAtl7mZnVttb_Ua-6dOap0H-L3m208yglR5Vr74AK_BrQJ5ZfiUDV3sYdnv7SxY6Oglt9bWjt0qdIXraumjQ-zn_vh3kOfBfT_V6qj4HpnmexOZGHxCAfm8so4eZ0HPUxYRXWLa0pK2RFDoXmenZCPxxKqhekIsJCz3XPP_hv_f-LZJxH9MfHqxf4Qg0Tm73Yo5-9xRCDvV_t4WPldxrcI7aYK2j_STtHzDWKvEDixDAxwFjiDslNNM5MPpIPiRFQbWxgfMpubdhxYHrQ7bfS6CCfv_b3rjIw`,
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
  const authToken = '"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIyM2JiNjJlNzA1NjgxOWNjMjljMmNiYzQ1MTIwZjM1ODI0YTk4MDdlNDA0NWRhNjkwZTU2ODQyNjJiNDdmNDAxNDZmYzU2Yjg0MzdhNjBhIn0.eyJhdWQiOiJlNDI3YzNhNC1lN2IxLTQxZjItOWUzNi0yMTZiN2FlZGIwMTgiLCJqdGkiOiJiMjNiYjYyZTcwNTY4MTljYzI5YzJjYmM0NTEyMGYzNTgyNGE5ODA3ZTQwNDVkYTY5MGU1Njg0MjYyYjQ3ZjQwMTQ2ZmM1NmI4NDM3YTYwYSIsImlhdCI6MTY5NDU5ODM3NCwibmJmIjoxNjk0NTk4Mzc0LCJleHAiOjE2OTQ2ODQ3NzQsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzEyMDIxMDIsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6InYyIiwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.EtAyJLBtk6X2jFv55CbmPOfTkMmeXIQctK0MltHJfaDbfMg5WAovFXAtl7mZnVttb_Ua-6dOap0H-L3m208yglR5Vr74AK_BrQJ5ZfiUDV3sYdnv7SxY6Oglt9bWjt0qdIXraumjQ-zn_vh3kOfBfT_V6qj4HpnmexOZGHxCAfm8so4eZ0HPUxYRXWLa0pK2RFDoXmenZCPxxKqhekIsJCz3XPP_hv_f-LZJxH9MfHqxf4Qg0Tm73Yo5-9xRCDvV_t4WPldxrcI7aYK2j_STtHzDWKvEDixDAxwFjiDslNNM5MPpIPiRFQbWxgfMpubdhxYHrQ7bfS6CCfv_b3rjIw"'
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