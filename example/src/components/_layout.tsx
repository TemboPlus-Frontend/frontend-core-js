import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

// Example documentation structure
const documentationItems = [
  {
    key: 'guides',
    icon: <BookOutlined />,
    label: 'Guides',
    children: [
      { key: 'getting-started', label: 'Getting Started' },
      { key: 'installation', label: 'Installation' },
      { key: 'configuration', label: 'Configuration' },
    ],
  },
  {
    key: 'concepts',
    icon: <BulbOutlined />,
    label: 'Core Concepts',
    children: [
      { key: 'architecture', label: 'Architecture' },
      { key: 'authentication', label: 'Authentication' },
      { key: 'deployment', label: 'Deployment' },
    ],
  },
  {
    key: 'api',
    icon: <FileTextOutlined />,
    label: 'API Reference',
    children: [
      { key: 'endpoints', label: 'Endpoints' },
      { key: 'models', label: 'Models' },
      { key: 'errors', label: 'Error Handling' },
    ],
  },
  {
    key: 'faq',
    icon: <QuestionCircleOutlined />,
    label: 'FAQ',
    children: [
      { key: 'common-issues', label: 'Common Issues' },
      { key: 'troubleshooting', label: 'Troubleshooting' },
    ],
  },
];

// Example content components
const ContentComponents: Record<string, React.FC> = {
  'getting-started': () => <h1>Getting Started Guide</h1>,
  'installation': () => <h1>Installation Instructions</h1>,
  // Add more components for other sections
};

const DocsLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('getting-started');
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  const ContentComponent = ContentComponents[selectedKey] || (() => (
    <div>
      <h1>Content for {selectedKey}</h1>
      <p>This is a placeholder for the {selectedKey} content.</p>
    </div>
  ));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: 0, 
        background: colorBgContainer, 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '24px'
      }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Documentation</h1>
      </Header>
      
      <Layout>
        <Sider
          width={260}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            background: colorBgContainer,
            borderRight: '1px solid #f0f0f0'
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['getting-started']}
            defaultOpenKeys={['guides']}
            style={{ height: '100%', borderRight: 0 }}
            items={documentationItems}
            onClick={handleMenuClick}
          />
        </Sider>
        
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 280,
            }}
          >
            <ContentComponent />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DocsLayout;