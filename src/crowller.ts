/*
 * @Author: Zero W
 * @Date: 2020-02-13 14:56:06
 * @Description: crowller
 * @FilePath: \tsworm\crowller.ts
 * @LastEditTime : 2020-02-13 15:40:04
 * @LastEditors  : Zero W
 * @-<-zw->-
 */
import superagent from 'superagent';

class Crowller {
  private secret = 'secretKey';
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
  public rawHtml = ''

  async getRawHtml () {
    const result = await superagent.get(this.url)
    this.rawHtml = result.text
  }
  constructor () {
    console.log('crowller constructor')
    this.getRawHtml()
  }
}

const crowller = new Crowller()
 
const timer = setInterval(() => {
  // console.log(crowller)
  console.log(crowller.rawHtml)
  if (crowller.rawHtml) {
    clearInterval(timer)
  }
}, 500);
