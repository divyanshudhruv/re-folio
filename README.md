# 📄⛓️‍💥 Refolio

Re-Folio lets you **`beautifully`** showcase your 🤹 **`skills`**, 🗄️ **`projects`**, and 💼 **`experience`** — all in a sleek, modern **`format`** 🧪.

<br>

> [!IMPORTANT]\
> If you find this repository helpful and want to support the project, please give it a `star` on GitHub! Your star helps the development.


> [!NOTE]\
> Expect bugs and errors because the project is currently in `beta` stage.

<br>

## 🙋‍♀️ **What is ReFolio?**

[**`Re-Folio`**](https://re-folio.vercel.app/) is designed to help you create stunning 📄 **`resume portfolios`** with ease. Whether you're a 🎨 **`designer`**, 🖥️ **`developer`**, or 📱 **`creative professional`**, showcase your 🏮 **`skills`** and stand out with our platform's 🛠️ **`tools`**..

<br>

## ✨ **Features**

A modern resume-portfolio template built with the [Once UI Core](https://github.com/once-ui-system/core) package, designed for developers and creatives.

**`1.`** 🔐 Easy Sign-up/Login

**`2.`** 🌐 Personalized Portfolio URL: `re-folio.vercel.app/@username`

**`3.`** 📋 Comprehensive Profile Sections:
    
- `🎯 Navigation Bar`
    
- `👋 Introduction`
    
- `💼 Experience`
    
- `🛠️ Projects`
    
- `🎓 Education` 
    
- `⚡ Skills/Stack` 
    
- `📜 Certifications`
    
- `🏆 Awards`
   
- `🌍 Languages`
    
- `ℹ️ Summary`

**`4.`** ⚙️ Settings Panel: User-friendly interface for updates

**`5.`** 🔒 Password Protection: Optional portfolio security

**`6.`** 📱 Responsive Design: Looks great on all devices

**`7.`** ⚡ Real-time Updates: Instant changes with Supabase

<br>

[**`Try it out`**](https://re-folio.vercel.app/user/me) to see how it works.

<br>

## 🛠️ **Technology Stack**

- ⚛️ **`Next.js`** (React Framework)
- 🟦 **`TypeScript`** (Type Safety)
- 🟨 **`Javascript`** (JSON config)
- 🎨 **`SCSS`** (Design Tokens, Theming)
- 🦸 **`Supabase`** (Database & Auth)
- 🔤 **`Google Fonts`** (Typography)
- ▲ **`Vercel`** (Deployment)
- 🧩 **`Custom Once-UI Design System`** (Reusable components & tokens)

<br>

## 🎥 **Demo**

Check the [demo](https://re-folio.vercel.app/@divyanshudhruv).

<br>

## 🌠 Getting Started

Follow these `instructions` to get a `local copy` of Re-Folio up and running for development.

### ⚙️ Prerequisites

**`1.`** `Node.js` (v18 or newer recommended)

**`2.`** `npm`, `yarn`, or `pnpm`

### 📩 Installation

1.  **🌐 Clone the repository:**
    ```bash
    git clone https://github.com/divyanshudhruv/re-folio.git
    ```

2.  **🧭 Navigate to the project directory:**
    ```bash
    cd re-folio
    ```

3.  **🗃️ Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

4.  **🏡 Set up environment variables:**

    - Copy the `example` environment file:
      ```bash
      cp .env.example .env
      ```
    - Open the `.env` file and add your `Supabase` project `URL` and `anon` key:
      ```env
      SUPABASE_URL=your_supabase_url_here
      SUPABASE_ANON_KEY=your_supabase_anon_key_here
      ```
      You can get these from your Supabase project settings.

5.  **🏃‍♂️ Run the development server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

<br>


<details><summary> <h2>😑 Configuration (admins)</h2>
</summary>
The primary configuration needed for <code>local development</code> is your <code>Supabase credentials</code>, which are stored in the <code>.env</code> file:

- <b><code>SUPABASE_URL</code></b>: Your Supabase project URL.
- <b><code>SUPABASE_ANON_KEY</code></b>: Your Supabase project's public anonymous key.

These are <i>essential</i> for connecting to Supabase for <b>authentication</b>, <b>database operations</b>, and <b>file storage</b>.

</details>

<br>

## 🧩 **Design System & Customization (dev)** 🧩

- 🎨 **Tokens:**
  - All design tokens (colors, spacing, typography) are in [`src/once-ui/tokens/`](src/once-ui/tokens/).
  - Change theme, brand, accent, and more in [`src/app/resources/config.js`](src/app/resources/config.js).

- 🧱 **Components:**
  - Use any component from `@/once-ui/components` in your pages.
  - Example:
    ```tsx
    import { Button, Text, Heading } from "@/once-ui/components";
    ```

- 🌗 **Theming:**
  - Unfortunately supports only dark mode 🥲.

<br>


## 📁 Project Structure

A brief overview of the project's **`directory structure`**:

```
divyanshudhruv/re-folio
├── app/                      # Next.js App Router: Pages, Layouts, API Routes
│   ├── (main)/               # Main application group
│   │   ├── page.tsx          # Landing/Login page
│   │   ├── layout.tsx        # Main layout for public pages
│   │   ├── (components)/...  # Display components for portfolio sections
│   │   ├── [user]/           # Dynamic route for public user portfolios
│   │   │   └── page.tsx
│   │   ├── auth/             # Authentication related pages (e.g., callback)
│   │   └── user/me/          # User's private settings page
│   │       └── page.tsx
│   ├── api/                  # API routes (e.g., OG image generation)
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions, Supabase client
├── components/               # Shared UI components (e.g., Providers)
├── lib/                      # General utility functions
├── public/                   # Static assets (images, etc.)
├── resources/                # UI configuration, icons
├── .env.example              # Example environment variables
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

<br>

## 👥 **Creators**

Connect with us!

**`1.`** **👨‍💻 Divyanshu Dhruv**: [Site](https://divyanshudhruv.is-a.dev) / [LinkedIn](https://www.linkedin.com/in/divyanshudhruv/)

<!-- adding more -->

<br>

## 🚩 **License**

See [`LICENSE`](LICENSE) for details. 📜

<br>

## 🏷️ **Credits**

- 🧩 Built with [Once UI](https://once-ui.com)
- 🦸 Powered by [Supabase](https://supabase.com)

<br>

_Crafted with ☕ by the indie creators for the open-source community._
