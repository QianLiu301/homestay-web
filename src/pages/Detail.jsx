import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getHomestay } from '../api'

function Detail() {
  const { id } = useParams()
  const [homestay, setHomestay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('zh')
  const [toast, setToast] = useState('')

  // 显示提示
  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  // 复制到剪贴板
  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    showToast(lang === 'zh' ? '已复制' : 'Copied')
  }

  // 打开导航
  const openNavigation = (lat, lng, name) => {
    // 尝试打开高德地图
    const url = `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}`
    window.open(url, '_blank')
  }

  // 拨打电话
  const callPhone = (phone) => {
    window.location.href = `tel:${phone}`
  }

  // 分享链接
  const shareLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    showToast(lang === 'zh' ? '链接已复制，可发送给好友' : 'Link copied')
  }

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getHomestay(id)
        setHomestay(data)
      } catch (err) {
        console.error('加载失败:', err)
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  // 计算序号
  const getSectionNumbers = () => {
    if (!homestay) return {}
    let num = 1
    const numbers = {}
    
    num++ // 地址
    if (homestay.doorPassword || homestay.roomPasswordTip) num++
    numbers.checkTime = num
    if (homestay.checkInTime || homestay.checkOutTime) num++
    numbers.wifi = num
    if (homestay.wifiName) num++
    numbers.video = num
    if (homestay.videoUrl) num++
    numbers.images = num
    if (homestay.images?.length > 0) num++
    numbers.interiorVideo = num
    if (homestay.interiorVideoUrl) num++
    numbers.interiorImages = num
    if (homestay.interiorImages?.length > 0) num++
    numbers.textGuide = num
    if (homestay.textGuide) num++
    numbers.transport = num
    if (homestay.publicTransport) num++
    numbers.parking = num
    if (homestay.parkingLatitude || homestay.parkingInfo) num++
    numbers.notes = num
    if (homestay.notes) num++
    numbers.contact = num
    
    return numbers
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (!homestay) {
    return (
      <div className="empty">
        <div className="empty-icon">🏠</div>
        <p>{lang === 'zh' ? '房源不存在' : 'Homestay not found'}</p>
      </div>
    )
  }

  const sn = getSectionNumbers()

  return (
    <div className="detail-page">
      {/* 顶部横幅 */}
      <div className="detail-header" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 5 }}>
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
        </div>
        
        <div className="welcome-text">
          {lang === 'zh' ? '欢迎入住' : 'Welcome to'} {lang === 'en' && homestay.nameEn ? homestay.nameEn : homestay.name}
        </div>
        <div className="page-title">
          {lang === 'zh' ? '入住指引' : 'Check-in Guide'}
        </div>
      </div>

      <div className="detail-content">
        {/* 地址 */}
        <div className="section-card">
          <div className="section-number">1</div>
          <div className="section-title">{lang === 'zh' ? '民宿地址' : 'Address'}</div>
          
          <div className="info-label">【{lang === 'zh' ? '民宿地址' : 'Address'}】</div>
          <div className="info-content">
            {lang === 'en' && homestay.addressEn ? homestay.addressEn : homestay.address}
          </div>
          
          <div className="action-row">
            {homestay.latitude && homestay.longitude && (
              <button className="nav-btn" onClick={() => openNavigation(homestay.latitude, homestay.longitude, homestay.name)}>
                {lang === 'zh' ? '点击导航' : 'Navigate'} 📍
              </button>
            )}
            <button className="copy-btn" onClick={() => copyText(homestay.address)}>
              {lang === 'zh' ? '复制地址' : 'Copy Address'}
            </button>
          </div>

          {homestay.navigation && (
            <div style={{ marginTop: 20 }}>
              <div className="info-label">【{lang === 'zh' ? '到达后' : 'After Arrival'}】</div>
              <div className="info-content highlight">
                {lang === 'en' && homestay.navigationEn ? homestay.navigationEn : homestay.navigation}
              </div>
            </div>
          )}
        </div>

        {/* 门锁密码 */}
        {(homestay.doorPassword || homestay.roomPasswordTip) && (
          <div className="section-card">
            <div className="section-number">2</div>
            <div className="section-title">{lang === 'zh' ? '门锁密码' : 'Door Password'}</div>
            
            {homestay.doorPassword && (
              <div>
                <div className="password-label">🔐 {lang === 'zh' ? '门锁密码' : 'Door Password'}</div>
                <div className="password-display">
                  <span className="password-text">{homestay.doorPassword}</span>
                  <button className="copy-btn small" onClick={() => copyText(homestay.doorPassword)}>
                    {lang === 'zh' ? '复制' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {homestay.roomPasswordTip && (
              <div style={{ marginTop: 15 }}>
                <div className="password-label">🔑 {lang === 'zh' ? '房间密码' : 'Room Password'}</div>
                <div className="password-display">
                  <span className="password-text" style={{ fontSize: 16, letterSpacing: 1 }}>
                    {lang === 'en' && homestay.roomPasswordTipEn ? homestay.roomPasswordTipEn : homestay.roomPasswordTip}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 入住/退房时间 */}
        {(homestay.checkInTime || homestay.checkOutTime) && (
          <div className="section-card">
            <div className="section-number">{sn.checkTime}</div>
            <div className="section-title">{lang === 'zh' ? '入住/退房时间' : 'Check-in/out Time'}</div>
            <div className="time-box">
              {homestay.checkInTime && (
                <div className="time-item">
                  <span className="time-icon">🔑</span>
                  <div className="time-info">
                    <span className="time-label">{lang === 'zh' ? '入住时间' : 'Check-in'}</span>
                    <span className="time-value">{homestay.checkInTime}</span>
                  </div>
                </div>
              )}
              {homestay.checkInTime && homestay.checkOutTime && <div className="time-divider"></div>}
              {homestay.checkOutTime && (
                <div className="time-item">
                  <span className="time-icon">🚪</span>
                  <div className="time-info">
                    <span className="time-label">{lang === 'zh' ? '退房时间' : 'Check-out'}</span>
                    <span className="time-value">{homestay.checkOutTime}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WiFi */}
        {homestay.wifiName && (
          <div className="section-card">
            <div className="section-number">{sn.wifi}</div>
            <div className="section-title">{lang === 'zh' ? 'WiFi 连接' : 'WiFi'}</div>
            <div className="wifi-info">
              <div className="wifi-row">
                <span className="wifi-label">{lang === 'zh' ? '名称' : 'Name'}:</span>
                <span className="wifi-value">{homestay.wifiName}</span>
                <button className="copy-btn small" onClick={() => copyText(homestay.wifiName)}>
                  {lang === 'zh' ? '复制' : 'Copy'}
                </button>
              </div>
              <div className="wifi-row">
                <span className="wifi-label">{lang === 'zh' ? '密码' : 'Password'}:</span>
                <span className="wifi-value">{homestay.wifiPassword}</span>
                <button className="copy-btn small" onClick={() => copyText(homestay.wifiPassword)}>
                  {lang === 'zh' ? '复制' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 视频 */}
        {homestay.videoUrl && (
          <div className="section-card">
            <div className="section-number">{sn.video}</div>
            <div className="section-title">{lang === 'zh' ? '入住视频指引' : 'Video Guide'}</div>
            <div className="video-wrap">
              <video src={homestay.videoUrl} controls className="guide-video"></video>
            </div>
            <div className="video-tip">{lang === 'zh' ? '点击播放查看入住指引视频' : 'Tap to play guide video'}</div>
          </div>
        )}

        {/* 图片 */}
        {homestay.images?.length > 0 && (
          <div className="section-card">
            <div className="section-number">{sn.images}</div>
            <div className="section-title">{lang === 'zh' ? '图片指引' : 'Photo Guide'}</div>
            <div className="images-grid">
              {homestay.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="guide-image"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        {/* 房源内部视频 */}
        {homestay.interiorVideoUrl && (
          <div className="section-card">
            <div className="section-number">{sn.interiorVideo}</div>
            <div className="section-title">{lang === 'zh' ? '房源内部视频' : 'Interior Video'}</div>
            <div className="video-wrap">
              <video src={homestay.interiorVideoUrl} controls className="guide-video"></video>
            </div>
            <div className="video-tip">{lang === 'zh' ? '点击播放查看房源内部视频' : 'Tap to play interior video'}</div>
          </div>
        )}

        {/* 房源内部图片 */}
        {homestay.interiorImages?.length > 0 && (
          <div className="section-card">
            <div className="section-number">{sn.interiorImages}</div>
            <div className="section-title">{lang === 'zh' ? '房源内部图片' : 'Interior Photos'}</div>
            <div className="images-grid">
              {homestay.interiorImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="guide-image"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        {/* 文本指引 */}
        {homestay.textGuide && (
          <div className="section-card">
            <div className="section-number">{sn.textGuide}</div>
            <div className="section-title">{lang === 'zh' ? '文本指引' : 'Text Guide'}</div>
            <div className="info-content">
              {lang === 'en' && homestay.textGuideEn ? homestay.textGuideEn : homestay.textGuide}
            </div>
          </div>
        )}

        {/* 公共交通 */}
        {homestay.publicTransport && (
          <div className="section-card">
            <div className="section-number">{sn.transport}</div>
            <div className="section-title">{lang === 'zh' ? '公共交通' : 'Public Transport'}</div>
            <div className="info-content">
              {lang === 'en' && homestay.publicTransportEn ? homestay.publicTransportEn : homestay.publicTransport}
            </div>
          </div>
        )}

        {/* 停车场 */}
        {(homestay.parkingLatitude || homestay.parkingInfo) && (
          <div className="section-card">
            <div className="section-number">{sn.parking}</div>
            <div className="section-title">{lang === 'zh' ? '停车场' : 'Parking'}</div>
            
            {homestay.parkingLatitude && homestay.parkingLongitude && (
              <div className="action-row" style={{ marginBottom: 15 }}>
                <button className="nav-btn" onClick={() => openNavigation(homestay.parkingLatitude, homestay.parkingLongitude, '停车场')}>
                  {lang === 'zh' ? '导航到停车场' : 'Navigate to Parking'} 📍
                </button>
              </div>
            )}
            
            {homestay.parkingInfo && (
              <div className="info-content">
                {lang === 'en' && homestay.parkingInfoEn ? homestay.parkingInfoEn : homestay.parkingInfo}
              </div>
            )}
          </div>
        )}

        {/* 温馨提示 */}
        {homestay.notes && (
          <div className="section-card">
            <div className="section-number">{sn.notes}</div>
            <div className="section-title">{lang === 'zh' ? '温馨提示' : 'Notes'}</div>
            <div className="notes-content">
              {lang === 'en' && homestay.notesEn ? homestay.notesEn : homestay.notes}
            </div>
          </div>
        )}

        {/* 客服电话 */}
        {(homestay.contactCn1 || homestay.contactCn2 || homestay.contactEn || homestay.contactNight) && (
          <div className="section-card">
            <div className="section-number">{sn.contact}</div>
            <div className="section-title">{lang === 'zh' ? '客服电话' : 'Contact Us'}</div>
            <div className="contact-list">
              {homestay.contactCn1 && (
                <div className="contact-item" onClick={() => callPhone(homestay.contactCn1)}>
                  <span className="contact-label">{lang === 'zh' ? '归宿客服' : 'Guisu Service'}</span>
                  <div className="contact-right">
                    <span>📞</span>
                    <span className="contact-phone">{homestay.contactCn1}</span>
                  </div>
                </div>
              )}
              {homestay.contactCn2 && (
                <div className="contact-item" onClick={() => callPhone(homestay.contactCn2)}>
                  <span className="contact-label">{lang === 'zh' ? '中文客服' : 'Chinese Service'}</span>
                  <div className="contact-right">
                    <span>📞</span>
                    <span className="contact-phone">{homestay.contactCn2}</span>
                  </div>
                </div>
              )}
              {homestay.contactEn && (
                <div className="contact-item" onClick={() => callPhone(homestay.contactEn)}>
                  <span className="contact-label">{lang === 'zh' ? '英文客服' : 'English Service'}</span>
                  <div className="contact-right">
                    <span>📞</span>
                    <span className="contact-phone">{homestay.contactEn}</span>
                  </div>
                </div>
              )}
              {homestay.contactNight && (
                <div className="contact-item" onClick={() => callPhone(homestay.contactNight)}>
                  <span className="contact-label">{lang === 'zh' ? '夜间服务' : 'Night Service'}</span>
                  <div className="contact-right">
                    <span>🌙</span>
                    <span className="contact-phone">{homestay.contactNight}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 分享按钮 */}
        <div className="bottom-bar">
          <button className="share-btn-large" onClick={shareLink}>
            {lang === 'zh' ? '分享给好友' : 'Share with Friends'}
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default Detail
