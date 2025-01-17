import React, { useState } from 'react';
import { useXAgent, useXChat, Sender, Bubble, XRequest, Welcome  } from '@ant-design/x';
import { Avatar, Space, Button, NoticeBar } from 'antd-mobile'
import { UserOutline, LoopOutline, TextOutline, UpCircleOutline } from 'antd-mobile-icons';
import "./index.less"

const { create } = XRequest({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  dangerouslyApiKey: 'sk-ab3033f199eb4bcd93ea82f4c76cd117',
  model: 'qwen-plus',
});
const AvatarUrl = "https://taioassets.oss-cn-beijing.aliyuncs.com/Pics/DongMultiFruit/aiLogo.png"

const roles = {
  ai: {
    placement: 'start',
    avatar: { icon: <Avatar src={AvatarUrl} /> },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
    header: '小曼同学',
    footer: (
      <Space style={{ '--gap': '0' }}>
        <Button color='primary' fill='none' size="small">
          <LoopOutline />
        </Button>
        <Button color='primary' fill='none' size="small">
          <TextOutline />
        </Button>
      </Space>
    )
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutline />, style: { background: '#87d068' } },
  },
}

const aiDialogue = () => {
  const listRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;
      const { onUpdate } = callbacks;
      let content = '';

      try {
        create(
          {
            messages: [{ role: 'user', content: message }],
            stream: true,
          },
          {
            onSuccess: (chunks) => {
              console.log('sse chunk list', chunks);
            },
            onError: (error) => {
              console.log('error', error);
            },
            onUpdate: (chunk) => {
              const { data } = chunk;
              if(data.indexOf('[DONE]') === -1) {
                const message = JSON.parse(data);
                content += message?.choices[0].delta.content;
                onUpdate(content);
              }
            },
          },
        );
      } catch (error) {}
    },
  });

  const { onRequest, messages } = useXChat({ agent });
  const items = messages.map(({ message, id }, i) => {
    const isAI = !!(i % 2);
    return {
      key: i,
      role: isAI ? 'ai' : 'user',
      content: message,
    }
  });

  return (
    <div className='aiDialogue'>
      <Welcome
        style={{
          marginBottom: '12px',
          backgroundImage: 'linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%)'
        }}
        icon="https://taioassets.oss-cn-beijing.aliyuncs.com/Pics/DongMultiFruit/aiLogo.png"
        title="你好, 我是小曼同学"
        description="希望在您学习的道路上，我们帮助您更快的成长~"
        extra={
          <Space>
            <Button color='primary' fill='none' onClick={() => {
              listRef.current?.scrollTo({
                key: 0,
                block: 'nearest',
              });
            }}>
              <UpCircleOutline />
            </Button>
          </Space>
        }
      />
      <Bubble.List
        ref={listRef}
        className="myBubbleList"
        autoScroll={true}
        items={items}
        roles={roles}
      />
      <Sender
        allowSpeech
        loading={loading}
        onSubmit={onRequest}
      />
    </div>
  );
};

export default aiDialogue;
