import React, { useState } from 'react'
import { Space, Mask, SpinLoading, Image } from 'antd-mobile'
import { useNavigate } from 'umi';
import './index.less';

export default () => {
  let navigate = useNavigate();
  const [visible, setVisible] = useState(true)
  setTimeout(() => { setVisible(false) }, 500)

  const dumpLink = (type) => {
    const link = type === "youtube" ? "https://www.youtube.com/channel/UCNz0CuIKBXpizEmn8akC42w" : "https://v.douyin.com/iNNrghAv/ 8@5.com";
    window.open(link, "_blank")
  }
  
  return (
    <div className="home">
      <Mask opacity='thick' visible={visible}>
        <div className='overlayContent'>
          <Space direction='vertical'>
            <SpinLoading color='primary'/>
            <span>加载中...</span>
          </Space>
        </div>
      </Mask>
      <Image
        className="logoCard"
        src='./image/home_logo_portuguesa.png'
      />
      <Image style={{opacity: 0}} src='./image/WechatIMG4809.jpg'/>
      <Image
        style={{marginBottom: 16, marginTop: 16}}
        src='./image/loginBtn.png'
        onClick={() => navigate("/login", {replace: false})}
      />
      <Image
        style={{marginBottom: 60}}
        src='./image/loginProtocol.png'
        onClick={() => window.open("http://taioassets.oss-cn-beijing.aliyuncs.com/Pdfs/%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.pdf", "_blank")}
      />
      <div className="bahasaindoFooter">
        <div className="friendLink">
          <span onClick={() => dumpLink('youtube')}>东东印尼语YouTube</span>
          <span onClick={() => dumpLink('tiktok')}>东东印尼语抖音</span>
        </div>
        <p>
          粤ICP备2024177696号
        </p>
      </div>
    </div>
  )
}
