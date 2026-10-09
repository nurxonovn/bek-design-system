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
    description: "Angular komponentlari va CSS frameworklari web ilovalar uchun. Responsive dizayn va zamonaviy web standartlarga mos.",
    installation: {
      title: "NPM orqali o'rnatish",
      commands: [
        "npm install @sqb/angular-components",
        "npm install @sqb/angular-themes",
        "npm install @sqb/angular-icons"
      ],
      notes: "Angular 14+ versiyasi kerak"
    },
    implementation: {
      title: "Angular modulga import qilish",
      setup: `import { NgModule } from '@angular/core';
import { SqbDesignSystemModule } from '@sqb/angular-components';
import { SqbThemeModule } from '@sqb/angular-themes';

@NgModule({
  imports: [
    SqbDesignSystemModule,
    SqbThemeModule.forRoot()
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
      example: `import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: \`
    <sqb-card>
      <sqb-card-header>
        <sqb-card-title>Web Component</sqb-card-title>
      </sqb-card-header>
      <sqb-card-content>
        <sqb-button variant="primary" (click)="handleClick()">
          Click me
        </sqb-button>
      </sqb-card-content>
    </sqb-card>
  \`
})
export class ExampleComponent {
  handleClick() {
    console.log('Button clicked!');
  }
}`
    },
    components: {
      button: {
        code: `<sqb-button 
  variant="primary" 
  size="lg"
  [disabled]="false"
  (click)="handleClick()">
  Primary Button
</sqb-button>

<!-- Variantlar -->
<sqb-button variant="secondary">Secondary</sqb-button>
<sqb-button variant="outline">Outline</sqb-button>
<sqb-button variant="ghost">Ghost</sqb-button>

<!-- O'lchamlar -->
<sqb-button size="sm">Small</sqb-button>
<sqb-button size="md">Medium</sqb-button>
<sqb-button size="lg">Large</sqb-button>`,
        notes: "Responsive va keyboard navigation qo'llab-quvvatlaydi"
      },
      input: {
        code: `<sqb-input
  label="Username"
  placeholder="Enter your username"
  [(ngModel)]="username"
  [required]="true"
  [error]="usernameError"
  hint="Must be at least 3 characters">
</sqb-input>

<!-- Turlar -->
<sqb-input type="email" label="Email"></sqb-input>
<sqb-input type="password" label="Password"></sqb-input>
<sqb-input type="number" label="Age"></sqb-input>`,
        notes: "Form validation va accessibility qo'llab-quvvatlaydi"
      },
      card: {
        code: `<sqb-card [elevated]="true">
  <sqb-card-header>
    <sqb-card-title>Card Title</sqb-card-title>
    <sqb-card-subtitle>Card Subtitle</sqb-card-subtitle>
  </sqb-card-header>
  
  <sqb-card-content>
    <p>This is the main content of the card.</p>
  </sqb-card-content>
  
  <sqb-card-footer>
    <sqb-button variant="outline">Cancel</sqb-button>
    <sqb-button variant="primary">Save</sqb-button>
  </sqb-card-footer>
</sqb-card>`,
        notes: "Responsive va nested card qo'llab-quvvatlaydi"
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
        
        // SQB Components ni sozlash
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
        "pod 'SQBIOSComponents', '~> 1.0'",
        "pod 'SQBIOSThemes', '~> 1.0'",
        "pod 'SQBIOSIcons', '~> 1.0'"
      ],
      notes: "iOS 14.0+ kerak, Swift 5.5+"
    },
    implementation: {
      title: "iOS Application setup",
      setup: `// AppDelegate.swift
import UIKit
import SQBIOSComponents
import SQBIOSThemes

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // SQB Components configuration
        SQBThemeManager.shared.configure {
            $0.primaryColor = UIColor(hex: "#2C58A5")
            $0.theme = .light
            $0.enableHapticFeedback = true
        }
        
        return true
    }
}`,
      example: `// ViewController.swift
import UIKit
import SQBIOSComponents

class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        let button = SQBButton()
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
let primaryButton = SQBButton()
primaryButton.title = "Primary Button"
primaryButton.variant = .primary
primaryButton.size = .large
primaryButton.isEnabled = true
primaryButton.addTarget(self, action: #selector(handleTap), for: .touchUpInside)

// Button variants
let secondaryButton = SQBButton()
secondaryButton.variant = .secondary

let outlineButton = SQBButton()
outlineButton.variant = .outline

let ghostButton = SQBButton()
ghostButton.variant = .ghost

// SwiftUI Usage
import SwiftUI
import SQBIOSComponents

struct ContentView: View {
    var body: some View {
        VStack(spacing: 16) {
            SQBButton("Primary Button", variant: .primary, size: .large) {
                // Handle button tap
                print("Button tapped")
            }
            
            SQBButton("Secondary Button", variant: .secondary) {
                // Handle tap
            }
        }
    }
}`,
        notes: "Haptic feedback va iOS accessibility qo'llab-quvvatlaydi"
      },
      input: {
        code: `// UIKit Usage
let inputField = SQBInputField()
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
            SQBInputField(
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
let cardView = SQBCardView()
cardView.title = "Card Title"
cardView.subtitle = "Card Subtitle"
cardView.content = "This is the main content of the card."
cardView.isElevated = true

// Add action buttons
let cancelButton = SQBButton()
cancelButton.title = "Cancel"
cancelButton.variant = .outline

let saveButton = SQBButton()
saveButton.title = "Save"
saveButton.variant = .primary

cardView.addFooterButton(cancelButton)
cardView.addFooterButton(saveButton)

// SwiftUI Usage
struct CardExample: View {
    var body: some View {
        SQBCard(isElevated: true) {
            VStack(alignment: .leading, spacing: 12) {
                SQBCardHeader {
                    VStack(alignment: .leading) {
                        Text("Card Title")
                            .sqbCardTitle()
                        Text("Card Subtitle")
                            .sqbCardSubtitle()
                    }
                }
                
                SQBCardContent {
                    Text("This is the main content of the card.")
                        .sqbCardContent()
                }
                
                SQBCardFooter {
                    HStack {
                        Spacer()
                        SQBButton("Cancel", variant: .outline) {
                            // Handle cancel
                        }
                        SQBButton("Save", variant: .primary) {
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