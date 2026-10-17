import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App } from 'antd'
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Login from './Login.jsx'

/**
 * Global Ant Design Theme Configuration
 * Matching Certify design specification
 */
const themeConfig = {
  token: {
    colorPrimary: '#1f5f5b',
    colorPrimaryHover: '#174744',
    colorPrimaryActive: '#113533',
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 8,
    controlHeight: 40,
    fontSize: 14,
  },
  components: {
    Button: {
      colorPrimary: '#1f5f5b',
      colorPrimaryHover: '#174744',
      colorPrimaryActive: '#113533',
      primaryShadow: 'none',
    },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={themeConfig}>
      <App>
        <Login />
      </App>
    </ConfigProvider>
  </StrictMode>
)
