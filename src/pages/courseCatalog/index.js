import React, { useState, useEffect, useRef } from 'react'
import {useNavigate, connect } from 'umi';
import {Image, List, SearchBar, Skeleton, Empty, FloatingBubble, Badge, Tag } from 'antd-mobile'
import { request } from '@/services';
import './index.less'

const courseCatalog = (props) => {
  const navigate = useNavigate();

  //跳转到收藏界面
  const onGoCollectPage = () => {
    navigate("/collectWord", { replace: false })
  }

  //单词分类
  const [loading, setLoading] = useState(false)
  const [categorysData, setCategorysData] = useState([]);
  const queryCourse = () => {
    setLoading(true)
    request.get('/prod-api/WordApiController/selectCategoryAll')
      .then(res => {
        const { msg, code, data } = res;
        setLoading(false)
        if(code === 200) setCategorysData(data)
      })
  }
  useEffect(() => { queryCourse() }, [])

  return (
    <div className='courseCatalog'>
      <FloatingBubble
        style={{
          '--initial-position-bottom': '24px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
        }}
        onClick={onGoCollectPage}
      >
        收藏
      </FloatingBubble>
      <div className="chapterAttention">
        <SearchBar
          placeholder='仅限输入印尼语单词'
          showCancelButton
          style={{
            '--border-radius': '16px',
            '--background': '#ffffff',
            '--height': '32px',
            '--padding-left': '12px',
          }}
          onSearch={val => {
            navigate("/wordSearch", {
              replace: false,
              state: {
                remark: val,
              }
            })
          }}
        />
      </div>
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
            categorysData.length ? (
              <List>
                {categorysData.map((item, index) => (
                  <List.Item
                    key={item.id}
                    onClick={
                      () => {
                        navigate("/courseDetail", {
                          replace: false,
                          state: {
                            categoryId: item.id,
                            categoryName: item.name
                          }
                        })
                      }
                    }>
                    <div className="courseItem">
                      <span>{index + 1}</span>
                      <span>{item.name}</span>
                      <Badge content={item.number} />
                    </div>
                  </List.Item>
                ))}
              </List>
            ) : <Empty description='暂无数据' style={{marginTop: '50%'}}/>
          )
        }
      </div>
    </div>
  )
}

export default courseCatalog
