import React, { useEffect, useState } from 'react'
import { connect } from 'umi';
import { Space, Collapse, Switch, Button, Empty, Modal, Card, NoticeBar } from 'antd-mobile'
import { SoundOutline, StarFill } from 'antd-mobile-icons';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyPdfDocument from './print/MyDocument';
import { request } from '@/services';
import "./index.less"

const courseWord = (props) => {
  const [showChinese, setShowChinese] = useState(true);
  const [showType, setShowType] = useState(true);
  const [showSentence, setShowSentence] = useState(true)
  const [showWrite, setShowWrite] = useState(true);
  const [collectedWord, setCollectedWord] = useState([]);

  const getCollectedWord = () => {
    request.get('/prod-api/collectApi/selectQuestionListByUserId', {
      params: {
        pageSize: 1000,
        pageNum: 1,
      }
    }).then(res => {
      const { rows } = res;
      setCollectedWord(rows);
    })
  }
  useEffect(() => { getCollectedWord() }, [])

  //播放音频相关
  const audio = new Audio();
  let itemID = null;
  const once = function () {
    audio.removeEventListener('error', once);
    Modal.alert({
      content: '这个单词还没有录音哦～',
      onConfirm: () => {
        console.log('Confirmed')
      },
    })
    request.post('/prod-api/system/err', { data: { wordId: itemID } });
  }
  const playAudio = (data) => {
    const { soundRecording, id } = data;
    itemID = id;
    audio.src = soundRecording;
    audio.addEventListener('canplaythrough', () => {
      audio.play();
    })
    audio.addEventListener('error', once);
    audio.load()
  }

  const setSentence = (txt) => {
    let txt1 = txt.replace(/(【例句\d*】)/g, "<br>$1");
    txt1 = txt1.replace(/(【欧葡例句\d*】)/g, "<br>$1");
    txt1 = txt1.replace(/(【巴葡例句\d*】)/g, "<br>$1");
    return txt1.replace(/(【.*?】)/g, '<span class="highlight">$1</span>')
  }

  //收藏功能相关
  const collectAudio = (data) => {
    const { id } = data;
    request.post('/prod-api/collectApi/collect', {
      data: { questionId: id }
    }).then(res => {
      getCollectedWord()
    })
  }

  return (
    <div className='courseDetail'>
      <NoticeBar
        style={{
          marginBottom: 12,
          borderRadius: 16,
          '--background-color': '#ffffff',
          '--border-color': '#ffffff'
        }}
        closeable={false}
        content="欢迎使用我的东东单词本功能，同学们可以将东东单词卡的单词整理纳入东东单词本中，打造属于自己独一无二的印尼语单词本。目前东东单词本已经开启云同步功能，同学们可以在不同设备登陆查看自己整理的单词。手动录入单词功能正在开发中，预计本月可用～"
        color='info'
        wrap
      />
      <div className="chapterAttention">
        <PDFDownloadLink document={<MyPdfDocument data={collectedWord} />} fileName="我的收藏.pdf">
          {
            ({ blob, url, loading, error }) => {
              return <Button
                className="downloadBtn"
                color='primary'
                size='mini'
                fill='outline'>
                { loading ? '导出准备中…' : '导出单词本(仅限电脑)' }
              </Button>
            }
          }
        </PDFDownloadLink>
        <p>我的东东单词本</p>
        <div className="courseNum">
          <span>共{collectedWord.length}个词汇</span>
        </div>
        <Space>
          <Switch
            style={{
              '--checked-color': 'rgba(244, 88, 86, 1)',
              '--height': '18px',
              '--width': '30px',
            }}
            checkedText={<span>音节</span>}
            uncheckedText={<span>音节</span>}
            checked={showType}
            onChange={async val => {
              setShowType(val)
            }}
          />
          <Switch
            style={{
              '--checked-color': 'rgba(244, 88, 86, 1)',
              '--height': '18px',
              '--width': '30px',
            }}
            checkedText={<span>中文释义</span>}
            uncheckedText={<span>中文释义</span>}
            checked={showChinese}
            onChange={async val => {
              setShowChinese(val)
            }}
          />
          <Switch
            style={{
              '--checked-color': 'rgba(244, 88, 86, 1)',
              '--height': '18px',
              '--width': '30px',
            }}
            checkedText={<span>单词解释</span>}
            uncheckedText={<span>单词解释</span>}
            checked={showSentence}
            onChange={async val => {
              setShowSentence(val)
            }}
          />
          <Switch
            style={{
              '--checked-color': 'rgba(244, 88, 86, 1)',
              '--height': '18px',
              '--width': '30px',
            }}
            checkedText={<span>默写</span>}
            uncheckedText={<span>默写</span>}
            checked={showWrite}
            onChange={async val => {
              setShowWrite(val)
            }}
          />
        </Space>
      </div>
      <div className="chapterContain">
        {
          collectedWord.length ? (
            <Collapse
              defaultActiveKey={['0']}
            >
              {
                collectedWord.map((item, index) => (
                  <Collapse.Panel
                    key={index}
                    title={
                      <div className="courseTitle">
                        <div className="index">
                          <span>{index + 1}</span>
                        </div>
                        <div className='content'>
                          <div>
                            <span className='title'>{showWrite ? item.remark : item.chinese}</span>
                          </div>
                          <div>
                            <span>{showChinese && item.chinese}</span>
                          </div>
                        </div>
                      </div>
                    }>
                    <Card
                      title={
                        <Space justify='end' block>
                          <Button
                            className="playAudioBtn"
                            onClick={(() => playAudio(item))}
                            color='primary'
                            size='mini'
                            fill='outline'>
                            <SoundOutline fontSize={16} color='#166cfe'/>
                          </Button>
                          <Button
                            className="collectBtn"
                            onClick={(() => collectAudio(item))}
                            color='primary'
                            size='mini'
                            fill='outline'>
                            {
                              collectedWord.some(d => d.id === item.id) ?
                                <StarFill fontSize={16} color='#166cfe'/> :
                                <StarOutline fontSize={16} color='#166cfe'/>
                            }
                          </Button>
                        </Space>
                      }
                    >
                      <div className='courseContent'>
                        {
                          showChinese && <div>
                            <span>【中文释义】：</span>
                            <span>{item.chinese}</span>
                          </div>
                        }
                        {
                          showType && <div>
                            <span>【音节划分】：</span>
                            <span>{item.type}</span>
                          </div>
                        }
                        {
                          showSentence && <div>
                            <span dangerouslySetInnerHTML={{__html: setSentence(item.sentence)}}></span>
                          </div>
                        }
                      </div>
                    </Card>
                  </Collapse.Panel>
                ))
              }
            </Collapse>
          ) : <Empty description='暂无数据' style={{marginTop: '50%'}}/>
        }
      </div>
    </div>
  )
}

export default connect((state) => {
  return {
    collectWord: state.user.collectWord
  }
})(courseWord)
