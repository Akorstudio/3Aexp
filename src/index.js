import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
const app = express();

let pc = {};

fetch(pcUrl)
  .then(async (res) => {
      console.log('Стартуем!');
    pc = await res.json();
    app.listen(3000, () => {
      console.log('Порт готов #3000', pc);
    });
  })
  .catch(err => {
      console.log('Что то пошло не так..', err);
  });

function deepFind(obj, path) {
      let current = obj;
      for(let id of path) {
          if(!id || current == void(0)) break;
          if(current.constructor()[id] !== void(0)) return void(0);
          current = current[id]; }
      return current;
}

  app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', 'Orogin, X-Requested-With, Content-Type, Accept');
      next();
  });

  app.get('/volumes', (req, res)=>{
      let current = {};
      pc.hdd.forEach((Disk) => { current[Disk.volume] = current[Disk.volume]?current[Disk.volume]+Disk.size:Disk.size; })
      for (let Disk in current) { current[Disk] += 'B' }
      console.log('Диски: ', current);
      res.status(200).send(JSON.stringify(current));
  });

  app.get(/[\w\/-]*/, (req, res) => {
      let patch = (req.url.slice(1)).split('/');
      let result = deepFind(pc, patch);
      if(typeof result == "undefined")
      throw new Error('No data');
      else res.send(JSON.stringify(result));
  });

  app.use(function(err, req, res, next) {
      res.status(404).send('Not Found');
  })
