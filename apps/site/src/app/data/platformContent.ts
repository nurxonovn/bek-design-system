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
    description: "React komponentlari (@bek/react) va CSS tokenlari (@bek/tokens) — Figma «BEK Design System» faylidan yig'ilgan, Light/Dark va RTL tayyor, Tailwind talab qilinmaydi.",
    installation: {
      title: "pnpm orqali o'rnatish",
      commands: [
        "pnpm add @bek/tokens @bek/react",
        "# yoki npm install @bek/tokens @bek/react"
      ],
      notes: "React 18+ kerak. Tokenlar CSS o'zgaruvchilari (--bek-*) sifatida keladi."
    },
    implementation: {
      title: "Uslublarni ulash va import",
      setup: `// main.tsx
import '@bek/tokens/tokens.css';      // ranglar, o'lchamlar, shrift (Light/Dark: data-theme="dark")
import '@bek/tokens/typography.css';  // .bek-text-* matn uslublari
import '@bek/react/styles.css';       // komponent uslublari

import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);`,
      example: `import { Button, Card, TextField } from '@bek/react';

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
    description: "Android native komponentlari Material Design 3 asosida. Kotlin va Java da ishlatish uchun optimallashtirilgan.",
    installation: {
      title: "Gradle Dependencies",
      commands: [
        "implementation 'com.sqb:android-components:1.0.0'",
        "implementation 'com.sqb:android-themes:1.0.0'",
        "implementation 'com.sqb:android-icons:1.0.0'"
      ],
      notes: "Android API 21+ (Android 5.0) kerak"
    },
    implementation: {
      title: "Android Application setup",
      setup: `// Application.kt
import com.sqb.components.SqbComponentsConfig
import com.sqb.themes.SqbTheme

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // BEK Components ni sozlash
        SqbComponentsConfig.initialize(this) {
            theme = SqbTheme.LIGHT
            primaryColor = Color.parseColor("#2C58A5")
            enableRippleEffects = true
        }
    }
}`,
      example: `// MainActivity.kt
import com.sqb.components.SqbButton
import com.sqb.components.SqbCard

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val button = SqbButton(this).apply {
            text = "Primary Button"
            variant = SqbButton.Variant.PRIMARY
            size = SqbButton.Size.LARGE
            setOnClickListener { 
                // Handle click
            }
        }
        
        // Layout ga qo'shish
        findViewById<ViewGroup>(R.id.container).addView(button)
    }
}`
    },
    components: {
      button: {
        code: `<!-- XML Layout -->
<com.sqb.components.SqbButton
    android:id="@+id/primaryButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Primary Button"
    app:sqb_variant="primary"
    app:sqb_size="large"
    app:sqb_enabled="true" />

<!-- Kotlin Code -->
val button = findViewById<SqbButton>(R.id.primaryButton)
button.setOnClickListener { 
    // Handle button click
    Log.d("Button", "Primary button clicked")
}

// Programmatik yaratish
val secondaryButton = SqbButton(this).apply {
    text = "Secondary"
    variant = SqbButton.Variant.SECONDARY
    size = SqbButton.Size.MEDIUM
}`,
        notes: "Material Design ripple effect va state management"
      },
      input: {
        code: `<!-- XML Layout -->
<com.sqb.components.SqbInputField
    android:id="@+id/usernameInput"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Enter your username"
    app:sqb_label="Username"
    app:sqb_required="true"
    app:sqb_errorMessage="Username is required"
    app:sqb_helperText="Must be at least 3 characters" />

<!-- Kotlin Code -->
val inputField = findViewById<SqbInputField>(R.id.usernameInput)
inputField.apply {
    inputType = InputType.TYPE_CLASS_TEXT
    addTextChangedListener(object : TextWatcher {
        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            validateInput(s.toString())
        }
    })
}`,
        notes: "Real-time validation va error handling"
      },
      card: {
        code: `<!-- XML Layout -->
<com.sqb.components.SqbCard
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:sqb_elevated="true"
    app:sqb_cornerRadius="8dp">
    
    <LinearLayout
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:padding="16dp">
        
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Card Title"
            style="@style/SqbCardTitle" />
            
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Card content goes here"
            style="@style/SqbCardContent"
            android:layout_marginTop="8dp" />
            
        <LinearLayout
            android:orientation="horizontal"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:gravity="end">
            
            <com.sqb.components.SqbButton
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Cancel"
                app:sqb_variant="outline" />
                
            <com.sqb.components.SqbButton
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Save"
                app:sqb_variant="primary"
                android:layout_marginStart="8dp" />
                
        </LinearLayout>
        
    </LinearLayout>
    
</com.sqb.components.SqbCard>`,
        notes: "Elevation va shadow effects Material Design 3 asosida"
      }
    }
  },
  ios: {
    description: "iOS native komponentlari Human Interface Guidelines asosida. Swift va SwiftUI da ishlatish uchun optimallashtirilgan.",
    installation: {
      title: "CocoaPods Installation",
      commands: [
        "pod 'BEKIOSComponents', '~> 1.0'",
        "pod 'BEKIOSThemes', '~> 1.0'",
        "pod 'BEKIOSIcons', '~> 1.0'"
      ],
      notes: "iOS 14.0+ kerak, Swift 5.5+"
    },
    implementation: {
      title: "iOS Application setup",
      setup: `// AppDelegate.swift
import UIKit
import BEKIOSComponents
import BEKIOSThemes

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // BEK Components configuration
        BEKThemeManager.shared.configure {
            $0.primaryColor = UIColor(hex: "#2C58A5")
            $0.theme = .light
            $0.enableHapticFeedback = true
        }
        
        return true
    }
}`,
      example: `// ViewController.swift
import UIKit
import BEKIOSComponents

class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        let button = BEKButton()
        button.title = "Primary Button"
        button.variant = .primary
        button.size = .large
        button.addTarget(self, action: #selector(buttonTapped), for: .touchUpInside)
        
        view.addSubview(button)
        // Auto Layout constraints...
    }
    
    @objc private func buttonTapped() {
        // Handle button tap
        print("Primary button tapped")
    }
}`
    },
    components: {
      button: {
        code: `// UIKit Usage
let primaryButton = BEKButton()
primaryButton.title = "Primary Button"
primaryButton.variant = .primary
primaryButton.size = .large
primaryButton.isEnabled = true
primaryButton.addTarget(self, action: #selector(handleTap), for: .touchUpInside)

// Button variants
let secondaryButton = BEKButton()
secondaryButton.variant = .secondary

let outlineButton = BEKButton()
outlineButton.variant = .outline

let ghostButton = BEKButton()
ghostButton.variant = .ghost

// SwiftUI Usage
import SwiftUI
import BEKIOSComponents

struct ContentView: View {
    var body: some View {
        VStack(spacing: 16) {
            BEKButton("Primary Button", variant: .primary, size: .large) {
                // Handle button tap
                print("Button tapped")
            }
            
            BEKButton("Secondary Button", variant: .secondary) {
                // Handle tap
            }
        }
    }
}`,
        notes: "Haptic feedback va iOS accessibility qo'llab-quvvatlaydi"
      },
      input: {
        code: `// UIKit Usage
let inputField = BEKInputField()
inputField.label = "Username"
inputField.placeholder = "Enter your username"
inputField.isRequired = true
inputField.errorMessage = "Username is required"
inputField.helperText = "Must be at least 3 characters"
inputField.inputType = .text

inputField.onTextChanged = { [weak self] text in
    self?.validateUsername(text)
}

// SwiftUI Usage
struct LoginForm: View {
    @State private var username: String = ""
    @State private var isValid: Bool = true
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            BEKInputField(
                "Username",
                text: $username,
                placeholder: "Enter your username",
                isRequired: true,
                isValid: $isValid,
                helperText: "Must be at least 3 characters"
            )
            .onTextChanged { text in
                isValid = text.count >= 3
            }
        }
    }
}`,
        notes: "Real-time validation va iOS keyboard handling"
      },
      card: {
        code: `// UIKit Usage
let cardView = BEKCardView()
cardView.title = "Card Title"
cardView.subtitle = "Card Subtitle"
cardView.content = "This is the main content of the card."
cardView.isElevated = true

// Add action buttons
let cancelButton = BEKButton()
cancelButton.title = "Cancel"
cancelButton.variant = .outline

let saveButton = BEKButton()
saveButton.title = "Save"
saveButton.variant = .primary

cardView.addFooterButton(cancelButton)
cardView.addFooterButton(saveButton)

// SwiftUI Usage
struct CardExample: View {
    var body: some View {
        BEKCard(isElevated: true) {
            VStack(alignment: .leading, spacing: 12) {
                BEKCardHeader {
                    VStack(alignment: .leading) {
                        Text("Card Title")
                            .sqbCardTitle()
                        Text("Card Subtitle")
                            .sqbCardSubtitle()
                    }
                }
                
                BEKCardContent {
                    Text("This is the main content of the card.")
                        .sqbCardContent()
                }
                
                BEKCardFooter {
                    HStack {
                        Spacer()
                        BEKButton("Cancel", variant: .outline) {
                            // Handle cancel
                        }
                        BEKButton("Save", variant: .primary) {
                            // Handle save
                        }
                    }
                }
            }
        }
    }
}`,
        notes: "iOS shadow effects va corner radius optimization"
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