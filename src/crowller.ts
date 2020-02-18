/*
 * @Author: Zero W
 * @Date: 2020-02-13 14:56:06
 * @Description: crowller
 * @LastEditTime : 2020-02-18 11:36:03
 * @LastEditors  : Zero W
 * @-<-zw->-
 */
import superagent from 'superagent';
import fs from 'fs';
import path from 'path';
import analyzer from './analyzer';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string
}

class Crowller {
  // private rawHtml = '';
  // public crowData: unknown
  private FilePath = path.resolve(__dirname, '../data/course.json')

  async getRawHtml () {
    const result = await superagent.get(this.url);
    return result.text;
    // this.getHtmlData(this.rawHtml)
  }

  writeFile (content: string) {
    const filePath = this.FilePath
    fs.writeFileSync(filePath, content)
  }

  async initSpiderProcess () {
    
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.FilePath)
    this.writeFile(fileContent)
  }

  constructor (private url: string, private analyzer: Analyzer) {
    console.log('crowller constructor');
    this.initSpiderProcess();
  }
}

const secret = 'secretKey';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const workingAnalyzer = new analyzer()
new Crowller(url, workingAnalyzer);
 
// const timer = setInterval(() => {
//   // console.log(crowller)
//   console.log(crowller.crowData);
//   if (crowller.crowData) {
//     clearInterval(timer);
//   }
// }, 500);
