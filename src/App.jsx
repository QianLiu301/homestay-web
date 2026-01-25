import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHomestays, deleteHomestay, verifyPassword, verifyAdminPassword } from './api'

function App() {
  const navigate = useNavigate()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [homestayList, setHomestayList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [lang, setLang] = useState('zh')
  const [toast, setToast] = useState('')

  // 显示提示
  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  // 验证密码
  const checkPassword = async () => {
    if (!passwordInput) return
    
    // 本地验证密码
    if (verifyPassword(passwordInput)) {
      setIsUnlocked(true)
      sessionStorage.setItem('unlocked', 'true')
      
      // 检查是否是管理员密码
      if (verifyAdminPassword(passwordInput)) {
        setIsAdmin(true)
        sessionStorage.setItem('admin', 'true')
      }
      
      // 加载数据
      loadData()
    } else {
      showToast(lang === 'zh' ? '密码错误' : 'Wrong password')
    }
  }

  // 加载数据
  const loadData = async () => {
    setLoading(true)
    try {
      const list = await getHomestays()
      setHomestayList(list)
    } catch (err) {
      console.error('加载失败:', err)
      showToast(lang === 'zh' ? '加载失败' : 'Load failed')
    }
    setLoading(false)
  }

  // 检查会话状态
  useEffect(() => {
    const unlocked = sessionStorage.getItem('unlocked')
    const admin = sessionStorage.getItem('admin')
    
    if (unlocked) {
      setIsUnlocked(true)
      if (admin) setIsAdmin(true)
      loadData()
    }
  }, [])

  // 搜索过滤
  const filteredList = homestayList.filter(item => {
    if (!searchKey) return true
    const key = searchKey.toLowerCase()
    return (
      item.name?.toLowerCase().includes(key) ||
      item.address?.toLowerCase().includes(key) ||
      item.tags?.some(t => t.toLowerCase().includes(key))
    )
  })

  // 删除房源
  const handleDelete = async (e, id, name) => {
    e.stopPropagation()
    if (!window.confirm(`确定要删除「${name}」吗？`)) return
    
    try {
      await deleteHomestay(id)
      showToast('删除成功')
      loadData()
    } catch (err) {
      showToast('删除失败')
    }
  }

  // 复制分享链接
  const handleShare = (e, id) => {
    e.stopPropagation()
    const url = `${window.location.origin}/detail/${id}`
    navigator.clipboard.writeText(url)
    showToast(lang === 'zh' ? '链接已复制' : 'Link copied')
  }

  // 切换管理员模式
  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false)
      sessionStorage.removeItem('admin')
      showToast(lang === 'zh' ? '已退出管理' : 'Admin mode off')
    } else {
      const pwd = window.prompt(lang === 'zh' ? '请输入管理员密码' : 'Enter admin password')
      if (pwd && verifyAdminPassword(pwd)) {
        setIsAdmin(true)
        sessionStorage.setItem('admin', 'true')
        showToast(lang === 'zh' ? '管理模式已开启' : 'Admin mode on')
      } else if (pwd) {
        showToast(lang === 'zh' ? '密码错误' : 'Wrong password')
      }
    }
  }

  // 格式化时间
  const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  // 未解锁：显示密码输入
  if (!isUnlocked) {
    return (
      <div className="password-gate">
        <div className="gate-content">
          <div className="gate-icon">🔐</div>
          <h2 className="gate-title">
            {lang === 'zh' ? '请输入访问密码' : 'Enter Password'}
          </h2>
          <input
            className="gate-input"
            type="password"
            placeholder={lang === 'zh' ? '请输入密码' : 'Password'}
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
          />
          <button 
            className="gate-btn" 
            onClick={checkPassword}
            disabled={loading}
          >
            {loading ? '...' : (lang === 'zh' ? '确认' : 'Confirm')}
          </button>
          
          <div style={{ marginTop: 20 }}>
            <button
              className="lang-btn"
              style={{ 
                background: lang === 'zh' ? '#f5a623' : 'transparent',
                color: lang === 'zh' ? 'white' : '#f5a623',
                border: '2px solid #f5a623',
                marginRight: 10
              }}
              onClick={() => setLang('zh')}
            >
              中
            </button>
            <button
              className="lang-btn"
              style={{ 
                background: lang === 'en' ? '#f5a623' : 'transparent',
                color: lang === 'en' ? 'white' : '#f5a623',
                border: '2px solid #f5a623'
              }}
              onClick={() => setLang('en')}
            >
              En
            </button>
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    )
  }

  // 已解锁：显示房源列表
  return (
    <div>
      <div className="header">
        <h1>{lang === 'zh' ? '民宿入住指引' : 'Homestay Guide'}</h1>
        <p>{lang === 'zh' ? `共 ${homestayList.length} 套房源` : `${homestayList.length} Homestays`}</p>
        
        <div className="header-actions">
          <button
            className={`lang-btn ${lang === 'zh' ? 'active' : ''}`}
            onClick={() => setLang('zh')}
          >
            中
          </button>
          <button
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            En
          </button>
          <button
            className={`admin-btn ${isAdmin ? 'active' : ''}`}
            onClick={toggleAdmin}
          >
            {isAdmin 
              ? (lang === 'zh' ? '管理中' : 'Admin') 
              : (lang === 'zh' ? '管理员' : 'Admin')
            }
          </button>
        </div>
      </div>

      <div className="container">
        <div className="search-bar">
          <input
            className="search-input"
            placeholder={lang === 'zh' ? '搜索房源名称、地址、标签...' : 'Search name, address, tags...'}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>

        {searchKey && (
          <div className="stats-bar">
            {filteredList.length} {lang === 'zh' ? '条结果' : 'results'}
          </div>
        )}

        <div className="homestay-list">
          {filteredList.map((item) => (
            <div
              key={item._id}
              className="homestay-card"
              onClick={() => navigate(`/detail/${item._id}`)}
            >
              <div className="card-header">
                <span className="homestay-name">
                  {lang === 'en' && item.nameEn ? item.nameEn : item.name}
                </span>
                {false && (
                  <div className="card-actions">
                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => handleDelete(e, item._id, item.name)}
                    >
                      {lang === 'zh' ? '删除' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="tags-wrap">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="address-text">
                📍 {lang === 'en' && item.addressEn ? item.addressEn : item.address}
              </div>

              <div className="card-footer">
                <span className="update-time">
                  {lang === 'zh' ? '更新于 ' : 'Updated '}{formatTime(item.updateTime)}
                </span>
                <button
                  className="share-btn"
                  onClick={(e) => handleShare(e, item._id)}
                >
                  {lang === 'zh' ? '分享' : 'Share'}
                </button>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && !loading && (
            <div className="empty">
              <div className="empty-icon">🏠</div>
              <p>{searchKey 
                ? (lang === 'zh' ? '没有找到相关房源' : 'No results found')
                : (lang === 'zh' ? '暂无房源' : 'No homestays')
              }</p>
            </div>
          )}

          {loading && (
            <div className="loading">
              {lang === 'zh' ? '加载中...' : 'Loading...'}
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
