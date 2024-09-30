import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontFamily:'ariblk',
    backgroundImage: 'url(http://taioassets.oss-cn-beijing.aliyuncs.com/Pics/DongDictionary/home_bg.png)'
  },
  image: {
    width: '30%',
    height: 'auto',
  },
  section: {
    margin: 6,
    paddingBottom: 6,
    borderBottom: '1px solid #ccc',
  },
  title: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'left'
  },
  imageBottom: {
    width: '20%',
    height: 'auto',
    position: 'absolute',
    bottom: 12,
    right: 0,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 12,
    right: 12,
    left: 12,
    textAlign: 'center',
    color: 'grey',
  },
});

const logo = require('./logo_word.png');
const logo_bottom = require('./logo_word_buttom.png');

// 注册本地下载的字体文件并使用它就可以解决中文乱码的问题
const fontFile = require('./AlibabaPuHuiTi-3-55-Regular.ttf');
Font.register({
  family: 'ariblk',
  src: fontFile
});
// 超出宽度自动换行
Font.registerHyphenationCallback((word) => {
  // 1.  如果单词只有一个字符，直接返回单个字符。
  // 1.  如果单词长度大于 1，将单词拆分为单个字符的数组，并在每个字符之间插入一个空字符串，以表示单词的断开。
  if (word.length === 1) {
    return [word];
  }
  return Array.from(word)
    .map((char) => [char, ''])
    .reduce((arr, current) => {
      arr.push(...current);
      return arr;
    }, []);
});

// 创建pdf文档
const MyDocument = (props) => {
  const { data } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View fixed>
          <Image src={logo} style={styles.image} />
        </View>
        {
          data.map((item, index) => {
            const {remark, chinese, type, sentence} = item;
            return (
              <View style={styles.section} break={index !==0 && index % 3 === 0} key={index}>
                <Text style={styles.title}>
                  单词：{remark}
                </Text>
                <Text style={styles.title}>
                  中文释义：{chinese}
                </Text>
                <Text style={styles.title}>
                  音节划分：{type}
                </Text>
                <Text style={styles.title}>
                  单词解释：{sentence}
                </Text>
              </View>
            )
          })
        }
        <View fixed style={styles.imageBottom}>
          <Image src={logo_bottom} />
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  )
}

export default MyDocument

