const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const low = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');

const adapter = new fileSync('db.json');
const db = low(adapter);
const app = express();
const bodyParserMiddleware = bodyParser.urlencoded({ extended: false });
const authMiddleware = basicAuth({
  users: { 'admin': 'super' },
  challenge: true,
  realm: 'Imb4T3st4pp'
})

db.defaults({
  data: [
    {
      id: parseInt(moment().format("YYYYMMDDHHmmssSSS")),
      title: '테스트 게시물1',
      content: '선거에 관한 경비는 법률이 정하는 경우를 제외하고는 정당 또는 후보자에게 부담시킬 수 없다. 대통령은 국가의 안위에 관계되는 중대한 교전상태에 있어서 국가를 보위하기 위하여 긴급한 조치가 필요하고 국회의 집회가 불가능한 때에 한하여 법률의 효력을 가지는 명령을 발할 수 있다. 이 헌법시행 당시의 대법원장과 대법원판사가 아닌 법관은 제1항 단서의 규정에 불구하고 이 헌법에 의하여 임명된 것으로 본다. 일반사면을 명하려면 국회의 동의를 얻어야 한다.',
      date: moment().format("YYYY-MM-DD HH:mm:ss")
    }
  ],
  comments: [
    {
      id: parseInt(moment().format("YYYYMMDDHHmmssSSS")),
      comment: "코멘트",
      name: "닉네임",
      date: moment().format("YYYY-MM-DD HH:mm:ss")
    }
  ]
}).write();

app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.use(morgan('tiny'));

// 게시물 목록 페이지
app.get('/', (req, res) => {
  const articles = db.get('data').value()
  res.render('index.ejs', {articles})
})

// 게시물 상세 페이지
app.get('/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const article = db.get('data').find({id}).value()
  const comments = db.get('comments').filter({id: id}).value()

  if (!article) {
    return res.status(404).send('404 Not Found')
  }
  res.render('articles', {article, comments})
})

// 게시물 작성 페이지
app.get('/write', (req, res) => {
  res.render('write');
})

app.post('/write', bodyParserMiddleware, (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const id =  parseInt(moment().format("YYYYMMDDHHmmssSSS"));
  const date =  moment().format("YYYY-MM-DD HH:mm:ss");
  const data = db.get('data').value();

  db.get('data').push({id, title, content, date}).write();
  res.redirect('/');
})

// 덧글 작성
app.post('/comment/:id', bodyParserMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const comment = req.body.commentInput;
  const name = req.body.commentName;
  const date = moment().format("YYYY-MM-DD HH:mm:ss");

  if(!id) {
    return res.status(404).send('404 Not Found')
  }

  db.get('comments').push({id, comment, name, date}).write();
  res.redirect(`/articles/${id}`)
})

// 관리자 화면
app.get('/admin', authMiddleware, (req, res) => {
  const articles = db.get('data').value();
  res.render('admin', {articles});
});

app.post('/admin/:id', bodyParserMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  if(!id) {return res.status(404).send('404 Not Found')};
  db.get('data').remove({id}).write();
  db.get('comments').remove({id: id}).write();

  res.redirect('/admin');
})

app.listen(3000, () => {
  console.log('listening...')
})
