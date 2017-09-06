const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
// const data = require("./data");

const app = express();
const bodyParserMiddleware = bodyParser.urlencoded({ extended: false });

const articles = [
  {
    id: '1',
    title: '제목입니다',
    content: '사회적 특수계급의 제도는 인정되지 아니하며, 어떠한 형태로도 이를 창설할 수 없다. 국가는 농·어민과 중소기업의 자조조직을 육성하여야 하며, 그 자율적 활동과 발전을 보장한다. 정당은 법률이 정하는 바에 의하여 국가의 보호를 받으며, 국가는 법률이 정하는 바에 의하여 정당운영에 필요한 자금을 보조할 수 있다. 국회는 정부의 동의없이 정부가 제출한 지출예산 각항의 금액을 증가하거나 새 비목을 설치할 수 없다.',
    comments: ['코멘트 테스트', '코멘트 테스트2']
  },
  {
    id: '2',
    title: '제목2',
    content: '내용2'
  }
];

const comments = [
  {
    target: 1,
    content: '코멘트 테스트'
  },
  {
    target: 1,
    content: '코멘트 테스트'
  },
  {
    target: 2,
    content: '코멘트 2 테스트'
  }
]

app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.use(morgan('tiny'));

// 게시판 목록 페이지
app.get('/', (req, res) => {
  res.render('index.ejs', {articles})
});

// 게시판 상세 페이지
app.get('/articles/:id', (req, res) => {
  const article = articles.find(t => t.id === req.params.id);
  if (article) {
    res.render('articles.ejs', {article});
  }  else {
    res.status(404);
    res.send('404 Not Found');
  };
});

app.listen(3000, () => {
  console.log('listening...')
});
