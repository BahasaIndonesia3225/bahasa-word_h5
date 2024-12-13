const SftpClient = require('ssh2-sftp-client')
const sftp = new SftpClient()

const config = {
  host: '47.109.16.170',
  port: '22',
  username: 'root',
  password: 'Root0129' // 或者使用 privateKey 字段提供私钥路径
}
sftp.connect(config).then(() => {
  sftp.uploadDir('dist', '/usr/local/nginx/html' ).then(() => {
    console.log('文件上传成功！')
    return sftp.end()
  }).catch((err) => {
    console.error(err.message)
    if (sftp.sftp) {
      sftp.sftp.end()
    }
  })
}).catch((err) => {
  if (sftp.sftp) {
    sftp.sftp.end()
  }
})
