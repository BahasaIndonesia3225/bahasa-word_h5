import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, connect } from 'umi';
import { Space, Collapse, Switch, Button, Skeleton, Empty, NoticeBar, Modal, FloatingBubble, Card, Image } from 'antd-mobile'
import { SoundOutline, StarOutline, StarFill, AntOutline } from 'antd-mobile-icons';
import { request } from '@/services';
import "./index.less"

const courseDetail = () => {
  const stateParams = useLocation();
  const navigate = useNavigate();
  const { categoryId, categoryName } = stateParams.state;

  const [showChinese, setShowChinese] = useState(true);
  const [showType, setShowType] = useState(true);
  const [showSentence, setShowSentence] = useState(true)
  const [showWrite, setShowWrite] = useState(true);

  //获取单词列表相关
  const [loading, setLoading] = useState(false)
  const [wordsData, setWordsData] = useState([]);
  const queryWords = () => {
    setLoading(true)
    request.get('/prod-api//WordApiController/list', {
      params: {
        pageSize: 1000,
        pageNum: 1,
        categoryId
      }
    }).then(res => {
      const { code, rows, total } = res;
      setLoading(false)
      setWordsData(rows)
    })
  }
  useEffect(() => { queryWords() }, [])

  //获取收藏单词列表相关
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

  //收藏功能相关
  const collectAudio = (data) => {
    const { id } = data;
    request.post('/prod-api/collectApi/collect', {
      data: { questionId: id }
    }).then(res => {
      getCollectedWord()
    })
  }

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

  //跳转到收藏界面
  const onGoCollectPage = () => {
    navigate("/collectWord", { replace: false })
  }

  return (
    <div className='courseDetail'>
      <FloatingBubble
        style={{
          '--initial-position-bottom': '24px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
          '--background': '#cccccc'
        }}
        onClick={onGoCollectPage}
      >
        <Image
          width={28}
          height={28}
          src='./image/collectImg.jpg'
        />
      </FloatingBubble>
      <div className="chapterAttention">
        <p>{categoryName}</p>
        <div className="courseNum">
          <span>共{wordsData.length}个词汇</span>
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
        content='所有录音均为外教老师真人发音，部分单词录音正在完善中...'
        closeable
        color='info' />
      <div className="chapterContain">
        {
          loading ? (
            <>
              <Skeleton.Title animated/>
              <Skeleton.Paragraph lineCount={5} animated/>
              <Skeleton.Title animated/>
              <Skeleton.Paragraph lineCount={5} animated/>
              <Skeleton.Title animated/>
              <Skeleton.Paragraph lineCount={5} animated/>
            </>
          ) : (
            wordsData.length ? (
              <Collapse
                defaultActiveKey={['0']}
              >
                {
                  wordsData.map((item, index) => (
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
          )
        }
      </div>
    </div>
  )
}

export default connect((state) => {
  return {
    collectWord: state.user.collectWord
  }
})(courseDetail)
