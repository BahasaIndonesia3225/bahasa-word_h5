import React, { useState, useEffect } from 'react'
import {SearchBar} from 'antd-mobile'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import "./index.less"

const aiDialogue = () => {
  const [remark, setRemark] = useState("");
  const [dialogue, setDialogue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamWords, setStreamWords] = useState("");

  const url = process.env.NODE_ENV === 'development' ?
    '/compatible-mode/v1/chat/completions' :
    'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
  const queryAiAnswer = () => {
    let index = 0;
    let wordsArray = [];
    const controller = new AbortController()
    const signal = controller.signal
    fetchEventSource(url, {
      method: 'POST',
      signal: signal,
      headers: {
        "Authorization": 'Bearer' + 'sk-ab3033f199eb4bcd93ea82f4c76cd117',
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "qwen-plus",
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": remark
          },
        ],
        "stream": true,
        "parameters": {}
      }),
      onopen(e) {
        if(e.ok) {
          setLoading(true);
          console.log("链接建立")
        }
      },
      onmessage(ev) {
        const { data } = ev;
        if(data !== "[DONE]") {
          const message = JSON.parse(data);
          const content = message.choices[0].delta.content.replaceAll("\n", "<br/>");
          //模仿chatGPT输出效果
          index += 100;
          setTimeout(() => {
            setStreamWords(v => v + content);
          }, index);
          wordsArray.push(content);
        }
      },
      onerror() {
        setLoading(false);
        controller.abort();
        console.log("链接错误")
      },
      onclose() {
        setLoading(false);
        controller.abort();
        console.log("链接关闭")
        //保存会话

        console.log(wordsArray)

        // setDialogue([
        //   ...dialogue,
        //   { type: 'me', txt: remark },
        //   { type: 'ai', txt: words }
        // ])


      }
    })
  }

  useEffect(() => {
    if(remark) queryAiAnswer()
  }, [remark])

  return (
    <div className='aiDialogue'>
      <div className="chapterAttention">
        <SearchBar
          placeholder='仅限输入葡萄牙语单词'
          showCancelButton
          style={{
            '--border-radius': '16px',
            '--background': '#ffffff',
            '--height': '32px',
            '--padding-left': '12px',
          }}
          onSearch={val => {
            setRemark(val)
          }}
        />
      </div>
      <div className="chapterContain">
        <ul className="dialogue">
          <li className='ai'>
            <div className='stream' dangerouslySetInnerHTML={{__html: streamWords}}></div>
          </li>
          {
            dialogue.map((item, index) => {
              return (
                <li key={index} className={item.type}>
                  <div>
                    {item.txt}
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default aiDialogue
