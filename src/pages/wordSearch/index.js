import React, { useState, useEffect, useRef } from 'react'
import {connect, useLocation } from 'umi';
import {SearchBar, Collapse, Button} from 'antd-mobile'
import { SoundOutline } from 'antd-mobile-icons'
import { request } from '@/services';
import "./index.less"

const courseCatalog = (props) => {
  //设置默认参数
  const stateParams = useLocation();
  let { remark: defaultRemark } = stateParams.state;
  const [remark, setRemark] = useState(defaultRemark);
  const [wordsData, setWordsData] = useState([]);
  const [total, setTotal] = useState(0);

  const searchRef = useRef(null)
  setTimeout(() => {
    searchRef.current?.focus()
  }, 100)

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

  const attentionWord = (str) => {
    return str.split(remark).join("<span style='color: red'>" + remark + "</span>")
  }

  //搜索单词
  const querySearchWord = () => {
    const params = `remark=${remark}&pageSize=200`
    request.get('/prod-api//WordApiController/list?' + params)
      .then(res => {
        const { total, rows } = res;
        setWordsData(rows)
        setTotal(total)
      })
  }
  useEffect(() => {
    querySearchWord()
  }, [remark])

  return (
    <div className='wordSearch'>
      <div className="chapterAttention">
        <SearchBar
          ref={searchRef}
          style={{
            '--border-radius': '16px',
            '--background': '#ffffff',
            '--height': '32px',
            '--padding-left': '12px',
          }}
          placeholder='仅限输入葡萄牙语单词'
          showCancelButton
          defaultValue={remark}
          onSearch={val => {
            setRemark(val)
          }}
        />
      </div>
      <div className="chapterAttention" style={{ textAlign: 'right' }}>
        <span>共检索出{total}个词汇</span>
      </div>
      <div className="chapterContain">
        <Collapse defaultActiveKey={['0']}>
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
                      <span dangerouslySetInnerHTML={{__html: attentionWord(item.remark)}}></span>
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
                    <SoundOutline fontSize={18} color='#166cfe'/>
                  </Button>
                  <div>
                    <span>中文释义：</span>
                    <span>{item.chinese}</span>
                  </div>
                  <div>
                    <span>音节划分：</span>
                    <span>{item.type}</span>
                  </div>
                  <div>
                    <span>单词解释：</span>
                    <span>{item.sentence}</span>
                  </div>
                </div>
              </Collapse.Panel>
            ))
          }
        </Collapse>
      </div>
    </div>
  )
}

export default courseCatalog
