import React, { useState } from 'react';
import { Avatar, Space, Button, NoticeBar } from 'antd-mobile'
import { UserOutline, LoopOutline, TextOutline, UpCircleOutline } from 'antd-mobile-icons';
import { useXAgent, useXChat, Sender, Bubble, XRequest, Welcome  } from '@ant-design/x';
import markdownit from 'markdown-it';
import "./index.less"

//markdown语法转换为html
const md = markdownit({ html: true, breaks: true });
const renderMarkdown = (content) => (
  <div dangerouslySetInnerHTML={{__html: md.render(content)}}/>
)

const {create} = XRequest({
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
    messageRender: renderMarkdown,
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

const answerContent = (message) => {
  return `"你是一位专业的印尼语AI对话老师，专门为中文母语者提供印尼语教学服务。你的目标是用中文清晰地解释印尼语的词汇、语法和用法，同时提供真实语境下的对话练习，帮助用户掌握实用的印尼语交流能力。请严格遵循以下规则：

中文讲解：
使用流利的中文解释印尼语词汇、短语和句子结构。
在需要时，逐词逐句地解析印尼语表达方式，并提供中文对应翻译。

互动性强：
鼓励用户通过回答问题或完成练习来参与对话。
根据用户的回答，提供反馈并进一步引导学习。

学习内容丰富：
词汇扩展：每次讲解至少提供2-3个相关词汇或同义表达，并用例句说明。
语法讲解：解释常见的语法规则，例如动词变位、句子结构等。

真实语境练习：
模拟日常生活中的真实对话场景（例如在餐厅点餐、市场购物、机场交流等）。
设计适合用户语言水平的对话练习。

文化融入：
在教学中融入印尼文化背景知识，例如礼仪习惯、节日传统等，增强用户的学习兴趣和语言实用性。

示例对话：
用户：印尼语的“谢谢”怎么说？
AI：印尼语里，“谢谢”说作 terima kasih，直接翻译是“接受（terima）感谢（kasih）”。
例句：

Terima kasih atas bantuan Anda. （谢谢您的帮助。）
如果你想更有礼貌，可以加上“很多”，说成 Terima kasih banyak! （非常感谢！）
你可以试着用“谢谢”造一个句子吗？"

目标是让用户感到学习轻松有趣，并能逐步提高他们的印尼语水平。如果用户有特定需求，请根据需要调整教学内容。"

下面是用户问的问题：${message}`
}

const aiDialogue = () => {
  const listRef = React.useRef(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;
      const { onUpdate } = callbacks;
      let content = '';

      try {
        create(
          {
            messages: [{ role: 'user', content: answerContent(message) }],
            stream: true,
          },
          {
            onSuccess: (chunks) => {
              setLoading(false);
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
        value={value}
        onChange={(v) => {
          setValue(v);
        }}
        allowSpeech
        loading={loading}
        onSubmit={() => {
          setValue('');
          setLoading(true);
          onRequest(value)
        }}
      />
    </div>
  );
};

export default aiDialogue;
