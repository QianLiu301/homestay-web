import cloudbase from '@cloudbase/js-sdk'

// 初始化云开发
const app = cloudbase.init({
  env: 'cloud1-4g9x391bdb0b1d3f'
})

// auth 对象只创建一次
const auth = app.auth({ persistence: 'local' })

const IS_DEV = import.meta.env.DEV

// 登录 Promise 缓存
let authPromise = null

// 确保已登录
const ensureAuth = async () => {
  try {
    // 检查当前登录状态
    const loginState = await auth.getLoginState()
    
    
    if (loginState) {
      console.log('✅ 已登录')
      console.log('是否匿名:', loginState.isAnonymousAuth)
      console.log('登录类型:', loginState.loginType)
      return loginState
    }
    
    // 需要登录
    console.log('❌ 未登录，开始匿名登录...')
    
    if (!authPromise) {
      authPromise = auth.signInAnonymously()
        .then(async (res) => {
          console.log('✅ 匿名登录成功')
          
          // 重新获取登录状态确认
          const newState = await auth.getLoginState()
          console.log('用户 UID:', newState?.user?.uid)
          
          return newState
        })
        .catch(err => {
          console.error('❌ 匿名登录失败:', err)
          console.error('错误码:', err.code)
          console.error('错误信息:', err.message)
          authPromise = null
          throw err
        })
    }
    
    return authPromise
  } catch (err) {
    console.error('ensureAuth 异常:', err)
    throw err
  }
}

// 获取数据库引用
const getDb = async () => {
  await ensureAuth()
  return app.database()
}

// ===== MD5 实现 =====
const md5 = (string) => {
  function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3]
    a = ff(a, b, c, d, k[0], 7, -680876936)
    d = ff(d, a, b, c, k[1], 12, -389564586)
    c = ff(c, d, a, b, k[2], 17, 606105819)
    b = ff(b, c, d, a, k[3], 22, -1044525330)
    a = ff(a, b, c, d, k[4], 7, -176418897)
    d = ff(d, a, b, c, k[5], 12, 1200080426)
    c = ff(c, d, a, b, k[6], 17, -1473231341)
    b = ff(b, c, d, a, k[7], 22, -45705983)
    a = ff(a, b, c, d, k[8], 7, 1770035416)
    d = ff(d, a, b, c, k[9], 12, -1958414417)
    c = ff(c, d, a, b, k[10], 17, -42063)
    b = ff(b, c, d, a, k[11], 22, -1990404162)
    a = ff(a, b, c, d, k[12], 7, 1804603682)
    d = ff(d, a, b, c, k[13], 12, -40341101)
    c = ff(c, d, a, b, k[14], 17, -1502002290)
    b = ff(b, c, d, a, k[15], 22, 1236535329)
    a = gg(a, b, c, d, k[1], 5, -165796510)
    d = gg(d, a, b, c, k[6], 9, -1069501632)
    c = gg(c, d, a, b, k[11], 14, 643717713)
    b = gg(b, c, d, a, k[0], 20, -373897302)
    a = gg(a, b, c, d, k[5], 5, -701558691)
    d = gg(d, a, b, c, k[10], 9, 38016083)
    c = gg(c, d, a, b, k[15], 14, -660478335)
    b = gg(b, c, d, a, k[4], 20, -405537848)
    a = gg(a, b, c, d, k[9], 5, 568446438)
    d = gg(d, a, b, c, k[14], 9, -1019803690)
    c = gg(c, d, a, b, k[3], 14, -187363961)
    b = gg(b, c, d, a, k[8], 20, 1163531501)
    a = gg(a, b, c, d, k[13], 5, -1444681467)
    d = gg(d, a, b, c, k[2], 9, -51403784)
    c = gg(c, d, a, b, k[7], 14, 1735328473)
    b = gg(b, c, d, a, k[12], 20, -1926607734)
    a = hh(a, b, c, d, k[5], 4, -378558)
    d = hh(d, a, b, c, k[8], 11, -2022574463)
    c = hh(c, d, a, b, k[11], 16, 1839030562)
    b = hh(b, c, d, a, k[14], 23, -35309556)
    a = hh(a, b, c, d, k[1], 4, -1530992060)
    d = hh(d, a, b, c, k[4], 11, 1272893353)
    c = hh(c, d, a, b, k[7], 16, -155497632)
    b = hh(b, c, d, a, k[10], 23, -1094730640)
    a = hh(a, b, c, d, k[13], 4, 681279174)
    d = hh(d, a, b, c, k[0], 11, -358537222)
    c = hh(c, d, a, b, k[3], 16, -722521979)
    b = hh(b, c, d, a, k[6], 23, 76029189)
    a = hh(a, b, c, d, k[9], 4, -640364487)
    d = hh(d, a, b, c, k[12], 11, -421815835)
    c = hh(c, d, a, b, k[15], 16, 530742520)
    b = hh(b, c, d, a, k[2], 23, -995338651)
    a = ii(a, b, c, d, k[0], 6, -198630844)
    d = ii(d, a, b, c, k[7], 10, 1126891415)
    c = ii(c, d, a, b, k[14], 15, -1416354905)
    b = ii(b, c, d, a, k[5], 21, -57434055)
    a = ii(a, b, c, d, k[12], 6, 1700485571)
    d = ii(d, a, b, c, k[3], 10, -1894986606)
    c = ii(c, d, a, b, k[10], 15, -1051523)
    b = ii(b, c, d, a, k[1], 21, -2054922799)
    a = ii(a, b, c, d, k[8], 6, 1873313359)
    d = ii(d, a, b, c, k[15], 10, -30611744)
    c = ii(c, d, a, b, k[6], 15, -1560198380)
    b = ii(b, c, d, a, k[13], 21, 1309151649)
    a = ii(a, b, c, d, k[4], 6, -145523070)
    d = ii(d, a, b, c, k[11], 10, -1120210379)
    c = ii(c, d, a, b, k[2], 15, 718787259)
    b = ii(b, c, d, a, k[9], 21, -343485551)
    x[0] = add32(a, x[0])
    x[1] = add32(b, x[1])
    x[2] = add32(c, x[2])
    x[3] = add32(d, x[3])
  }
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t))
    return add32((a << s) | (a >>> (32 - s)), b)
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t) }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t) }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t) }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t) }
  function md51(s) {
    var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i
    for (i = 64; i <= s.length; i += 64) { md5cycle(state, md5blk(s.substring(i - 64, i))) }
    s = s.substring(i - 64)
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3)
    tail[i >> 2] |= 0x80 << ((i % 4) << 3)
    if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0 }
    tail[14] = n * 8
    md5cycle(state, tail)
    return state
  }
  function md5blk(s) {
    var md5blks = [], i
    for (i = 0; i < 64; i += 4) { md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24) }
    return md5blks
  }
  var hex_chr = '0123456789abcdef'.split('')
  function rhex(n) {
    var s = '', j = 0
    for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F]
    return s
  }
  function hex(x) { for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join('') }
  function add32(a, b) { return (a + b) & 0xFFFFFFFF }
  return hex(md51(string))
}

// 密码哈希
const ACCESS_PASSWORD_HASH = 'd219547afd02b95dfd92132808836b68'
const ADMIN_PASSWORD_HASH = 'd219547afd02b95dfd92132808836b68'

export const verifyPassword = (password) => {
  const hash = md5(password)
  return hash === ACCESS_PASSWORD_HASH
}

export const verifyAdminPassword = (password) => {
  const hash = md5(password)
  return hash === ADMIN_PASSWORD_HASH
}

// 获取单个房源详情
export const getHomestay = async (id) => {
  const db = await getDb()
  const res = await db.collection('homestays').doc(id).get()
  let homestay = res.data?.[0] || res.data
  
  if (homestay) {
    homestay = await processHomestayFiles(homestay)
  }
  
  return homestay
}

// 获取房源列表
export const getHomestays = async () => {
  try {
    console.log('===== 开始获取房源列表 =====')
    
    // 先确保登录
    const loginState = await ensureAuth()
  
    if (!loginState) {
      console.error('❌ 登录失败，无法获取房源')
      return []
    }
    if (IS_DEV) console.log('[AUTH] logged in')
    
    const db = await getDb()
    console.log('数据库实例获取成功')
    
    // 查询数据
    let allData = []
const batchSize = 100
let offset = 0

while (true) {
  const res = await db.collection('homestays')
    .orderBy('updateTime', 'desc')
    .skip(offset)
    .limit(batchSize)
    .get()
  
  if (!res.data || res.data.length === 0) break
  
  allData = allData.concat(res.data)
  offset += res.data.length
  
  if (res.data.length < batchSize) break
}

console.log('✅ 获取到', allData.length, '条房源')
return allData
    
  } catch (err) {
    console.error('❌ 获取房源失败:', err)
    console.error('错误码:', err.code)
    console.error('错误信息:', err.message)
    return []
  }
}

// 删除房源
export const deleteHomestay = async (id) => {
  const db = await getDb()
  await db.collection('homestays').doc(id).remove()
  return true
}

// 获取云存储临时链接
export const getTempFileURL = async (fileIds) => {
  if (!fileIds || fileIds.length === 0) return {}
  
  await ensureAuth()
  
  try {
    const res = await app.getTempFileURL({ fileList: fileIds })
    const urlMap = {}
    res.fileList.forEach(item => {
      if (item.tempFileURL) {
        urlMap[item.fileID] = item.tempFileURL
      }
    })
    return urlMap
  } catch (err) {
    console.error('获取临时链接失败:', err)
    return {}
  }
}

// 处理房源的云文件链接
export const processHomestayFiles = async (homestay) => {
  const fileIds = []
  
  if (homestay.videoUrl && homestay.videoUrl.startsWith('cloud://')) {
    fileIds.push(homestay.videoUrl)
  }
  if (homestay.images && homestay.images.length > 0) {
    homestay.images.forEach(img => {
      if (img && img.startsWith('cloud://')) fileIds.push(img)
    })
  }

  if (homestay.interiorVideoUrl && homestay.interiorVideoUrl.startsWith('cloud://')) {
    fileIds.push(homestay.interiorVideoUrl)
  }
  if (homestay.interiorImages && homestay.interiorImages.length > 0) {
    homestay.interiorImages.forEach(img => {
      if (img && img.startsWith('cloud://')) fileIds.push(img)
    })
  }
  
  if (fileIds.length === 0) return homestay
  
  const urlMap = await getTempFileURL(fileIds)
  
  if (homestay.videoUrl && urlMap[homestay.videoUrl]) {
    homestay.videoUrl = urlMap[homestay.videoUrl]
  }
  if (homestay.images) {
    homestay.images = homestay.images.map(img => urlMap[img] || img)
  }

  if (homestay.interiorVideoUrl && urlMap[homestay.interiorVideoUrl]) {
    homestay.interiorVideoUrl = urlMap[homestay.interiorVideoUrl]
  }
  if (homestay.interiorImages) {
    homestay.interiorImages = homestay.interiorImages.map(img => urlMap[img] || img)
  }
  
  return homestay
}

// ===== 导出调试函数 =====
export const checkAuthStatus = async () => {
  console.log('===== 检查认证状态 =====')
  
  try {
    const loginState = await auth.getLoginState()
    
    if (loginState) {
      console.log('✅ 已登录')
      console.log('用户 UID:', loginState.user?.uid)
      console.log('是否匿名:', loginState.isAnonymousAuth)
      console.log('登录类型:', loginState.loginType)
      console.log('完整状态:', loginState)
      return true
    } else {
      console.log('❌ 未登录')
      return false
    }
  } catch (err) {
    console.error('检查登录状态失败:', err)
    return false
  }
}

// 手动触发登录测试
export const testLogin = async () => {
  console.log('===== 手动测试登录 =====')
  
  try {
    // 先检查当前状态
    let state = await auth.getLoginState()
    console.log('当前状态:', state)
    
    if (!state) {
      console.log('尝试匿名登录...')
      const result = await auth.signInAnonymously()
      console.log('登录结果:', result)
      
      // 再次检查
      state = await auth.getLoginState()
      console.log('登录后状态:', state)
    }
    
    // 测试数据库访问
    if (state) {
      console.log('测试数据库访问...')
      const db = app.database()
      const res = await db.collection('homestays').limit(1).get()
      console.log('数据库测试结果:', res)
      
      if (res.data && res.data.length > 0) {
        console.log('✅ 数据库访问成功！')
      } else {
        console.log('⚠️ 数据库访问成功但无数据')
      }
    }
    
    return state
  } catch (err) {
    console.error('测试失败:', err)
    return null
  }
}

// 挂载到 window 供控制台调用
if (typeof window !== 'undefined' && IS_DEV) {
  window.checkAuthStatus = checkAuthStatus
  window.testLogin = testLogin
}
