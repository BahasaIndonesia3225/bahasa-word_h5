import React, { useEffect, useState } from 'react'
import { connect } from 'umi';
import { getCollectWord, setCollectWord, clearCollectWord } from "@/utils/collectWord";
import { Space, Collapse, Switch, Button, Empty, NoticeBar, Modal } from 'antd-mobile'
import { SoundOutline, StarFill, DownlandOutline } from 'antd-mobile-icons';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import MyPdfDocument from './print/MyDocument';
import "./index.less"

const courseWord = (props) => {
  const [collectedWord, setCollectedWord] = useState(props.collectWord);

  const [showChinese, setShowChinese] = useState(true);
  const [showType, setShowType] = useState(true);
  const [showSentence, setShowSentence] = useState(true)
  const [showWrite, setShowWrite] = useState(true);

  //播放音频相关
  const audio = new Audio();
  const once = function () {
    audio.removeEventListener('error', once);
    Modal.alert({
      content: '这个单词还没有录音哦～',
      onConfirm: () => {
        console.log('Confirmed')
      },
    })
  }
  const playAudio = (data) => {
    const { soundRecording } = data;
    audio.src = soundRecording;
    audio.addEventListener('canplaythrough', () => {
      audio.play();
    })
    audio.addEventListener('error', once);
    audio.load()
  }

  //收藏功能相关
  const collectAudio = (data) => {
    let data_ = getCollectWord();
    if(data_.some(item => item.id === data.id)) {
      data_ = data_.filter(item => item.id !== data.id);
    }else {
      data_.push(data);
    }
    props.dispatch({
      type: "user/changeCollectWord",
      payload: data_
    })
    setCollectedWord(data_);
  }

  return (
    <div className='courseDetail'>
      <div className="chapterAttention">
        <PDFDownloadLink document={<MyPdfDocument data={collectedWord} />} fileName="我的收藏.pdf">
          {
            ({ blob, url, loading, error }) => {
              return <Button
                className="downloadBtn"
                color='primary'
                size='mini'
                fill='outline'>
                { loading ? '导出准备中…' : '导出PDF' }
              </Button>
            }
          }
        </PDFDownloadLink>
        <p>我的收藏</p>
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
      <NoticeBar
        style={{
          marginBottom: 12,
          borderRadius: 16,
          '--background-color': '#ffffff',
          '--border-color': '#ffffff'
        }}
        content='收藏数据仅保存于本地缓存'
        closeable
        wrap
        color='info' />
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
                    <div className='courseContent'>
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
                        <StarFill fontSize={16} color='#166cfe'/>
                      </Button>
                      {
                        showChinese && <div>
                          <span>中文释义：</span>
                          <span>{item.chinese}</span>
                        </div>
                      }
                      {
                        showType && <div>
                          <span>音节划分：</span>
                          <span>{item.type}</span>
                        </div>
                      }
                      {
                        showSentence && <div>
                          <span>单词解释：</span>
                          <span>{item.sentence}</span>
                        </div>
                      }
                    </div>
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
