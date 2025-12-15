# AI-Powered Conditional Form Builder

A modern React + TypeScript application that enables admins to create dynamic forms using natural language. The system uses OpenAI (LLM) to generate JSON schemas with conditional branching logic, and renders public-facing forms that update in real-time based on user responses.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

1. **Clone or extract the project**
```bash
cd ai-form-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up LLM API (Optional but Recommended)**
   - For AI-powered form generation, you need an API key
   - **Quick Setup**: Create a `.env` file in the project root:
     ```
     VITE_OPENAI_API_KEY=your_api_key_here
     ```
   - Get your OpenAI API key from: https://platform.openai.com/api-keys
   - **Note**: Without an API key, the app will use a basic mock generator

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
conditional-form-builder/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx             
│   │   ├── AdminDashboard.tsx       
│   │   ├── FormCreator.tsx          
│   │   ├── SchemaEditor.tsx          
│   │   ├── FormPreview.tsx           
│   │   ├── FormFieldRenderer.tsx     
│   │   └── PublicFormView.tsx       
│   ├── services/
│   │   ├── llm.service.ts            
│   │   ├── storage.service.ts       
│   │   └── validation.service.ts     
│   ├── types/
│   │   └── form.types.ts            
│   ├── App.tsx                       
│   ├── main.tsx                     
│   └── index.css                     
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

Built with ❤️ using React, TypeScript, and OpenAI
