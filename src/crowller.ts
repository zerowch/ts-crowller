/*
 * @Author: Zero W
 * @Date: 2020-02-13 14:56:06
 * @Description: crowller
 * @LastEditTime : 2020-02-14 17:23:01
 * @LastEditors  : Zero W
 * @-<-zw->-
 */
import superagent from 'superagent';
import cheerio from 'cheerio';

import fs from 'fs';
import path from 'path';

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

class Crowller {
  private secret = 'secretKey';
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  // private rawHtml = '';
  // public crowData: unknown

  private getCourseInfo (html: string) {
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

    return {
      time: new Date().getTime(),
      data: course
    }
  }

  async getRawHtml () {
    const result = await superagent.get(this.url);
    return result.text;
    // this.getHtmlData(this.rawHtml)
  }

  async generateJsonContent (courseInfo: CourseResult) {
    const filePath = path.resolve(__dirname, '../data/course.json')
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      const readContent = fs.readFileSync(filePath, 'utf-8')
      try {
        fileContent = JSON.parse(readContent);
      } catch (error) {
        console.log('原文件json数据格式有误')
      }
    }
    fileContent[courseInfo.time] = courseInfo.data;
    console.log(fileContent)
    fs.writeFileSync(filePath, JSON.stringify(fileContent));
  }

  async initSpiderProcess () {
    const html = await this.getRawHtml()
    const courseInfo = this.getCourseInfo(html)

    this.generateJsonContent(courseInfo)
  }

  constructor () {
    console.log('crowller constructor');
    this.initSpiderProcess();
  }
}

const crowller = new Crowller();
 
// const timer = setInterval(() => {
//   // console.log(crowller)
//   console.log(crowller.crowData);
//   if (crowller.crowData) {
//     clearInterval(timer);
//   }
// }, 500);
