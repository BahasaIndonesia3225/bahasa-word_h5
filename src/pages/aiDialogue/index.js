import { useXAgent, useXChat, Sender, Bubble, XRequest } from '@ant-design/x';
import React from 'react';
import "./index.less"

const { create } = XRequest({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  dangerouslyApiKey: 'sk-ab3033f199eb4bcd93ea82f4c76cd117',
  model: 'qwen-plus',
});

const aiDialogue = () => {
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
  const items = messages.map(({ message, id }) => ({
    key: id,
    content: message,
  }));

  return (
    <div className='aiDialogue'>
      <div className="dialogueBox">
        <Bubble.List items={items} />
      </div>
      <Sender onSubmit={onRequest} />
    </div>
  );
};

export default aiDialogue;
