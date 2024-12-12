const SftpClient = require('ssh2-sftp-client')
const sftp = new SftpClient()

const config = {
  host: '47.109.16.170',
  port: '22',
  username: 'root',
  password: 'Root0129' // 或者使用 privateKey 字段提供私钥路径
}

const remoteDir = '/www/wwwroot/indonesia.bahasaindo.cn' // 远程目录路径
const newFolderPath = '/database/nginx/html/TianJin/operationBak1' // 重命名后的文件夹新路径（仅改变名称）
// const localDir = 'bak' // 本地保存路径


sftp.connect(config).then(() => {
  console.log('连接成功！')
  // console.log('开始下载目录...')
  // return sftp.downloadDir(remoteDir, localDir) // 这里本意想下载到本地进行备份
  console.log('开始备份文件夹...')
  // return sftp.rename(remoteDir, newFolderPath) // 重命名文件夹（远程已经有的文件夹名称，会重命名错误）
}).then(() => {
  // console.log('目录下载成功！')
  console.log('文件夹备份成功！')
  console.log('开始上传文件...')


  sftp.uploadDir('indonesia.bahasaindo.cn', remoteDir).then(() => { //'operation'打包后的文件夹目录，这里js放在同级目录中所以，这里可以只填写文件夹名
    console.log('文件上传成功！') //这里会直接将远程文件目录覆盖掉，所以前面可以加上备份操作
    return sftp.end()
  }).catch((err) => {
    console.error(err.message)
    if (sftp.sftp) {
      sftp.sftp.end()
    }
  })
}).catch((err) => {
  console.error(err.message)
  if (sftp.sftp) {
    sftp.sftp.end()
  }
})
