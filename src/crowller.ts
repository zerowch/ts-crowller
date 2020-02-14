/*
 * @Author: Zero W
 * @Date: 2020-02-13 14:56:06
 * @Description: crowller
 * @LastEditTime : 2020-02-14 15:05:34
 * @LastEditors  : Zero W
 * @-<-zw->-
 */
import superagent from 'superagent';
import cheerio from 'cheerio';

interface Course {
  title: string,
  count: number
}

interface CrowData {
  time: number;
  data: []
}

class Crowller {
  private secret = 'secretKey';
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  private rawHtml = '';
  public crowData: unknown

  private getHtmlData (html: string) {
    const $ = cheerio.load(html)
    const courseItems = $('.course-item');
    // console.log(typeof courseItems)
    let course: Course[] = []
    courseItems.map((index, element) => {
      const desc = $(element).find('.course-desc');
      const title = desc.eq(0).text();
      const count = parseInt(desc.eq(1).text().split('：')[1])


      course.push({
        title,
        count
      })
    })

    this.crowData = {
      time: new Date().getTime(),
      data: course
    }
  }

  async getRawHtml () {
    const result = await superagent.get(this.url);
    this.rawHtml = result.text;
    this.getHtmlData(this.rawHtml)
  }
  constructor () {
    console.log('crowller constructor');
    this.getRawHtml();
  }
}

const crowller = new Crowller();
 
const timer = setInterval(() => {
  // console.log(crowller)
  console.log(crowller.crowData);
  if (crowller.crowData) {
    clearInterval(timer);
  }
}, 500);
