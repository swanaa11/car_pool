# Mobile Build — Expo / EAS

## Same codebase for Android + iOS — how it works
- **One React Native codebase** in `apps/mobile/` using **Expo** (managed workflow) + **Expo Router** (file-based routing, similar to Next.js).
- `app.json` defines both `ios.bundleIdentifier` (`de.carpool.app`) and `android.package` (`de.carpool.app`) — same JS bundle runs on both.
- Platform differences are handled by Expo's cross-platform APIs (`expo-location`, `expo-notifications`, etc.) + `Platform.OS` checks where needed (e.g., `KeyboardAvoidingView` behavior).
- Assets (`icon.png`, `splash.png`, `adaptive-icon.png`) are shared; iOS/Android generate native projects at build time via `npx expo prebuild` (managed by EAS).
- Push notifications via `expo-notifications` (same API, different push services underneath).

## Local dev
```bash
cd apps/mobile
cp .env.example .env.local  # fill EXPO_PUBLIC_SUPABASE_URL etc.
pnpm install
pnpm dev        # starts Expo Go (scan QR)
pnpm android    # Android emulator
pnpm ios        # iOS simulator (macOS only)
```
Expo Go lets you test without building native binaries.

## Build types
- **Development** (`eas build --profile development`): includes dev client, hot reload, can load arbitrary JS. Install on device via QR.
- **Preview** (`eas build --platform android --profile preview`): APK (Android) or internal TestFlight (iOS) for sharing with testers. No store submission.
- **Production** (`eas build --platform all --profile production`): AAB (Android) + IPA (iOS) for store submission. `autoIncrement: true`.

## EAS setup
```bash
npm i -g eas-cli
eas login                 # Expo account (free)
eas build:configure       # already configured in eas.json
```

## Android — APK for testing
```bash
eas build --platform android --profile preview
# → download APK from EAS dashboard → install on device (allow unknown sources)
```

## Android — AAB for Play Store
```bash
eas build --platform android --profile production
# → AAB in EAS dashboard → Google Play Console → Production → Create release → Upload AAB
```
Play Console requirements: app name, icons, screenshots, privacy policy URL, content rating, GDPR data safety form.

## iOS — TestFlight / App Store
Requirements:
- Apple Developer Program membership ($99/year)
- Bundle Identifier `de.carpool.app` registered in https://developer.apple.com
- Certificates & provisioning profiles — EAS handles automatically (`eas credentials`)
```bash
eas build --platform ios --profile preview   # for internal testing
eas build --platform ios --profile production
eas submit --platform ios --latest           # submits to App Store Connect → TestFlight → App Store
```
TestFlight: add testers via App Store Connect. App Review needs privacy policy, screenshots, etc.

## Env vars for EAS
Set in `eas.json` or via `eas secret:create`:
```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

## Icons / Splash
Placeholders in `apps/mobile/assets/` — replace before production:
- `icon.png` 1024×1024
- `adaptive-icon.png` 1024×1024 (Android, foreground on transparent)
- `splash.png` 1284×2778
- `favicon.png` 48×48

## Deep linking
Scheme `carpool://` configured in `app.json`. Use `expo-linking` to handle `carpool://ride/123` etc.
