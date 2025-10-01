# Learning AI with DeepSeek and Copilot / 使用 DeepSeek 和 Copilot 学习 AI

This repository contains a React + Vite application that demonstrates real-time chat integration with DeepSeek's API. The app features a user-friendly interface, local chat history storage, and responsive design powered by Tailwind CSS.  
本仓库包含一个 React + Vite 应用程序，演示了与 DeepSeek API 的实时聊天集成。该应用具有用户友好的界面、本地聊天历史存储功能以及由 Tailwind CSS 驱动的响应式设计。


## Features / 功能特点
- **DeepSeek Chat Integration**: Direct interaction with DeepSeek's chat model through their API  
  DeepSeek 聊天集成：通过 API 直接与 DeepSeek 聊天模型交互
- **Local Chat History**: Automatically saves conversations to local storage for later review  
  本地聊天历史：自动将对话保存到本地存储，便于后续查看
- **Responsive UI**: Mobile-friendly design built with Tailwind CSS  
  响应式界面：使用 Tailwind CSS 构建的移动友好型设计
- **Error Handling**: Graceful error messages for network issues or API problems  
  错误处理：针对网络问题或 API 错误提供友好的错误提示


## Prerequisites / 前提条件
- Node.js (v14.0.0 或更高版本) and npm (v6.0.0 或更高版本)
- DeepSeek API Key (从 [DeepSeek 控制台](https://www.deepseek.com/) 获取)


## Installation & Setup / 安装与设置

### 1. Clone the repository / 克隆仓库
```bash
git clone https://github.com/yourusername/ai-learning.git  # 替换为你的仓库地址
cd ai-learning

```

### 2. Install dependencies / 安装依赖项
```bash
npm install
```

### 3. Configure Environment Variables / 配置环境变量

**Important**: You need to create a `.env` file in the root directory with your DeepSeek API key.

**重要提示**: 你需要在根目录创建一个 `.env` 文件，并添加你的 DeepSeek API 密钥。

#### Option 1: Copy from example file / 从示例文件复制
```bash
cp .env.example .env
```

#### Option 2: Create manually / 手动创建
Create a `.env` file in the root directory:
在根目录创建一个 `.env` 文件：

```env
# Required: Your DeepSeek API Key
# 必需：你的 DeepSeek API 密钥
VITE_OPENAI_API_KEY=your_deepseek_api_key_here

# Optional: API Configuration (uses defaults if not provided)
# 可选：API 配置（如果不提供则使用默认值）
VITE_DEEPSEEK_API_URL=https://api.deepseek.com
VITE_DEFAULT_MODEL=deepseek-chat

# Optional: App Configuration
# 可选：应用配置
VITE_APP_NAME=DeepSeek Chat
VITE_APP_VERSION=1.0.0
```

**Get your API key from**: [DeepSeek Console](https://www.deepseek.com/)  
**获取 API 密钥**: [DeepSeek 控制台](https://www.deepseek.com/)

**Security Note**: The `.env` file is already included in `.gitignore` to keep your API key secure.  
**安全提示**: `.env` 文件已包含在 `.gitignore` 中，以确保你的 API 密钥安全。


### 4. Run the application / 运行应用程序
```bash
npm run dev
``` 
The application will start running at http://localhost:3000.  
打开浏览器并访问 http://localhost:3000 即可查看应用。

## Usage / 使用方法

### Basic Usage / 基本使用
1. **Start the app**: Open your browser and navigate to `http://localhost:3000`  
   **启动应用**: 打开浏览器并访问 `http://localhost:3000`

2. **Ask questions**: Type your question in the text area and click "Submit" or press `Ctrl+Enter`  
   **提问**: 在文本区域输入你的问题，然后点击"Submit"或按 `Ctrl+Enter`

3. **View responses**: The AI response will appear below with proper markdown formatting  
   **查看回复**: AI 回复将显示在下方，支持 Markdown 格式

4. **Manage history**: View past conversations in the right sidebar, click to review  
   **管理历史**: 在右侧边栏查看过去的对话，点击可回顾

### Keyboard Shortcuts / 键盘快捷键
- `Ctrl+Enter` or `Cmd+Enter`: Send message / 发送消息
- `Escape`: Clear current input / 清除当前输入
- `Enter`: New line in textarea / 在文本区域换行

### Features / 功能特点
- **Persistent History**: All conversations are automatically saved locally  
  **持久化历史**: 所有对话都会自动本地保存
- **Markdown Support**: Rich text formatting in responses  
  **Markdown 支持**: 回复中的富文本格式
- **Dark/Light Mode**: Toggle theme with the moon/sun icon  
  **深色/浅色模式**: 使用月亮/太阳图标切换主题
- **Responsive Design**: Works on desktop and mobile  
  **响应式设计**: 支持桌面和移动设备
- **Error Handling**: Clear error messages for API issues  
  **错误处理**: API 问题的清晰错误提示

## Technologies Used / 使用的技术
- **React 18**: Modern JavaScript library for building user interfaces  
- **TypeScript**: Type-safe JavaScript development  
- **Vite**: Lightning-fast build tool and development server  
- **Chakra UI**: Simple, modular and accessible component library  
- **IndexedDB**: Client-side database for persistent chat history  
- **DeepSeek API**: Real-time chat integration with AI models  
- **React Markdown**: Markdown rendering for AI responses  
- **Axios**: HTTP client for API requests   

## License / 许可证

This project is licensed under the MIT License. See the LICENSE file for details.  

本项目采用 MIT 许可证。详情请参阅 LICENSE 文件。 




