const express = require('express');
//Node.js用のウェブフレイムワークであるexpressモジュールをインポートしており、
//express モジュールはウェブサーバーを作成し、HTTP リクエストとレスポンスを処理するために使用される
const sqlite3 = require('sqlite3').verbose();
//sqlite3 モジュールは SQLite データベースを操作するための機能を提供します。
//require: これは Node.js でモジュールをインポートするためのキーワード
//verbose: これは sqlite3 モジュールに特有のプロパティです。verbose プロパティを指定することで、より詳細なログ情報を取得できる
const bodyParser = require('body-parser');
//このコードは Node.js 用のウェブフレームワークである express アプリケーションで、
//HTTP リクエストのボディを解析するために body-parser モジュールをインポートしています
const cors = require('cors');
//オリジン間リソース共有 (CORS)を処理するために cors モジュールをインポートしている
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');


const app = express();
const port = 5000;
//const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// SQLiteデータベースの設定
const db = new sqlite3.Database('mydatabase.db'); // ファイルデータベースを使用
//mydatabase.db というファイル名の SQLite データベースに接続するためのコード
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS Data (id INTEGER PRIMARY KEY, name TEXT, value TEXT)');
});

// APIエンドポイントの定義
app.post('/api/data', (req, res) => {
  const { name, value } = req.body;

  db.run('INSERT INTO Data (name, value) VALUES (?, ?)', [name, value], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.status(201).json({ id: this.lastID, name, value });
  });
});

app.get('/api/data', (res) => {
  db.all('SELECT * FROM Data', (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).json(rows);
  });
});

app.delete('/api/data/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Received DELETE request for todo ID: ${id}`);
  
  db.run('DELETE FROM Data WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.status(200).json({ message: 'タスクが削除されました', id });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
