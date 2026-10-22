import { Platform } from '../components/PlatformProvider';

export interface PlatformContent {
  description: string;
  installation: {
    title: string;
    commands: string[];
    notes?: string;
  };
  implementation: {
    title: string;
    setup: string;
    example: string;
  };
  components: {
    [key: string]: {
      code: string;
      notes?: string;
    };
  };
}

export const platformContent: Record<Platform, PlatformContent> = {
  web: {
    description: "React komponentlari (@bek-ui/react) va CSS tokenlari (@bek-ui/tokens) — Figma «BEK Design System» faylidan yig'ilgan, Light/Dark va RTL tayyor, Tailwind talab qilinmaydi.",
    installation: {
      title: "pnpm orqali o'rnatish",
      commands: [
        "pnpm add @bek-ui/tokens @bek-ui/react",
        "# yoki npm install @bek-ui/tokens @bek-ui/react"
      ],
      notes: "React 18+ kerak. Tokenlar CSS o'zgaruvchilari (--bek-*) sifatida keladi."
    },
    implementation: {
      title: "Uslublarni ulash va import",
      setup: `// main.tsx
import '@bek-ui/tokens/tokens.css';      // ranglar, o'lchamlar, shrift (Light/Dark: data-theme="dark")
import '@bek-ui/tokens/typography.css';  // .bek-text-* matn uslublari
import '@bek-ui/react/styles.css';       // komponent uslublari

import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);`,
      example: `import { Button, Card, TextField } from '@bek-ui/react';

export function Example() {
  return (
    <Card title="Profil" description="Ma'lumotlaringizni yangilang">
      <TextField label="Ism" />
      <Button variant="action" onClick={save}>Saqlash</Button>
    </Card>
  );
}`
    },
    components: {
      button: {
        code: `<Button variant="action">Saqlash</Button>
<Button>Bekor qilish</Button>
<Button variant="outline-danger" size="l">O'chirish</Button>
<Button variant="flat" startIcon={<DownloadIcon />}>Yuklab olish</Button>
<Button loading>Saqlanmoqda</Button>`,
        notes: "Figma 3.1 Button: 22 variant × 5 o'lcham; holatlar CSS orqali"
      },
      input: {
        code: `<TextField label="Email" type="email" />
<TextField label="Telefon" placeholder="+998 __ ___ __ __" supportingText="SMS kod yuboriladi" />
<TextField label="Karta" error supportingText="Karta raqami noto'g'ri" />`,
        notes: "Figma 3.2 Text field: label maydon ichida, supporting text komponentda"
      },
      card: {
        code: `<Card
  title="To'lov"
  description="Visa · 4421"
  badge={<Badge variant="subtle" color="success" size="s">To'langan</Badge>}
  footer={<><Button variant="action">Tasdiqlash</Button><Button variant="outline">Bekor</Button></>}
>
  Buyurtma №4821
</Card>`,
        notes: "Figma 4.3 Card: elevated · outlined · filled"
      }
    }
  },
  android: {
    description: "BEK hozircha faqat React (@bek-ui/react) va CSS (@bek-ui/tokens) kodida. Android uchun nativ kutubxona yo'q — Figma spec (har komponentda Mobile 390 · Tablet 834 · Web 1440) va @bek-ui/tokens ichidagi tokens.json qiymatlaridan Compose/XML temasi quriladi.",
    installation: {
      title: "Tokenlarni olish",
      commands: [
        "pnpm add @bek-ui/tokens   # tokens.json — ranglar (Light/Dark), o'lchamlar (Mobile/Tablet/Web), tipografika",
        "# yoki Figma faylidan: Variables → Export"
      ],
      notes: "Nativ Android paketi rejada; hozircha tokens.json manba sifatida ishlatiladi."
    },
    implementation: {
      title: "Compose temasi tokens.json asosida",
      setup: `// Theme.kt — qiymatlar @bek-ui/tokens/tokens.json dan
val BekLightColors = lightColorScheme(
    primary = Color(0xFF3E63DD),        // accent/default
    background = Color(0xFFF1F3F6),     // bg/base
    surface = Color(0xFFFFFFFF),        // surface/card
    error = Color(0xFFD93134)           // status/danger/default
)`,
      example: `@Composable
fun BekButton(text: String, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        shape = RoundedCornerShape(10.dp),            // radius/control/md (Mobile)
        modifier = Modifier.height(44.dp)             // control/height/lg (Mobile)
    ) { Text(text) }
}`
    },
    components: {
      button: {
        code: `// Nativ komponent yo'q — Figma 3.1 Button spec:
// o'lchamlar M 28 · L 36 · XL 44 · 2XL 52 · 3XL 60; variantlar action · normal · outline · flat`,
        notes: "Compose'da Figma spec va tokens.json bo'yicha quriladi"
      },
      input: {
        code: `// Nativ komponent yo'q — Figma 3.2 Text field spec:
// label maydon ichida, supporting text pastda, focus — _Focus ring (2 px, border/focus)`,
        notes: "Figma 3.2 Text field"
      },
      card: {
        code: `// Nativ komponent yo'q — Figma 4.3 Card spec:
// surface/card fon, border yo'q (GEN-02), radius/surface/md, padding scale/16`,
        notes: "Figma 4.3 Card"
      }
    }
  },
  ios: {
    description: "BEK hozircha faqat React (@bek-ui/react) va CSS (@bek-ui/tokens) kodida. iOS uchun nativ kutubxona yo'q — Figma spec (3 qurilma) va @bek-ui/tokens ichidagi tokens.json qiymatlaridan SwiftUI temasi quriladi.",
    installation: {
      title: "Tokenlarni olish",
      commands: [
        "pnpm add @bek-ui/tokens   # tokens.json — ranglar (Light/Dark), o'lchamlar (Mobile/Tablet/Web), tipografika",
        "# yoki Figma faylidan: Variables → Export"
      ],
      notes: "Nativ iOS paketi rejada; hozircha tokens.json manba sifatida ishlatiladi."
    },
    implementation: {
      title: "SwiftUI temasi tokens.json asosida",
      setup: `// BekTheme.swift — qiymatlar @bek-ui/tokens/tokens.json dan
enum BekColor {
    static let accent  = Color(hex: 0x3E63DD)   // accent/default
    static let bgBase  = Color(hex: 0xF1F3F6)   // bg/base
    static let surface = Color(hex: 0xFFFFFF)   // surface/card
    static let danger  = Color(hex: 0xD93134)   // status/danger/default
}`,
      example: `struct BekButton: View {
    let title: String
    let action: () -> Void
    var body: some View {
        Button(title, action: action)
            .frame(height: 44)                              // control/height/lg (Mobile)
            .background(BekColor.accent)
            .clipShape(RoundedRectangle(cornerRadius: 10))  // radius/control/md
    }
}`
    },
    components: {
      button: {
        code: `// Nativ komponent yo'q — Figma 3.1 Button spec:
// o'lchamlar M 28 · L 36 · XL 44 · 2XL 52 · 3XL 60; variantlar action · normal · outline · flat`,
        notes: "SwiftUI'da Figma spec va tokens.json bo'yicha quriladi"
      },
      input: {
        code: `// Nativ komponent yo'q — Figma 3.2 Text field spec:
// label maydon ichida, supporting text pastda, focus — _Focus ring (2 px, border/focus)`,
        notes: "Figma 3.2 Text field"
      },
      card: {
        code: `// Nativ komponent yo'q — Figma 4.3 Card spec:
// surface/card fon, border yo'q (GEN-02), radius/surface/md, padding scale/16`,
        notes: "Figma 4.3 Card"
      }
    }
  }
};

export function getPlatformContent(platform: Platform): PlatformContent {
  return platformContent[platform];
}

export function getComponentCode(platform: Platform, componentId: string): string {
  return platformContent[platform]?.components[componentId]?.code || 'Code example not available for this platform.';
}