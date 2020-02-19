/*
 * @Author: Zero W
 * @Date: 2020-02-18 09:49:13
 * @Description: 
 * @LastEditTime : 2020-02-19 08:57:57
 * @LastEditors  : Zero W
 * @-<-zw->-
 */

import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowller'

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

export default class analyzer implements Analyzer {
  constructor() {}
  
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

  private generateJsonContent (courseInfo: CourseResult, filePath: string) {
    // const filePath = this.FilePath
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      const readContent = fs.readFileSync(filePath, 'utf-8')
      try {
        fileContent = JSON.parse(readContent);
        fileContent[courseInfo.time] = courseInfo.data;
      } catch (error) {
        console.log('原文件json数据格式有误')
        fileContent = {}
      }
    }
    // console.log(fileContent)
    return fileContent
  }

  public analyze (html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo, filePath)

    return JSON.stringify(fileContent)
  }
}