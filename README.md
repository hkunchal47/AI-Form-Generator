# AI-Powered Conditional Form Builder

A modern React + TypeScript application that enables admins to create dynamic forms using natural language. The system uses OpenAI (LLM) to generate JSON schemas with conditional branching logic, and renders public-facing forms that update in real-time based on user responses.

## 🌟 Features

### Core Functionality
- **AI-Powered Form Generation**: Describe your form in natural language and let OpenAI create the complete schema
- **Dynamic Conditional Logic**: Fields appear/disappear based on user responses
- **Nested Conditions**: Support for recursive conditional logic
- **Live Preview**: See exactly how your form behaves as you build it
- **Smart Validation**: Built-in validation using Zod for data integrity
- **Real-time Updates**: Forms recalculate and update instantly as users interact

### Admin Portal
- **Schema Generation & Editing**: AI-generated schemas with manual editing capability
- **Live Preview**: Test conditional behavior instantly
- **Form Management**: Full CRUD operations for forms
- **Export/Import**: JSON schema export and import functionality
- **Public Links**: Share forms with a simple URL
- **Response Tracking**: View all submissions with conditional context

### Public User Flow
- Clean, responsive form interface
- Real-time field injection/removal based on selections
- Dynamic validation with helpful error messages
- Success confirmation after submission
- Mobile-friendly design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser

### Installation

1. **Clone or extract the project**
```bash
cd conditional-form-builder
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
   - See `SETUP_LLM.md` for detailed instructions and alternative options
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
│   │   ├── HomePage.tsx              # Landing page
│   │   ├── AdminDashboard.tsx        # Admin dashboard with form list
│   │   ├── FormCreator.tsx           # Form creation/editing page
│   │   ├── SchemaEditor.tsx          # JSON schema editor component
│   │   ├── FormPreview.tsx           # Live preview component
│   │   ├── FormFieldRenderer.tsx     # Dynamic field renderer
│   │   └── PublicFormView.tsx        # Public form view for users
│   ├── services/
│   │   ├── llm.service.ts            # OpenAI integration
│   │   ├── storage.service.ts        # LocalStorage management
│   │   └── validation.service.ts     # Zod validation logic
│   ├── types/
│   │   └── form.types.ts             # TypeScript type definitions
│   ├── App.tsx                       # Main app with routing
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 Usage Guide

### Creating a Form

1. **Navigate to Admin Dashboard**
   - Click "Get Started" or "Go to Dashboard" from the homepage
   - Click "Create New Form"

2. **Describe Your Form with AI**
   ```
   Example prompts:
   - "Create a patient intake form with diabetes-related conditional questions"
   - "Build a job application form that shows different questions based on experience level"
   - "Make a customer feedback survey with product-specific follow-ups"
   ```

3. **Generate and Review**
   - Click "Generate Form with AI"
   - Review the generated schema in the editor
   - Check the live preview to test conditional logic

4. **Edit if Needed**
   - Manually edit the JSON schema
   - Add or modify fields, conditions, and options
   - Preview updates in real-time

5. **Save and Share**
   - Click "Save Form"
   - Copy the public link from the dashboard
   - Share with your audience

### Form Schema Structure

```json
{
  "title": "Form Title",
  "description": "Optional description",
  "fields": [
    {
      "id": "field-0",
      "type": "radio",
      "label": "Are you diabetic?",
      "options": ["Yes", "No"],
      "required": true,
      "conditions": {
        "Yes": [
          {
            "type": "number",
            "label": "How many years?",
            "required": true
          },
          {
            "type": "text",
            "label": "Current medications",
            "required": false
          }
        ],
        "No": []
      }
    }
  ]
}
```

### Supported Field Types

- **text**: Single-line text input
- **number**: Numeric input
- **email**: Email address with validation
- **textarea**: Multi-line text input
- **date**: Date picker
- **radio**: Single selection from options
- **checkbox**: Multiple selections
- **select**: Dropdown single selection
- **multiselect**: Dropdown multiple selections

### Conditional Logic

Fields can have a `conditions` property that maps answer values to arrays of new fields:

```json
{
  "type": "radio",
  "label": "Gender",
  "options": ["Male", "Female", "Other"],
  "conditions": {
    "Female": [
      {
        "type": "radio",
        "label": "Are you pregnant?",
        "options": ["Yes", "No"]
      }
    ]
  }
}
```

**Features:**
- Conditions can be nested (recursive)
- Works with: radio, checkbox, select, multiselect
- Fields appear/disappear instantly based on selections

## 🔧 Technical Implementation

### LLM Integration (OpenAI)

The app uses OpenAI GPT-4o-mini to generate form schemas:

```typescript
// services/llm.service.ts
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  }),
});
```

**Prompt Engineering:**
- Clear instructions for JSON-only output
- Supported field types specification
- Conditional logic requirements
- Schema structure examples

### Validation (Zod)

Dynamic Zod schemas are generated based on visible fields:

```typescript
// services/validation.service.ts
generateZodSchema(fields, responses) {
  // Recursively process fields
  // Generate appropriate Zod validators
  // Handle conditional visibility
}
```

### Storage (LocalStorage)

Forms and responses are stored in browser LocalStorage:
- Persistent across sessions
- Easy export/import
- No backend required for demo

## 🎨 Styling

- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable form elements
- **Lucide Icons**: Modern icon set

## 🔒 Data Flow

1. **Admin creates form** → LLM generates schema → Saved to LocalStorage
2. **User accesses form** → Schema loaded → Base fields rendered
3. **User selects answer** → Triggers recalculation → Fields injected/removed
4. **User submits** → Validation → Saved to LocalStorage
5. **Admin views responses** → Full context preserved

## 🚧 Error Handling

### Schema Validation
- JSON syntax errors detection
- Invalid field type warnings
- Missing required properties alerts
- Helpful suggestions for fixes

### Form Validation
- Real-time field validation
- Clear error messages
- Required field enforcement
- Type-specific validation (email, number, etc.)

### LLM Errors
- API connection failure handling
- Invalid schema detection
- Retry mechanisms
- User-friendly error messages

## 🎯 Key Features Demonstration

### Example Use Cases

1. **Medical Intake Forms**
   - Conditional questions based on conditions
   - Medication tracking for specific diseases
   - Dynamic symptom questionnaires

2. **Job Applications**
   - Experience-based question flows
   - Education-specific requirements
   - Conditional reference requests

3. **Insurance Forms**
   - Policy type-specific questions
   - Coverage-based follow-ups
   - Dependent information collection

4. **Customer Surveys**
   - Product-specific feedback
   - Satisfaction-driven follow-ups
   - Demographic-based questions

## 📝 Scripts

```json
{
  "dev": "vite",              // Start development server
  "build": "tsc && vite build", // Build for production
  "preview": "vite preview"    // Preview production build
}
```

## 🔮 Future Enhancements

Potential improvements:
- Backend integration (Firebase, Supabase)
- Multi-language support
- Advanced analytics
- Form templates library
- Collaborative editing
- PDF export of responses
- Email notifications
- Webhook integrations
- Custom themes
- Drag-and-drop form builder

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Fork and modify
- Add new field types
- Improve prompt engineering
- Enhance UI/UX
- Add backend integration

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🙏 Acknowledgments

- **OpenAI**: For intelligent schema generation
- **React Team**: For the amazing framework
- **Tailwind CSS**: For utility-first styling
- **Zod**: For type-safe validation
- **Lucide**: For beautiful icons

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Review the schema structure
3. Validate JSON syntax
4. Test conditional logic in preview

---

Built with ❤️ using React, TypeScript, and OpenAI
