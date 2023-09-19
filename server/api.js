import express from 'express';
import axios from 'axios';
import morgan from 'morgan'; 
import cors from 'cors';
import { google } from 'googleapis';
import fs from 'fs/promises';
import process from 'process';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

app.get('/google-sheets/calculator', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }
    
      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
    
      const sheetName = 'Калькулятор TOUCH';
    
      try {
        const response = await sheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range: `${sheetName}!B12`, 
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
  }
});

app.post('/google-sheets/update-dropdown-value', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const cellValue = req.body.newValue; // Получите новое значение из тела запроса

      try {
        // Получите диапазон, связанный с раскрывающимся списком
        const response = await sheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range: `${sheetName}!B12:B12`, // Укажите соответствующий диапазон
        });

        const data = response.data.values;
        if (data.length === 0) {
          console.error('No data found.');
          return res.json({ message: 'No data found' });
        }

        // Обновите значение в этом диапазоне
        const newDropdownValue = [[cellValue]];
        await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B12:B12`,
          valueInputOption: 'RAW',
          resource: { values: newDropdownValue },
        });

        // Теперь значение в ячейке B12 должно быть обновлено
        console.log('Dropdown list value updated successfully.');
        res.json({ message: 'Dropdown list value updated successfully' });
      } catch (error) {
        console.error('Error updating dropdown list value:', error);
        res.status(500).json({ error: 'Error updating dropdown list value' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/google-sheets/update-value1', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B15:B15`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); //B15

app.post('/google-sheets/update-value2', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!C15:C15`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); //C15

app.post('/google-sheets/update-value3', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!D15:D15`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); //D15

app.post('/google-sheets/update-value4', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить
      console.log(newValue);
      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B17:B17`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); //B17

app.post('/google-sheets/update-value5', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить
      console.log('Received new value:', newValue);
      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B21:B21`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); // B21

app.post('/google-sheets/update-value6', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!C21:C21`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); // C21

app.post('/google-sheets/update-value7', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B23:B23`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); // B23

app.post('/google-sheets/update-value8', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B25:B25`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); // B25

app.post('/google-sheets/update-value9', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B27:B27`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); // B27

app.post('/google-sheets/update-value9', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B31:B31`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); // B31

app.post('/google-sheets/update-value10', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
      const sheetName = 'Калькулятор TOUCH';
      const newValue = req.body.newValue; // Значение, которое вы хотите установить

      try {
        const updateResponse = await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!B33:B33`, 
          valueInputOption: 'RAW', // Опция для установки значения
          resource: {
            values: [[newValue]],
          },
        });

        console.log('Cell updated:', updateResponse.data);
        res.json({ message: 'Cell updated successfully' });
      } catch (error) {
        console.error('Error updating cell:', error);
        res.status(500).json({ error: 'Error updating cell' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); // B33

app.get('/google-sheets/result', async (req, res) => {
  try {
    auth.authorize(async (err) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }
    
      const spreadsheetId = '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY';
    
      const sheetName = 'Калькулятор TOUCH';
    
      try {
        const response = await sheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range: `${sheetName}!B62:H62`, 
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
  }
}) // result

async function createPdfFromGoogleSheets(auth) {
  try {
    const sheetsResponse = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: '1A_L5vz3P0nhA4iDOrK9Pi89jdl15vLihaZw70GoTaVY',
      range: 'A62:K102', // Замените на нужный диапазон данных
    });

    const values = sheetsResponse.data.values;
    if (!values || values.length === 0) {
      throw new Error('No data found.');
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);
    const fontBytes = await fs.readFile('../Roboto/Roboto-Regular.ttf');
    const customFont = await pdfDoc.embedFont(fontBytes);

    const content = page.drawText(`Data from Google Sheets:\n${values.join('\n')}`, {
      x: 50,
      y: 350,
      size: 12,
      color: rgb(0, 0, 0),
      font: customFont, // Используйте кастомный шрифт
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
}

app.get('/download-pdf', async (req, res) => {
  try {
    const pdfBytes = await createPdfFromGoogleSheets(auth);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=google_sheets_data.pdf');
    res.send(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating PDF' });
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
    const refresh_token = "def50200b797566a8b914a614c7057c9cc3d2f69fdeac89854d22154adb2d04c7a4d3c42ea1d49e10106eac4f787295931b766e90c1b11845498a98143213c10653a19c1385845a8db7e94fd83e996f42d71ff4fa41c9daef1857ebe71addbafd65b46e3a431a11760294946035688935b117d9f7fce34dfc3647cb241caf34880a984bd974c25dba57aeb02dc22b2d630268463351e31263e3abceb7ebb131732892170cfe6b7b0b52533ea865697aae183529bc5c6d9a2dbbcc24640bc772c9217b329d46411c527acf5ff9f3fff4ba806637c923d7242955f8d73d694e13abdc34e6b89f825924f29aab1e474c55bada3bf6ca375858b8f2f2ced7d510050563905c63f5cf5a1234e0ed0ce4495192047a36b36636d9aeddb45828603b858b8247d46b34bc7c02f82e88500b5e197f083376aee4c579cefadd9a55cf3643ed9b7c74fd65c54dc509046946109044777409a8484e0669d3dd3b763b1e6e3c7de68184935770f5ebe4a898a974179750a797e33859fe7ce21ab62526307410457905976466dce5f2579801fae79ae3478010fa7c490fa00f2856c1cfcb8f6dbe5666a0e50822aabc616929793087b742d807f96a2f98a19bcf10da9c8aaa99ef696749477ea0b1ad2afd4d06b561c86f26637eaa24fc359793a3cd7db5cf0ea2b0359072091b2f2dafd8dfb431ed2ce";
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
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjI0NjVkMDg5MmY0MjU3YzY4NWIzMTMwNzk0MzRkZGUxMzRkNTVkOTU0MjEzNmRiZmFhNjRkODA2NDdlOTllNjRhNzYxOGExNWUxOWU4NzJjIn0.eyJhdWQiOiJlNDI3YzNhNC1lN2IxLTQxZjItOWUzNi0yMTZiN2FlZGIwMTgiLCJqdGkiOiIyNDY1ZDA4OTJmNDI1N2M2ODViMzEzMDc5NDM0ZGRlMTM0ZDU1ZDk1NDIxMzZkYmZhYTY0ZDgwNjQ3ZTk5ZTY0YTc2MThhMTVlMTllODcyYyIsImlhdCI6MTY5NDc1OTc3NCwibmJmIjoxNjk0NzU5Nzc0LCJleHAiOjE2OTQ4NDYxNzQsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzEyMDIxMDIsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6InYyIiwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.PwKFmjyyi6oEYKWtk9iG82LqNsQot3Z1dKm5MpcdNvS17LHAihtA4WOpOp1n07JvbyTy9L9UBkdfEkODsei5WP6qpZEsByWYqAW5oeDQubVAwtNfMqeS_qroeLTVcNjvynb0YjKyu45ujkyXgW04YMiNekf9ahjKwg3_fnuxGixg3xfRv4I_DvRLcLoHv6frI44aTmVxHBOD6fTBzsqeghG-5L-gq_xe8XtxpkftmeJSISqoYSbLzT4NMhxdVHPgwX2X2y3v9xpjsra9fPlvWJArdxCRPcfTiiw2MS6j-8cNdL39NLJjBIepJLdg3kmh4UOIwpyk6oNpiL7hvZXPKg`,
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
  const authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjI0NjVkMDg5MmY0MjU3YzY4NWIzMTMwNzk0MzRkZGUxMzRkNTVkOTU0MjEzNmRiZmFhNjRkODA2NDdlOTllNjRhNzYxOGExNWUxOWU4NzJjIn0.eyJhdWQiOiJlNDI3YzNhNC1lN2IxLTQxZjItOWUzNi0yMTZiN2FlZGIwMTgiLCJqdGkiOiIyNDY1ZDA4OTJmNDI1N2M2ODViMzEzMDc5NDM0ZGRlMTM0ZDU1ZDk1NDIxMzZkYmZhYTY0ZDgwNjQ3ZTk5ZTY0YTc2MThhMTVlMTllODcyYyIsImlhdCI6MTY5NDc1OTc3NCwibmJmIjoxNjk0NzU5Nzc0LCJleHAiOjE2OTQ4NDYxNzQsInN1YiI6Ijk4OTM5NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzEyMDIxMDIsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6InYyIiwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.PwKFmjyyi6oEYKWtk9iG82LqNsQot3Z1dKm5MpcdNvS17LHAihtA4WOpOp1n07JvbyTy9L9UBkdfEkODsei5WP6qpZEsByWYqAW5oeDQubVAwtNfMqeS_qroeLTVcNjvynb0YjKyu45ujkyXgW04YMiNekf9ahjKwg3_fnuxGixg3xfRv4I_DvRLcLoHv6frI44aTmVxHBOD6fTBzsqeghG-5L-gq_xe8XtxpkftmeJSISqoYSbLzT4NMhxdVHPgwX2X2y3v9xpjsra9fPlvWJArdxCRPcfTiiw2MS6j-8cNdL39NLJjBIepJLdg3kmh4UOIwpyk6oNpiL7hvZXPKg";
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