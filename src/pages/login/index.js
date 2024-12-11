import React, { useState } from 'react'
import { useNavigate, connect } from 'umi';
import { Modal, Form, Input, Button, AutoCenter, Checkbox, Space, Radio, Image } from 'antd-mobile';
import {setCookie, getCookie, clearCookie} from '@/utils/rememberPassword';
import { request } from '@/services';
import './index.less';

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const {username = "", tempPassword = "", isRemember = false} = getCookie();

  //登陆成功提示模态框
  let navigate = useNavigate();
  const handleInputSuccess = () => {
    navigate("/courseCatalog", { replace: true });
  }

  //登陆失败提示模态框（账户密码错误）
  const handleInputError = () => {
    Modal.show({
      content: (
        <>
          <AutoCenter style={{ fontSize: '24px', color: '#000' }}>用户名或密码错误</AutoCenter>
          <AutoCenter style={{ fontSize: '14px', color: '#ff0000' }}>如您遗忘用户名或密码，请联系老师</AutoCenter>
        </>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'online',
          text: '再试一次',
          primary: true,
        },
      ],
    })
  }

  //账号密码锁定
  const handleInputLock = () => {
    Modal.show({
      content: (
        <>
          <AutoCenter style={{ fontSize: '24px', color: '#000' }}>密码输入错误5次</AutoCenter>
          <AutoCenter style={{ fontSize: '14px', color: '#ff0000' }}>帐户锁定10分钟</AutoCenter>
        </>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'online',
          text: '再试一次',
          primary: true,
        },
      ],
    })
  }

  //表单信息
  const [form] = Form.useForm()
  const onFinish = () => {
    setLoading(true)
    const values = form.getFieldsValue();
    request.post('/prod-api/sysUserApiController/login', {
      data: values
    }).then(res => {
        const { code, msg, token } = res;
        setLoading(false)
        if(code === 200) {
          //记住密码控制逻辑
          const { username, password, autoLogin } = values;
          if(autoLogin === '1') {
            setCookie(username, password, 7)
          }else {
            clearCookie()
          }
          //设置token、水印名称
          props.dispatch({
            type: "user/changeToken",
            payload: "Bearer " + token
          })
          props.dispatch({
            type: "user/changeWaterMarkContent",
            payload: values.username
          })
          handleInputSuccess();
        }else {
          if(msg === "用户不存在/密码错误") handleInputError();
          if(msg === "密码输入错误5次，帐户锁定10分钟") handleInputLock();
        }
      })
  }
  return (
    <div className="login">
      <Image
        className="img_login"
        src='./image/img_login.png'
      />
      <div className="loginContain">
        <p className="loginHeader">
          <span>登录</span>
          <span>/ Masuk / Entrar / </span>
          <span>
            <i>Login</i>
          </span>
        </p>
        <Form
          layout='horizontal'
          form={form}
          initialValues={{
            username: username,
            password: tempPassword,
            autoLogin: isRemember ? "1" : '0',
          }}
          onFinish={onFinish}
          footer={
            <Button
              className="loginBtn"
              loading={loading}
              loadingText='登陆中'
              color='primary'
              type='submit'
              block
              disabled={false}
              size='mini'>
              <div className="loginBtnCon">
                <div className="loginBtnConLeft">
                  <Image className="loginIcon" src='./image/icon_LogIn.png' />
                  <span>登录系统</span>
                </div>
                <div className="loginBtnConRight">
                  <p>Masuk sistem</p>
                  <p>Entrar no sistema</p>
                  <p>
                    <i>User login</i>
                  </p>
                </div>
              </div>
            </Button>
          }
        >
          <Form.Item
            name='username'
            label='用户名 / ID：'
            rules={[{ required: true, message: '用户名不能为空' }]}>
            <Input placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item
            name='password'
            label='密码 / Kadi：'
            rules={[{ required: true, message: '密码不能为空' }]}>
            <Input placeholder='请输入密码' />
          </Form.Item>
          <Form.Item
            name='autoLogin'
            label='记住密码：'>
            <Radio.Group>
              <Space>
                <Radio value='1'>是</Radio>
                <Radio value='0'>否</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default connect((state) => ({}))(Login)
