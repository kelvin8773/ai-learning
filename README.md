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

Create a `.env` file in the root directory and add your DeepSeek API key:
```
DEEPSEEK_API_KEY=your_api_key_here
```
Replace `your_api_key_here` with your actual DeepSeek API key.  
在根目录创建一个 `.env` 文件，并添加你的 DeepSeek API 密钥：
```DEEPSEEK_API_KEY=your_api_key_here
``` 
替换 `your_api_key_here` 为你的实际 DeepSeek API 密钥。 确保 `.env` 文件是`.gitignore`文件中的忽略项。


### 4. Run the application / 运行应用程序
```bash
npm run dev
``` 
The application will start running at http://localhost:3000.  
打开浏览器并访问 http://localhost:3000 即可查看应用。

## Usage / 使用方法
1. 打开应用后，你将看到一个聊天界面。
2. 在输入框中输入你的问题或指令，然后点击发送按钮或按下 Enter 键。
3. 应用将立即发送请求到 DeepSeek API，并在聊天历史中显示回复。
4. 你可以继续对话，应用会自动保存所有交互记录。
5. 点击“清除历史”按钮可以清空当前会话的聊天历史。

## Technologies Used / 使用的技术
- React: A JavaScript library for building user interfaces  
- Vite: A fast build tool for modern web projects  
- Tailwind CSS: A utility-first CSS framework for rapid UI development  
- DeepSeek API: For real-time chat integration with AI models   

## License / 许可证

This project is licensed under the MIT License. See the LICENSE file for details.  

本项目采用 MIT 许可证。详情请参阅 LICENSE 文件。 




